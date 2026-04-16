// ============================================================
//  RAZOR BARBER — calendario.js
//  FullCalendar + Supabase · Sistema de citas
// ============================================================

(() => {
  // ── 1. Cliente Supabase (CDN UMD) ──────────────────────────
  const { createClient } = supabase;
  const db = createClient(SUPABASE_URL, SUPABASE_ANON);

  // ── 2. Estado ───────────────────────────────────────────────
  let calendar = null;
  let selectedDate = null;

  const SERVICIOS = [
    { label: "Corte clásico",    precio: "$20.000" },
    { label: "Fade + barba",     precio: "$25.000" },
    { label: "Degradado suave",  precio: "$20.000" },
    { label: "Navaja premium",   precio: "25.000" },
  ];

  // Horas disponibles (puedes ajustar)
  const HORAS = [
    "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
    "12:00","12:30","13:00","13:30","14:00","14:30",
    "15:00","15:30","16:00","16:30","17:00","17:30",
    "18:00","18:30",
  ];

  // ── 3. Cargar citas desde Supabase ──────────────────────────
  async function fetchCitas() {
    const { data, error } = await db
      .from("citas")
      .select("id, nombre_cliente, fecha_hora, servicio");

    if (error) {
      console.error("Error cargando citas:", error.message);
      return [];
    }

    return data.map(c => ({
      id:    c.id,
      title: `${c.nombre_cliente} — ${c.servicio}`,
      start: c.fecha_hora,
      backgroundColor: "#b8860b",
      borderColor:     "#d4a017",
      textColor:       "#0a0a0a",
      extendedProps:   { nombre: c.nombre_cliente, servicio: c.servicio },
    }));
  }

  // ── 4. Guardar cita en Supabase ─────────────────────────────
  async function guardarCita(nombre, fechaHora, servicio) {
    const { data, error } = await db
      .from("citas")
      .insert([{ nombre_cliente: nombre, fecha_hora: fechaHora, servicio }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ── 5. Eliminar cita ─────────────────────────────────────────
  async function eliminarCita(id) {
    const { error } = await db.from("citas").delete().eq("id", id);
    if (error) throw error;
  }

  // ── 6. Verificar si una hora ya está ocupada ─────────────────
  async function horaOcupada(fechaHora) {
    const { data } = await db
      .from("citas")
      .select("id")
      .eq("fecha_hora", fechaHora);
    return data && data.length > 0;
  }

  // ── 7. Inicializar FullCalendar ──────────────────────────────
  async function initCalendar() {
    const el = document.getElementById("calendar");
    if (!el) return;

    const eventos = await fetchCitas();

    calendar = new FullCalendar.Calendar(el, {
      locale:          "es",
      initialView:     "dayGridMonth",
      headerToolbar: {
        left:   "prev,next today",
        center: "title",
        right:  "dayGridMonth,timeGridWeek,listWeek",
      },
      buttonText: {
        today:    "Hoy",
        month:    "Mes",
        week:     "Semana",
        list:     "Lista",
      },
      events:          eventos,
      selectable:      true,
      selectMirror:    true,
      nowIndicator:    true,
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5, 6],
        startTime:  "09:00",
        endTime:    "19:00",
      },

      // Clic en un día → abrir modal de nueva cita
      dateClick(info) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (info.date < hoy) {
          showToast("No puedes agendar en fechas pasadas", "error");
          return;
        }
        selectedDate = info.dateStr;
        openModalNuevaCita(info.dateStr);
      },

      // Clic en evento → ver detalle / eliminar
      eventClick(info) {
        const ev = info.event;
        openModalDetalle(ev);
      },

      // Estilos del calendario para que combine con la web
      dayCellClassNames: () => ["cal-day"],
    });

    calendar.render();
  }

  // ── 8. Modal nueva cita ──────────────────────────────────────
  function openModalNuevaCita(dateStr) {
    // Construir opciones de hora
    const horasOpts = HORAS.map(h => `<option value="${h}">${h}</option>`).join("");
    const serviciosOpts = SERVICIOS.map(s =>
      `<option value="${s.label}">${s.label} · ${s.precio}</option>`
    ).join("");

    // Formatear fecha para mostrar
    const fecha = new Date(dateStr + "T12:00:00");
    const fechaTexto = fecha.toLocaleDateString("es-CO", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    document.getElementById("modalCitaFecha").textContent = fechaTexto;
    document.getElementById("citaHora").innerHTML = horasOpts;
    document.getElementById("citaServicio").innerHTML = serviciosOpts;
    document.getElementById("citaNombre").value = "";
    document.getElementById("modalNuevaCita").classList.add("open");
  }

  function closeModalNuevaCita() {
    document.getElementById("modalNuevaCita").classList.remove("open");
    selectedDate = null;
  }

  // ── 9. Modal detalle / eliminar ──────────────────────────────
  function openModalDetalle(ev) {
    const fecha = new Date(ev.start).toLocaleString("es-CO", {
      weekday: "long", day: "numeric", month: "long",
      hour: "2-digit", minute: "2-digit"
    });
    document.getElementById("detalleFecha").textContent = fecha;
    document.getElementById("detalleNombre").textContent = ev.extendedProps.nombre;
    document.getElementById("detalleServicio").textContent = ev.extendedProps.servicio;
    document.getElementById("btnEliminarCita").onclick = () => confirmarEliminar(ev.id, ev);
    document.getElementById("modalDetalle").classList.add("open");
  }

  function closeModalDetalle() {
    document.getElementById("modalDetalle").classList.remove("open");
  }

  async function confirmarEliminar(id, ev) {
    if (!confirm("¿Eliminar esta cita?")) return;
    try {
      await eliminarCita(id);
      ev.remove();
      closeModalDetalle();
      showToast("Cita eliminada", "success");
    } catch (e) {
      showToast("Error al eliminar: " + e.message, "error");
    }
  }

  // ── 10. Guardar nueva cita (submit) ──────────────────────────
  async function submitNuevaCita() {
    const nombre   = document.getElementById("citaNombre").value.trim();
    const hora     = document.getElementById("citaHora").value;
    const servicio = document.getElementById("citaServicio").value;

    if (!nombre) { showToast("Ingresa el nombre del cliente", "error"); return; }
    if (!selectedDate) return;

    const fechaHora = `${selectedDate}T${hora}:00`;

    // Verificar disponibilidad
    const ocupada = await horaOcupada(fechaHora);
    if (ocupada) {
      showToast("Esa hora ya está ocupada. Elige otra.", "error");
      return;
    }

    const btn = document.getElementById("btnGuardarCita");
    btn.disabled = true;
    btn.textContent = "Guardando...";

    try {
      const nuevaCita = await guardarCita(nombre, fechaHora, servicio);

      // Agregar al calendario sin recargar
      calendar.addEvent({
        id:              String(nuevaCita.id),
        title:           `${nombre} — ${servicio}`,
        start:           fechaHora,
        backgroundColor: "#b8860b",
        borderColor:     "#d4a017",
        textColor:       "#0a0a0a",
        extendedProps:   { nombre, servicio },
      });

      closeModalNuevaCita();
      showToast(`Cita de ${nombre} agendada correctamente`, "success");

      // Ofrecer enviar recordatorio por WhatsApp
      const fechaTexto = new Date(fechaHora).toLocaleString("es-CO", {
        weekday: "long", day: "numeric", month: "long",
        hour: "2-digit", minute: "2-digit"
      });
      const msg = encodeURIComponent(
        `Hola ${nombre}, tu cita en Razor Barber está confirmada para el ${fechaTexto}. Servicio: ${servicio}. ¡Te esperamos! 💈`
      );
      if (confirm("¿Enviar recordatorio por WhatsApp al cliente?")) {
        window.open(`https://wa.me/${WHATSAPP_NUM}?text=${msg}`, "_blank");
      }

    } catch (e) {
      showToast("Error al guardar: " + e.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Confirmar cita";
    }
  }

  // ── 11. Toast de notificación ─────────────────────────────────
  function showToast(msg, tipo = "success") {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = `toast toast-${tipo} show`;
    setTimeout(() => t.classList.remove("show"), 3500);
  }

  // ── 12. Exponer funciones al HTML ─────────────────────────────
  window.RazorCalendar = {
    closeModalNuevaCita,
    closeModalDetalle,
    submitNuevaCita,
  };

  // ── 13. Arrancar cuando el DOM esté listo ─────────────────────
  document.addEventListener("DOMContentLoaded", initCalendar);
})();