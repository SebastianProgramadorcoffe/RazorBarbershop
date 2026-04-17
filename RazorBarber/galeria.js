(() => {
  // ── 1. Cliente Supabase ─────────────────────────────────────
  const { createClient } = supabase;
  const db = createClient(SUPABASE_URL, SUPABASE_ANON);
 
  const BUCKET = "catalogo";
 
  // ── 2. Estado local ─────────────────────────────────────────
  let todasLasFotos = [];   // cache completo desde Supabase
  let filtroActual  = "todos";
 
  // ── 3. Cargar fotos desde la tabla "catalogo" ───────────────
  async function cargarFotos() {
    mostrarLoading(true);
 
    const { data, error } = await db
      .from("catalogo")
      .select("id, nombre, categoria, storage_path, url")
      .order("created_at", { ascending: false });
 
    mostrarLoading(false);
 
    if (error) {
      console.error("Error cargando galería:", error.message);
      return;
    }
 
    todasLasFotos = data || [];
    renderGaleria();
  }
 
  // ── 4. Render de la grilla ──────────────────────────────────
  function renderGaleria() {
    const grid  = document.getElementById("galleryGrid");
    const empty = document.getElementById("galleryEmpty");
 
    const lista = filtroActual === "todos"
      ? todasLasFotos
      : todasLasFotos.filter(f => f.categoria === filtroActual);
 
    if (lista.length === 0) {
      grid.innerHTML = "";
      empty.style.display = "block";
      return;
    }
 
    empty.style.display = "none";
 
    grid.innerHTML = lista.map((foto, i) => `
      <div class="gallery-item" style="animation-delay:${i * 0.05}s"
           onclick="RazorGaleria.verImagen('${foto.url}','${esc(foto.nombre)}','${esc(foto.categoria)}')">
        <div class="gallery-item-inner">
          <img
            src="${foto.url}"
            alt="${esc(foto.nombre)}"
            loading="lazy"
            onerror="this.parentElement.innerHTML='<div class=gallery-placeholder><div class=gallery-placeholder-icon>◆</div><div class=gallery-placeholder-text>${esc(foto.categoria)}</div></div>'"
          />
          <div class="gallery-item-overlay">
            <div class="gallery-item-name">${esc(foto.nombre)}</div>
            <div class="gallery-item-cat">${esc(foto.categoria)}</div>
          </div>
        </div>
      </div>
    `).join("");
  }
 
  // Escapar comillas para atributos HTML inline
  function esc(str) {
    return (str || "").replace(/'/g, "\\'").replace(/"/g, "&quot;");
  }
 
  // ── 5. Filtrar por categoría ────────────────────────────────
  function filtrar(cat, btn) {
    filtroActual = cat;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    renderGaleria();
  }
 
  // ── 6. Loading state ────────────────────────────────────────
  function mostrarLoading(show) {
    const el = document.getElementById("galleryLoading");
    const grid = document.getElementById("galleryGrid");
    if (el) el.style.display = show ? "block" : "none";
    if (grid) grid.style.display = show ? "none" : "grid";
  }
 
  // ── 7. Ver imagen en modal ──────────────────────────────────
  function verImagen(url, nombre, cat) {
    document.getElementById("modalImagenSrc").src    = url;
    document.getElementById("modalImagenNombre").textContent = nombre;
    document.getElementById("modalImagenCat").textContent   = cat.toUpperCase();
    document.getElementById("modalImagen").classList.add("open");
  }
 
  function cerrarImagen() {
    document.getElementById("modalImagen").classList.remove("open");
    document.getElementById("modalImagenSrc").src = "";
  }
 
  // Cerrar modal al hacer clic en el fondo
  document.addEventListener("DOMContentLoaded", () => {
    const backdrop = document.getElementById("modalImagen");
    if (backdrop) {
      backdrop.addEventListener("click", e => {
        if (e.target === backdrop) cerrarImagen();
      });
    }
  });
 
  // ── 8. Iniciar al cargar la página ──────────────────────────
  document.addEventListener("DOMContentLoaded", cargarFotos);
 
  // ── 9. API pública ──────────────────────────────────────────
  window.RazorGaleria = { filtrar, verImagen, cerrarImagen };
 
})();