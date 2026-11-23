# Sitio web RHS SAS · redcontraincendios.net

Sitio estático en HTML, CSS y JavaScript puro, con enfoque mobile first, para publicar en GitHub Pages.

## Estructura

```
./                     páginas HTML (las URL públicas son iguales a las de Wix)
  index.html                                   /
  mantenimiento-red-contra-incendios.html      /mantenimiento-red-contra-incendios
  equipos-de-bombeo.html                       /equipos-de-bombeo
  equipos-para-piscinas.html                   /equipos-para-piscinas
  equipos-y-accesorios.html                    /equipos-y-accesorios
  pilares-rci.html                             /pilares-rci
  contacto.html                                /contacto
  404.html  robots.txt  sitemap.xml  CNAME  .nojekyll
/styles/main.css       estilos (colores y medidas en :root, al inicio del archivo)
/js/main.js            menú, contadores, eventos de GTM y formulario
/js/config.js          número de WhatsApp y servicio de formularios
/image/                imágenes (ver tabla)
/videos/               videos (opcional)
```

Los archivos `.html` se publican sin la extensión: `mantenimiento-red-contra-incendios.html` responde en `/mantenimiento-red-contra-incendios`, igual que en Wix. No cambie esos nombres de archivo.

## Imágenes: dónde colocarlas

Cada espacio está marcado en el HTML con un comentario `<!-- IMAGEN: ... -->` y se ve en pantalla como un recuadro gris con la ruta esperada. Al copiar el archivo con ese nombre exacto en `/image`, la imagen reemplaza el recuadro. Comprima las fotos (WebP o JPG, menos de 200 KB cada una) y edite el texto `alt` de cada una para describir la foto real.

| Archivo | Medida (px) | Dónde aparece |
|---|---|---|
| `servicio-red-contra-incendios.jpg` | 640×480 | Inicio, tarjeta de redes contra incendios |
| `servicio-bombeo.jpg` | 640×480 | Inicio, tarjeta de bombeo |
| `servicio-piscinas.jpg` | 640×480 | Inicio, tarjeta de piscinas |
| `servicio-equipos-accesorios.jpg` | 640×480 | Inicio, tarjeta de equipos |
| `nosotros.jpg` | 800×600 | Inicio, sección Nosotros |
| `proyecto-01.jpg` a `proyecto-06.jpg` | 640×480 | Inicio, galería de proyectos |
| `clientes/cliente-01.png` a `cliente-06.png` | 300×150 | Inicio, logotipos de clientes |
| `banner-mantenimiento.jpg` | 1400×500 | Mantenimiento, banner |
| `mantenimiento-01.jpg` | 640×800 | Mantenimiento, foto vertical |
| `banner-bombeo.jpg` | 1400×500 | Equipos de bombeo, banner |
| `banner-piscinas.jpg` | 1400×500 | Equipos para piscinas, banner |
| `banner-equipos.jpg` | 1400×500 | Venta de equipos, banner |
| `og-rhs.jpg` | 1200×630 | Vista previa al compartir en redes y WhatsApp |

El logotipo actual (`logo-mark.svg`) es una marca provisional. Para usar el logotipo oficial, reemplace el archivo conservando el nombre o cambie la ruta en el encabezado de cada página.

**Video opcional de portada:** guarde el archivo como `/videos/portada.mp4` y siga el comentario `VIDEO OPCIONAL` en `index.html`.

## Vista previa local (Visual Studio Code)

Abra la carpeta en Visual Studio Code y use la extensión Live Server (clic derecho sobre `index.html` → *Open with Live Server*). También puede abrir `index.html` con doble clic. No requiere comandos ni configuración.

Los enlaces se escriben sin `.html` (por ejemplo `mantenimiento-red-contra-incendios`), igual que las URL de producción. Al abrir el sitio en su equipo, `js/main.js` agrega `.html` a esos enlaces para que naveguen; en el dominio publicado no hace nada. Las rutas de estilos, scripts e imágenes son relativas a la carpeta del proyecto, de modo que funcionan en ambos casos.

## Publicación en GitHub Pages

1. Cree el repositorio y suba el contenido de esta carpeta a la rama `main`.
2. En el repositorio: Settings → Pages → Source: *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
3. En Pages → Custom domain, escriba `www.redcontraincendios.net` (el archivo `CNAME` ya lo contiene) y active *Enforce HTTPS* cuando esté disponible.
4. En el DNS del dominio: registro `CNAME` de `www` hacia `<usuario>.github.io`, y los cuatro registros `A` del dominio raíz que indica la documentación de GitHub Pages (para que `redcontraincendios.net` redirija a `www`).
5. Cada cambio posterior: guardar en Visual Studio Code, `git commit` y `git push`.

Aspectos que conviene verificar en su plan de GitHub:

- GitHub Pages desde un repositorio **privado** requiere un plan de pago (Pro, Team o Enterprise). El sitio publicado es público aunque el repositorio sea privado.
- GitHub Pages no permite reglas de redirección 301 en el servidor. Si en Wix existen URL adicionales (por ejemplo `/blog`) que reciben tráfico o anuncios, cree para cada una un archivo HTML con redirección `meta refresh` y `rel="canonical"` hacia la URL nueva.

## Lista de verificación antes de apuntar el dominio

- [ ] Imágenes colocadas y textos `alt` revisados.
- [ ] Formulario: crear una cuenta en un servicio de formularios (Formspree, Web3Forms u otro) y pegar la URL en `js/config.js` → `formEndpoint`. Mientras esté vacío, el formulario abre WhatsApp con la solicitud redactada.
- [ ] Confirmar que +57 310 3585827 es también el número de WhatsApp.
- [ ] En Google Tag Manager (GTM-WHKBWDS8): crear las etiquetas de Google Analytics 4 y de conversiones de Google Ads con los eventos `click_telefono`, `click_whatsapp`, `click_cotizar` y `generate_lead` (los envía `js/main.js` a `dataLayer`).
- [ ] Confirmar en Search Console que la etiqueta `google-site-verification` sigue presente y enviar `https://www.redcontraincendios.net/sitemap.xml`.
- [ ] Validar las cifras de la sección Nosotros (75 proyectos, 350 constructores, 3 premios), copiadas del sitio anterior.
- [ ] Probar con PageSpeed Insights y la Prueba de resultados enriquecidos de Google.
