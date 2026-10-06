
const API_BASE = "https://openlibrary.org/search.json";

async function buscarLibros(query, limite = 12) {
  const texto = (query || "").trim();
  if (!texto) {
    return { ok: true, libros: [], mensaje: "Escribe algo para buscar libros." };
  }

  try {
    const respuesta = await fetch(
      `${API_BASE}?q=${encodeURIComponent(texto)}&limit=${limite}`
    );
    if (!respuesta.ok) {
      return { ok: false, libros: [], mensaje: "Open Library no responde. Inténtalo de nuevo." };
    }
    const data = await respuesta.json();
    const libros = Array.isArray(data.docs) ? data.docs : [];
    return { ok: true, libros, mensaje: "" };
  } catch (error) {

    // Sin conexión o error de red
    console.error("Error al conectar con Open Library:", error);
    return {
      ok: false,
      libros: [],
      mensaje: "No hay conexión con Open Library. Revisa tu internet e inténtalo de nuevo."
    };
  }
}

async function buscarRecomendaciones(preferencias, limite = 12) {
  const prefs = preferencias || cargarPreferencias();

  // 1) Si eligió un autor, buscamos directamente por autor
  if (prefs && prefs.autor && prefs.autor.trim()) {
    try {
      const respuesta = await fetch(
        `${API_BASE}?author=${encodeURIComponent(prefs.autor.trim())}&limit=${limite}`
      );
      if (respuesta.ok) {
        const data = await respuesta.json();
        if (Array.isArray(data.docs) && data.docs.length > 0) {
          return { ok: true, libros: data.docs, mensaje: "", origen: "autor" };
        }
      }
    } catch (error) {
      console.error("Error buscando por autor:", error);
    }
  }

  // 2) Si no, usamos el primer género favorito
  const genero =
    prefs && Array.isArray(prefs.generos) && prefs.generos.length > 0
      ? prefs.generos[0]
      : "";

  if (genero) {
    const resultado = await buscarLibros(genero, limite);
    return { ...resultado, origen: "genero" };
  }

  // 3) Sin preferencias: mostramos libros populares de la literatura
  const resultado = await buscarLibros("literature", limite);
  return { ...resultado, origen: "populares" };
}

function obtenerUrlPortada(libro) {
  if (libro && typeof libro.cover_i === "number" && libro.cover_i > 0) {
    return `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`;
  }
  return null;
}

function normalizarLibro(libro) {
  if (!libro || typeof libro !== "object") {
    libro = {};
  }

  let isbn = "";
  if (typeof libro.isbn === "string") {
    isbn = libro.isbn;
  } else if (Array.isArray(libro.isbn) && libro.isbn.length > 0) {
    isbn = String(libro.isbn[0]);
  }

  // Año de publicación
  const anio =
    libro.anio !== undefined && libro.anio !== null && libro.anio !== ""
      ? String(libro.anio)
      : typeof libro.first_publish_year === "number" && !isNaN(libro.first_publish_year)
        ? String(libro.first_publish_year)
        : "S/F";

  // Título
  const titulo =
    typeof libro.titulo === "string" && libro.titulo.trim()
      ? libro.titulo
      : typeof libro.title === "string" && libro.title.trim()
        ? libro.title
        : "Título desconocido";

  // Autor
  let autor = "";
  if (typeof libro.autor === "string" && libro.autor.trim()) {
    autor = libro.autor;
  } else if (Array.isArray(libro.author_name) && libro.author_name.length > 0) {
    autor = libro.author_name.join(", ");
  } else {
    autor = "Autor desconocido";
  }

  // Identificador estable: id ya calculado, key de Open Library, ISBN o título+año
  const id =
    typeof libro.id === "string" && libro.id
      ? libro.id
      : typeof libro.key === "string" && libro.key
        ? libro.key
        : isbn
          ? isbn
          : `${titulo}-${anio}`;

  // Portada
  const cover_i =
    typeof libro.cover_i === "number" && !isNaN(libro.cover_i)
      ? libro.cover_i
      : null;

  return { id, titulo, autor, anio, cover_i, isbn };
}
