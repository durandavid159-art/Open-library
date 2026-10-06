
const CLAVE_PREFERENCIAS = "readingPreferences";

// Valores por defecto del perfil
const PREFERENCIAS_POR_DEFECTO = {
  generos: [],
  autor: "",
  idioma: "es",
  frecuencia: "varios"
};

// Carga las preferencias guardadas (o las por defecto)
function cargarPreferencias() {
  try {
    const datos = localStorage.getItem(CLAVE_PREFERENCIAS);
    if (!datos) return { ...PREFERENCIAS_POR_DEFECTO };
    const prefs = JSON.parse(datos);
    return {
      generos: Array.isArray(prefs.generos) ? prefs.generos : [],
      autor: typeof prefs.autor === "string" ? prefs.autor : "",
      idioma: typeof prefs.idioma === "string" ? prefs.idioma : "es",
      frecuencia: typeof prefs.frecuencia === "string" ? prefs.frecuencia : "varios"
    };
  } catch (error) {
    console.error("No se pudieron leer las preferencias:", error);
    return { ...PREFERENCIAS_POR_DEFECTO };
  }
}

// Guarda las preferencias en localStorage (persisten al cerrar el navegador)
function guardarPreferencias(preferencias) {
  try {
    localStorage.setItem(CLAVE_PREFERENCIAS, JSON.stringify(preferencias));
    return true;
  } catch (error) {
    console.error("No se pudieron guardar las preferencias:", error);
    return false;
  }
}

// Lee el formulario de la página de perfil
function guardarPreferenciasDesdeFormulario() {
  const generosSeleccionados = Array.from(
    document.querySelectorAll(".chip.genero-activo")
  ).map((chip) => chip.dataset.genero);

  const campoAutor = document.getElementById("autorFavorito");
  const campoIdioma = document.getElementById("idiomaLectura");
  const campoFrecuencia = document.getElementById("frecuenciaLectura");

  const preferencias = {
    generos: generosSeleccionados,
    autor: campoAutor ? campoAutor.value.trim() : "",
    idioma: campoIdioma ? campoIdioma.value : "es",
    frecuencia: campoFrecuencia ? campoFrecuencia.value : "varios"
  };

  const guardado = guardarPreferencias(preferencias);

  const mensaje = document.getElementById("mensajePreferencias");
  if (mensaje) {
    mensaje.textContent = guardado
      ? "✓ Preferencias guardadas. Ya puedes ver tus recomendaciones."
      : "No se pudieron guardar las preferencias.";
    mensaje.classList.add("visible");
    setTimeout(() => mensaje.classList.remove("visible"), 3000);
  }

  return preferencias;
}

// Pinta en el formulario lo que ya estaba guardado
function pintarPreferenciasGuardadas() {
  const prefs = cargarPreferencias();

  document.querySelectorAll(".chip[data-genero]").forEach((chip) => {
    const activo = prefs.generos.includes(chip.dataset.genero);
    chip.classList.toggle("genero-activo", activo);
    chip.classList.toggle("active", activo);
  });

  const campoAutor = document.getElementById("autorFavorito");
  if (campoAutor) campoAutor.value = prefs.autor;

  const campoIdioma = document.getElementById("idiomaLectura");
  if (campoIdioma) campoIdioma.value = prefs.idioma;

  const campoFrecuencia = document.getElementById("frecuenciaLectura");
  if (campoFrecuencia) campoFrecuencia.value = prefs.frecuencia;

  actualizarContadorFavoritos();
}

// Configura los eventos de la página de perfil
function iniciarPaginaPerfil() {
  const formulario = document.getElementById("formPreferencias");
  if (!formulario) return;

  // Los chips de géneros se activan al hacer clic
  document.querySelectorAll(".chip[data-genero]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const activo = chip.classList.toggle("genero-activo");
      chip.classList.toggle("active", activo);
    });
  });

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    guardarPreferenciasDesdeFormulario();
  });

  pintarPreferenciasGuardadas();
}
