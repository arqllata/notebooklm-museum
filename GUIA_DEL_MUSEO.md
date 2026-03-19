# 📖 Guía Definitiva: Actualización del Museo del Podcast

Esta guía contiene el flujo de trabajo oficial y a prueba de balas para modificar, agregar episodios y publicar tu sitio web en Internet. 

Sigue estos 3 pasos siempre que quieras actualizar tu página.

---

## Paso 1: Editar y Crear Episodios (Trabajo Creativo)

Para escribir la información y agregar imágenes, vamos a utilizar la aplicación nativa que creamos para tu Mac, la cual es inmune a los errores web.

1. Ve a tu Escritorio y dale doble clic a **`PodcastManager.app`**.
2. Cuando la app te pida abrir la carpeta de trabajo, selecciona exactamente esta ruta:
   👉 `/Users/francisco/Notebook LM/app`
3. Usa la aplicación para crear nuevos episodios o editar los existentes. Para agregar fotos usa la "Librería de Medios":
   - Da clic en el botón **"Elegir Imagen"** (Choose Image).
   - En la ventana que se abre, **arrastra y suelta tu foto** desde tu computadora, o da clic en "Upload" para buscarla.
   - Finalmente, da clic sobre la foto recién subida para insertarla.
4. *(Alternativa)*: Si alguna vez prefieres ver el código directamente, puedes usar **Visual Studio Code**, abrir la misma carpeta, y arrastrar las imágenes directo entre las comillas del campo `imageUrl: ""`.

---

## Paso 2: Previsualizar tu Sitio (Ver cómo quedó)

Antes de publicarlo al mundo, siempre es bueno revisar que las fotos y el texto se vean perfectos en tu propia computadora.

1. Abre tu **Terminal** de Mac.
2. Entra a la carpeta de tu aplicación pegando esto y dando Enter:
   ```bash
   cd "/Users/francisco/Notebook LM/app"
   ```
3. Enciende el servidor de prueba escribiendo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador de internet y entra a: **[http://localhost:3000](http://localhost:3000)**
5. *Nota:* Mientras esta terminal siga corriendo, cualquier cambio que guardes en el `PodcastManager` se actualizará solo en el navegador tras unos segundos.
6. Cuando termines de revisar tu sitio, ve a la terminal y presiona **`Ctrl + C`** para apagar el motor.

---

## Paso 3: Empaquetar y Publicar (Subir a Internet)

Una vez que tu sitio luce exactamente como quieres, es hora de enviarlo a producción para que el resto del mundo lo vea.

### A. Construir la Versión Final
1. En tu misma **Terminal** (asegúrate de seguir en la carpeta `app` y de que el servidor `dev` esté apagado), escribe este comando y dale Enter:
   ```bash
   npm run build
   ```
2. Espera unos segundos a que la terminal te muestre palomitas verdes (`✓`). Esto significa que la computadora ha comprimido todas tus fotos y creado una carpeta llamada **`out`** con tu sitio web terminado.

### B. Subirlo a Netlify
1. En tu terminal, pega este comando mágico y dale Enter para que tu Mac te abra la carpeta de inmediato:
   ```bash
   open "/Users/francisco/Notebook LM/out"
   ```
2. Ahora ve a tu navegador de internet y entra a tu cuenta de Netlify, específicamente a la zona para soltar archivos: **[https://app.netlify.com/drop](https://app.netlify.com/drop)** (o a la pestaña "Deploys" / "Despliegues" dentro del panel de tu sitio web).
3. **Arrastra la carpeta entera `out`** desde la ventana que se abrió en tu Mac y suéltala en el círculo punteado de Netlify.

¡Listo! En unos pocos segundos, Netlify dirá "Published" y tu museo mundial estará 100% actualizado con tus nuevos episodios.
