

const CLAVE_FAVORITOS = "readingFavorites";

// Devuelve el array de favoritos (siempre un array, nunca null)
function obtenerFavoritos() {
  try {
    const datos = localStorage.getItem(CLAVE_FAVORITOS);
    if (!datos) return [];
    const lista = JSON.parse(datos);
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    console.error("No se pudieron leer los favoritos:", error);
    return [];
  }
}

// Guarda el array completo en localStorage
function guardarFavoritos(lista) {
  try {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(lista));
  } catch (error) {
    console.error("No se pudieron guardar los favoritos:", error);
  }
}

// Comprueba si un libro ya está en favoritos (evita duplicados)
function esFavorito(id) {
  return obtenerFavoritos().some((libro) => libro.id === id);
}

// Añade un libro. Devuelve true si quedó guardado, false si ya existía.
function agregarFavorito(libro) {
  const datos = normalizarLibro(libro);
  const favoritos = obtenerFavoritos();

  if (favoritos.some((f) => f.id === datos.id)) {
    return false; // ya estaba, no duplicamos
  }

  favoritos.push(datos);
  guardarFavoritos(favoritos);
  return true;
}

// Elimina un libro por su id
function eliminarFavorito(id) {
  const favoritos = obtenerFavoritos();
  const restantes = favoritos.filter((libro) => libro.id !== id);
  guardarFavoritos(restantes);
}

function alternarFavorito(libro) {
  const datos = normalizarLibro(libro);
  if (esFavorito(datos.id)) {
    eliminarFavorito(datos.id);
    return false;
  }
  agregarFavorito(datos);
  return true;
}

function iniciarPaginaFavoritos() {
  const contenedor = document.getElementById("favList");
  if (!contenedor) return;

  const favoritos = obtenerFavoritos();

  // Estado vacío
  if (favoritos.length === 0) {
    contenedor.innerHTML = "";
    const vacio = document.createElement("div");
    vacio.className = "estado-vacio";
    vacio.innerHTML =
      '<span class="material-symbols-outlined">favorite</span>' +
      "<p>Todavía no has guardado libros.</p>" +
      '<a href="busqueda.html" class="enlace-buscar">Buscar libros →</a>';
    contenedor.appendChild(vacio);
    return;
  }

  contenedor.innerHTML = "";

  favoritos.forEach((datos) => {
    const article = document.createElement("article");
    article.className = "fav-card";
    article.dataset.libroId = datos.id;

    // Portada
    const cover = document.createElement("div");
    cover.className = "fav-cover";
    if (typeof datos.cover_i === "number" && datos.cover_i > 0) {
      const img = document.createElement("img");
      img.src = `https://covers.openlibrary.org/b/id/${datos.cover_i}-M.jpg`;
      img.alt = "Portada de " + datos.titulo;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.onerror = () => {
        cover.innerHTML = "";
        cover.appendChild(crearPlaceholder(datos));
      };
      cover.appendChild(img);
    } else {
      cover.appendChild(crearPlaceholder(datos));
    }

    // Cuerpo con título, autor y año
    const body = document.createElement("div");
    body.className = "card-body";

    const textos = document.createElement("div");
    const titulo = document.createElement("h3");
    titulo.className = "book-title";
    titulo.textContent = datos.titulo;

    const autor = document.createElement("p");
    autor.className = "book-author";
    autor.textContent = datos.autor + " · " + (datos.anio || "S/F");

    textos.appendChild(titulo);
    textos.appendChild(autor);

    // Botón eliminar
    const boton = document.createElement("button");
    boton.className = "fav-btn es-favorito";
    boton.type = "button";
    boton.setAttribute("aria-label", "Quitar de favoritos");
    boton.title = "Quitar de favoritos";
    boton.innerHTML = '<span class="material-symbols-outlined filled">favorite</span>';
    boton.addEventListener("click", () => {
      eliminarFavorito(datos.id);
      mostrarAviso(`«${datos.titulo}» eliminado de favoritos`);
      iniciarPaginaFavoritos(); // volver a pintar la lista
      actualizarContadorFavoritos();
    });

    body.appendChild(textos);
    body.appendChild(boton);

    article.appendChild(cover);
    article.appendChild(body);
    contenedor.appendChild(article);
  });
}

// Pequeño aviso visual para el usuario (sin dependencias)
function mostrarAviso(texto) {
  let aviso = document.getElementById("aviso-app");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "aviso-app";
    aviso.className = "aviso-app";
    document.body.appendChild(aviso);
  }
  aviso.textContent = texto;
  aviso.classList.add("visible");
  clearTimeout(mostrarAviso._temporizador);
  mostrarAviso._temporizador = setTimeout(() => {
    aviso.classList.remove("visible");
  }, 2200);
}

// Actualiza el contador de la página de perfil
function actualizarContadorFavoritos() {
  const contador = document.getElementById("statFavoritos");
  if (contador) contador.textContent = String(obtenerFavoritos().length);
}
