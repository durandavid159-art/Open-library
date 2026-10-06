
// Crea una tarjeta completa para un libro de Open Library
function crearTarjetaLibro(libro) {
  const datos = normalizarLibro(libro);

  const article = document.createElement("article");
  article.className = "book-card";
  article.dataset.libroId = datos.id;

  // --- Zona superior: portada + textos ---
  const zonaSuperior = document.createElement("div");

  const coverWrapper = document.createElement("div");
  coverWrapper.className = "cover-wrapper";

  const urlPortada = obtenerUrlPortada(libro);
  if (urlPortada) {
    const img = document.createElement("img");
    img.className = "cover-img";
    img.src = urlPortada;
    img.alt = "Portada de " + datos.titulo;
    img.loading = "lazy";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    // Si la portada no existe
    img.onerror = () => {
      coverWrapper.innerHTML = "";
      coverWrapper.appendChild(crearPlaceholder(datos));
    };
    coverWrapper.appendChild(img);
  } else {
    coverWrapper.appendChild(crearPlaceholder(datos));
  }

  const titulo = document.createElement("h3");
  titulo.className = "book-title";
  titulo.textContent = datos.titulo;

  const autor = document.createElement("p");
  autor.className = "book-author";
  autor.textContent = datos.autor;

  const anio = document.createElement("span");
  anio.className = "book-year";
  anio.textContent = datos.anio;

  zonaSuperior.appendChild(coverWrapper);
  zonaSuperior.appendChild(titulo);
  zonaSuperior.appendChild(autor);
  zonaSuperior.appendChild(anio);

  // --- Pie de tarjeta: año + botón de favorito ---
  const footer = document.createElement("div");
  footer.className = "book-footer";

  const etiqueta = document.createElement("span");
  etiqueta.className = "tag-label";
  etiqueta.textContent = datos.anio;

  const botonFav = document.createElement("button");
  botonFav.className = "fav-btn";
  botonFav.type = "button";
  botonFav.dataset.id = datos.id;
  botonFav.setAttribute("aria-label", "Guardar en favoritos");

  const icono = document.createElement("span");
  icono.className = "material-symbols-outlined";
  icono.textContent = "favorite";
  botonFav.appendChild(icono);

  // Estado inicial: relleno si ya es favorito
  if (esFavorito(datos.id)) {
    icono.classList.add("filled");
    botonFav.classList.add("es-favorito");
    botonFav.title = "Quitar de favoritos";
  } else {
    botonFav.title = "Guardar en favoritos";
  }

  botonFav.addEventListener("click", () => {
    const guardado = alternarFavorito(datos);
    icono.classList.toggle("filled", guardado);
    botonFav.classList.toggle("es-favorito", guardado);
    botonFav.title = guardado ? "Quitar de favoritos" : "Guardar en favoritos";
    mostrarAviso(guardado ? `«${datos.titulo}» guardado en favoritos` : `«${datos.titulo}» eliminado de favoritos`);
  });

  footer.appendChild(etiqueta);
  footer.appendChild(botonFav);

  article.appendChild(zonaSuperior);
  article.appendChild(footer);

  return article;
}

// Placeholder cuando no hay portada (usa las clases de color existentes)
function crearPlaceholder(datos) {
  const colores = ["burgundy", "green", "gold", ""];
  // Elegimos un color estable a partir del id (no aleatorio)
  let indice = 0;
  for (let i = 0; i < datos.id.length; i++) indice += datos.id.charCodeAt(i);
  const color = colores[indice % colores.length];

  const placeholder = document.createElement("div");
  placeholder.className = "cover-placeholder" + (color ? " " + color : "");

  const tag = document.createElement("span");
  tag.className = "genre-tag";
  tag.textContent = "Libro";

  const titulo = document.createElement("p");
  titulo.className = "placeholder-title";
  titulo.textContent = datos.titulo;

  const autor = document.createElement("span");
  autor.className = "placeholder-author";
  autor.textContent = datos.autor;

  placeholder.appendChild(tag);
  placeholder.appendChild(titulo);
  placeholder.appendChild(autor);
  return placeholder;
}

// Pinta una lista de libros dentro de un contenedor .books-grid
function mostrarLibros(contenedor, libros) {
  if (!contenedor) return;

  if (!libros || libros.length === 0) {
    mostrarMensaje(contenedor, "No se encontraron libros.");
    return;
  }

  contenedor.innerHTML = "";
  libros.forEach((libro) => {
    contenedor.appendChild(crearTarjetaLibro(libro));
  });
}

// Muestra un mensaje de estado dentro del grid (cargando, error, vacío...)
function mostrarMensaje(contenedor, texto) {
  if (!contenedor) return;
  contenedor.innerHTML = "";
  const p = document.createElement("p");
  p.className = "mensaje-estado";
  p.textContent = texto;
  contenedor.appendChild(p);
}
