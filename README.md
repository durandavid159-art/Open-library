
## 1. ¿Qué es el proyecto?

Un recomendador de libros que:

- Busca libros en **Open Library**.
- Muestra portada, título, autor y año de publicación.
- Permite guardar libros en **favoritos** (persisten al cerrar el navegador).
- Permite guardar **preferencias de lectura** (géneros, autor, idioma, frecuencia).
- Muestra **recomendaciones sencillas** a partir de esas preferencias.
- Funciona como **PWA instalable** y se ejecuta localmente con **Node.js**.

## 2. Tecnologías utilizadas
* Frontend HTML, CSS, JavaScript
* PWA manifest.json, Service Worker, Cache API 
* Servidor local Node.js + Express

## 3. Abrir la teminal y verificar si tienes Node.js instalado.

   node -v    # debe mostrar algo como v24.x.x

## 4. Cómo instalar Node.js (si no lo tienes)

1. Entra en <https://nodejs.org>.
2. Descarga la versión **LTS** e instálala (dale a "Siguiente" en todo).
3. Reinicia la terminal y comprueba:

```bash o cmd
node -v    # debe mostrar algo como v24.x.x
npm -v     # debe mostrar un número de versión
```

## 5. Cómo instalar las dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instala **Express** (única dependencia).

## 6. Cómo iniciar la aplicación

```bash
npm start
```

Verás en la terminal:

```
==============================================
 Recomendador de Lectura
 Servidor ejecutándose en http://localhost:3000
 Presiona Ctrl + C para detenerlo
==============================================
```

Abre en el navegador: **<http://localhost:3000>**

> ⚠️ Usa siempre `http://localhost:3000`. Si abres los archivos con `file://`
> el Service Worker no se registrará y la app no funcionará como PWA.


## 7. Funcionalidades principales para probar

1. **Buscar**: escribe `Harry Potter` en la página *Buscar* → verás portadas,
   título, autor y año.
2. **Favoritos**: pulsa el corazón de una tarjeta → ve a *Favoritos* →
   el libro está guardado. Pulsa el corazón allí para eliminarlo.
3. **Persistencia**: recarga la página y cierra el navegador → favoritos y
   preferencias siguen ahí.
4. **Prefil**: en *Perfil* elige géneros, autor, idioma y frecuencia →
   *Guardar preferencias* → recarga y seguirán guardados.
5. **Recomendaciones**: con preferencias guardadas, la home muestra libros
   relacionados con tus géneros o tu autor favorito.

---

Elaborado por **David Pescador**.
