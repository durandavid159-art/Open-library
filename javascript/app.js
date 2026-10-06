
document.addEventListener("DOMContentLoaded", () => {
  
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").then(
      () => console.log("Service Worker registrado correctamente."),
      (error) => console.warn("No se pudo registrar el Service Worker:", error)
    );
  }

  const esInicio = document.body.dataset.pagina === "inicio";
  const searchInput = document.getElementById("searchInput");
  const booksGrid = document.querySelector(".books-grid");

  if (esInicio && searchInput) {

    // EN LA HOME: la barra de búsqueda redirige a la página de búsqueda
    const lanzarBusqueda = () => {
      const texto = searchInput.value.trim();
      if (!texto) return;
      window.location.href = `pages/busqueda.html?q=${encodeURIComponent(texto)}`;
    };
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") lanzarBusqueda();
    });
  } else if (searchInput && booksGrid) {

    // EN BÚSQUEDA: buscamos directamente en Open Library
    let timeoutId;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(timeoutId);
      const query = e.target.value.trim();

      if (query.length < 3) {
        if (query.length === 0) cargarResultadosIniciales();
        return;
      }

      timeoutId = setTimeout(() => {
        renderizarResultadosCon(query);
      }, 500);
    });

    // También buscamos al pulsar Enter
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        clearTimeout(timeoutId);
        const query = searchInput.value.trim();
        if (query) renderizarResultadosCon(query);
      }
    });

    // Chips de filtros rápidos: lanzan una búsqueda real
    document.querySelectorAll(".chip-group .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".chip-group .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const texto = chip.textContent.trim();
        if (texto === "Todos") {
          searchInput.value = "";
          cargarResultadosIniciales();
        } else {
          searchInput.value = texto;
          renderizarResultadosCon(texto);
        }
      });
    });

    // ¿Venimos de la home con ?q=harry+potter ?
    const parametros = new URLSearchParams(window.location.search);
    const queryInicial = parametros.get("q");
    if (queryInicial && queryInicial.trim()) {
      searchInput.value = queryInicial.trim();
      renderizarResultadosCon(queryInicial.trim());
    } else {
      cargarResultadosIniciales();
    }
  }

  // Ejecuta la búsqueda y pinta los resultados
  async function renderizarResultadosCon(query) {
    mostrarMensaje(booksGrid, "Buscando libros...");
    const resultado = await buscarLibros(query);

    if (!resultado.ok) {
      mostrarMensaje(booksGrid, resultado.mensaje);
      return;
    }
    renderizarResultados(resultado.libros.slice(0, 12));
  }

  // Contenido inicial de la página de búsqueda (sin texto escrito)
  function cargarResultadosIniciales() {
    if (!booksGrid) return;
    renderizarResultadosCon("libros populares");
  }

  // Pinta la lista de libros devuelta por la API
  function renderizarResultados(libros) {
    if (!libros || libros.length === 0) {
      mostrarMensaje(booksGrid, "No se encontraron libros.");
      return;
    }
    mostrarLibros(booksGrid, libros);
  }

  const gridInicio = document.getElementById("recomendadosGrid");

  // Tarjetas de demostración de respaldo (idénticas al HTML original)
  const TARJETAS_DEMO = gridInicio ? gridInicio.innerHTML : "";

  if (gridInicio) {
    cargarRecomendacionesInicio(gridInicio);
  }

  async function cargarRecomendacionesInicio(grid) {
    mostrarMensaje(grid, "Cargando recomendaciones...");
    const resultado = await buscarRecomendaciones();

    if (!resultado.ok || resultado.libros.length === 0) {
      // Sin internet: restauramos las tarjetas de demostración originales
      grid.innerHTML = TARJETAS_DEMO;
      return;
    }
    mostrarLibros(grid, resultado.libros.slice(0, 4));
  }

  iniciarPaginaFavoritos();

  iniciarPaginaPerfil();
});
