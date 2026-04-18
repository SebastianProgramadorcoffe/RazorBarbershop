// ============================================================
//  RAZOR BARBER — calendario.js
//  FullCalendar + Supabase · Sistema de citas con roles
//
//  ROLES:
//  · Visitante — solo ve días bloqueados (sin nombres)
//  · Admin     — ve todo, puede crear y eliminar citas
// ============================================================

(() => {
  // ── 1. Cliente Supabase ─────────────────────────────────────
  const { createClient } = supabase;
  const db = createClient(SUPABASE_URL, SUPABASE_ANON);

  // ── 2. Estado global ────────────────────────────────────────
  let calendar     = null;
  let selectedDate = null;
  let esAdmin      = false;   // cambia tras login exitoso

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


  // ── 3. Auth — verificar sesión activa al cargar ─────────────
  async function verificarSesion() {
    const { data: { session } } = await db.auth.getSession();
    if (session) {
      esAdmin = true;
      actualizarUIAdmin(true);
    }

    // Escuchar cambios de sesión (login / logout)
    db.auth.onAuthStateChange((_event, session) => {
      esAdmin = !!session;
      actualizarUIAdmin(esAdmin);
      if (calendar) {
        // Recargar eventos con el nivel de detalle correcto
        calendar.removeAllEvents();
        fetchCitas().then(evs => evs.forEach(e => calendar.addEvent(e)));
      }
    });
  }

  // ── 4. Login con email/contraseña ───────────────────────────
  async function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const pass  = document.getElementById("loginPass").value;
    const btn   = document.getElementById("btnLogin");
    const err   = document.getElementById("loginError");

    if (!email || !pass) {
      err.textContent = "Completa los dos campos.";
      return;
    }

    btn.disabled    = true;
    btn.textContent = "Verificando...";
    err.textContent = "";

    const { error } = await db.auth.signInWithPassword({ email, password: pass });

    btn.disabled    = false;
    btn.textContent = "Ingresar";

    if (error) {
      err.textContent = "Credenciales incorrectas.";
      return;
    }

    cerrarModalLogin();
    showToast("Bienvenido, Sebastian", "success");
  }

  // ── 5. Logout ────────────────────────────────────────────────
  async function logout() {
    await db.auth.signOut();
    showToast("Sesión cerrada", "success");
  }

  // ── 6. Actualizar UI según rol ───────────────────────────────
  function actualizarUIAdmin(admin) {
    // Botón del nav
    const btnLogin  = document.getElementById("navBtnLogin");
    const btnLogout = document.getElementById("navBtnLogout");
    const adminBadge = document.getElementById("adminBadge");

    if (btnLogin)  btnLogin.style.display  = admin ? "none"         : "inline-flex";
    if (btnLogout) btnLogout.style.display = admin ? "inline-flex"  : "none";
    if (adminBadge) adminBadge.style.display = admin ? "inline-flex" : "none";

    // Texto de ayuda del calendario
    const hint = document.getElementById("calendarHint");
    if (hint) {
      hint.textContent = admin
        ? "Admin · Clic en un día para agendar · Clic en una cita para ver detalle"
        : "Clic en un día disponible para agendar tu cita";
    }
  }

  // ── 7. Cargar citas desde Supabase ──────────────────────────
  async function fetchCitas() {
    if (esAdmin) {
      // Admin ve todo
      const { data, error } = await db
        .from("citas")
        .select("id, nombre_cliente, fecha_hora, servicio");

      if (error) { console.error(error.message); return []; }

      return data.map(c => ({
        id:              String(c.id),
        title:           `${c.nombre_cliente} — ${c.servicio}`,
        start:           c.fecha_hora,
        backgroundColor: "#b8860b",
        borderColor:     "#d4a017",
        textColor:       "#0a0a0a",
        extendedProps:   { nombre: c.nombre_cliente, servicio: c.servicio },
      }));

    } else {
      // Visitante: solo sabe que ese bloque está ocupado
      const { data, error } = await db
        .from("citas")
        .select("fecha_hora");

      if (error) { console.error(error.message); return []; }

      return data.map(c => ({
        id:              `bloqueado-${c.fecha_hora}`,
        title:           "Ocupado",
        start:           c.fecha_hora,
        backgroundColor: "#2d1c12",
        borderColor:     "rgba(184,134,11,0.3)",
        textColor:       "#7a6a58",
        display:         "block",
        extendedProps:   { esOcupado: true },
      }));
    }
  }

  // ── 8. Guardar cita (cualquier usuario) ─────────────────────
  async function guardarCita(nombre, fechaHora, servicio) {
    const { data, error } = await db
      .from("citas")
      .insert([{ nombre_cliente: nombre, fecha_hora: fechaHora, servicio }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // ── 9. Eliminar cita (solo admin) ────────────────────────────
  async function eliminarCita(id) {
    if (!esAdmin) throw new Error("Sin permisos");
    const { error } = await db.from("citas").delete().eq("id", id);
    if (error) throw error;
  }

  // ── 10. Verificar hora ocupada ───────────────────────────────
  async function horaOcupada(fechaHora) {
    const { data } = await db
      .from("citas")
      .select("id")
      .eq("fecha_hora", fechaHora);
    return data && data.length > 0;
  }

  // ── 11. Inicializar FullCalendar ─────────────────────────────
  async function initCalendar() {
    const el = document.getElementById("calendar");
    if (!el) return;

    const eventos = await fetchCitas();

    calendar = new FullCalendar.Calendar(el, {
      locale:       "es",
      initialView:  "dayGridMonth",
      headerToolbar: {
        left:   "prev,next today",
        center: "title",
        right:  "dayGridMonth,timeGridWeek,listWeek",
      },
      buttonText: { today:"Hoy", month:"Mes", week:"Semana", list:"Lista" },
      events:       eventos,
      selectable:   true,
      nowIndicator: true,
      businessHours: {
        daysOfWeek: [1,2,3,4,5,6],
        startTime:  "09:00",
        endTime:    "19:00",
      },

      dateClick(info) {
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        if (info.date < hoy) {
          showToast("No puedes agendar en fechas pasadas", "error");
          return;
        }
        selectedDate = info.dateStr;
        openModalNuevaCita(info.dateStr);
      },

      eventClick(info) {
        const ev = info.event;
        if (ev.extendedProps.esOcupado) {
          showToast("Ese horario no está disponible", "error");
          return;
        }
        // Solo admin puede ver detalle y eliminar
        if (!esAdmin) {
          showToast("Ese horario ya está reservado", "error");
          return;
        }
        openModalDetalle(ev);
      },
    });

    calendar.render();
  }

  // ── 12. Modal nueva cita ─────────────────────────────────────
  function openModalNuevaCita(dateStr) {
    const horasOpts    = HORAS.map(h => `<option value="${h}">${h}</option>`).join("");
    const serviciosOpts = SERVICIOS.map(s =>
      `<option value="${s.label}">${s.label} · ${s.precio}</option>`
    ).join("");

    const fecha = new Date(dateStr + "T12:00:00");
    const fechaTexto = fecha.toLocaleDateString("es-CO", {
      weekday:"long", day:"numeric", month:"long", year:"numeric"
    });

    document.getElementById("modalCitaFecha").textContent = fechaTexto;
    document.getElementById("citaHora").innerHTML         = horasOpts;
    document.getElementById("citaServicio").innerHTML     = serviciosOpts;
    document.getElementById("citaNombre").value           = "";
    document.getElementById("modalNuevaCita").classList.add("open");
  }

  function closeModalNuevaCita() {
    document.getElementById("modalNuevaCita").classList.remove("open");
    selectedDate = null;
  }

  // ── 13. Modal detalle / eliminar ─────────────────────────────
  function openModalDetalle(ev) {
    const fecha = new Date(ev.start).toLocaleString("es-CO", {
      weekday:"long", day:"numeric", month:"long",
      hour:"2-digit", minute:"2-digit"
    });
    document.getElementById("detalleFecha").textContent    = fecha;
    document.getElementById("detalleNombre").textContent   = ev.extendedProps.nombre;
    document.getElementById("detalleServicio").textContent = ev.extendedProps.servicio;
    document.getElementById("btnEliminarCita").onclick     = () => confirmarEliminar(ev.id, ev);
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
      showToast("Error: " + e.message, "error");
    }
  }

  // ── 14. Submit nueva cita ────────────────────────────────────
  async function submitNuevaCita() {
    const nombre   = document.getElementById("citaNombre").value.trim();
    const hora     = document.getElementById("citaHora").value;
    const servicio = document.getElementById("citaServicio").value;

    if (!nombre) { showToast("Ingresa tu nombre", "error"); return; }
    if (!selectedDate) return;

    const fechaHora = `${selectedDate}T${hora}:00`;

    const ocupada = await horaOcupada(fechaHora);
    if (ocupada) { showToast("Esa hora ya está ocupada. Elige otra.", "error"); return; }

    const btn = document.getElementById("btnGuardarCita");
    btn.disabled    = true;
    btn.textContent = "Guardando...";

    try {
      const nuevaCita = await guardarCita(nombre, fechaHora, servicio);

      // Agregar al calendario visualmente
      calendar.addEvent({
        id:              String(nuevaCita.id),
        title:           esAdmin ? `${nombre} — ${servicio}` : "Ocupado",
        start:           fechaHora,
        backgroundColor: esAdmin ? "#b8860b" : "#2d1c12",
        borderColor:     esAdmin ? "#d4a017" : "rgba(184,134,11,0.3)",
        textColor:       esAdmin ? "#0a0a0a" : "#7a6a58",
        extendedProps:   esAdmin
          ? { nombre, servicio }
          : { esOcupado: true },
      });

      closeModalNuevaCita();
      showToast(`Cita agendada para el ${hora}. ¡Te esperamos!`, "success");

      // Recordatorio WhatsApp solo para admin
      if (esAdmin) {
        const fechaTexto = new Date(fechaHora).toLocaleString("es-CO", {
          weekday:"long", day:"numeric", month:"long",
          hour:"2-digit", minute:"2-digit"
        });
        const msg = encodeURIComponent(
          `Hola ${nombre}, tu cita en Razor Barber está confirmada para el ${fechaTexto}. Servicio: ${servicio}. ¡Te esperamos! 💈`
        );
        if (confirm("¿Enviar recordatorio por WhatsApp al cliente?")) {
          window.open(`https://wa.me/${WHATSAPP_NUM}?text=${msg}`, "_blank");
        }
      }

    } catch (e) {
      showToast("Error al guardar: " + e.message, "error");
    } finally {
      btn.disabled    = false;
      btn.textContent = "Confirmar cita";
    }
  }

  // ── 15. Modales login ────────────────────────────────────────
  function abrirModalLogin() {
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPass").value  = "";
    document.getElementById("loginError").textContent = "";
    document.getElementById("modalLogin").classList.add("open");
  }

  function cerrarModalLogin() {
    document.getElementById("modalLogin").classList.remove("open");
  }

  // ── 16. Toast ────────────────────────────────────────────────
  function showToast(msg, tipo = "success") {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className   = `toast toast-${tipo} show`;
    setTimeout(() => t.classList.remove("show"), 3500);
  }

  // ── 17. API pública ──────────────────────────────────────────
  window.RazorCalendar = {
    closeModalNuevaCita,
    closeModalDetalle,
    submitNuevaCita,
    abrirModalLogin,
    cerrarModalLogin,
    login,
    logout,
  };

  // ── 18. Arrancar ─────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", async () => {
    await verificarSesion();
    await initCalendar();
  });

})();