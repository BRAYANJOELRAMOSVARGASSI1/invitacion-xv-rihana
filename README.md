# 🎀 Invitación XV Años — Rihana Nicol

Invitación digital interactiva para los XV años de Rihana Nicol Ramos Vargas.

## 📂 Estructura

```
invitacion-xv-rihana/
├── index.html      ← Página principal
├── styles.css      ← Estilos (tema Plateado & Celeste)
├── app.js          ← Lógica, animaciones, audio
├── assets/         ← (Opcional) Archivos de audio
│   ├── welcome.mp3 ← Voz de bienvenida personalizada
│   └── music.mp3   ← Canción de fondo ("Harvey" de Her's u otra)
└── README.md       ← Este archivo
```

## ✏️ Personalización Rápida

### Cambiar la hora del evento
En `app.js`, línea ~17:
```js
eventDate: new Date(2026, 6, 17, 19, 0, 0), // año, mes(0-indexado), día, hora, min, seg
```
> **Nota:** El mes es 0-indexado. Julio = 6.

### Agregar música de fondo
1. Crea una carpeta `assets/` junto al `index.html`
2. Coloca tu archivo de música como `assets/music.mp3`
3. ¡Listo! Se reproducirá automáticamente al abrir el sobre

### Agregar voz personalizada
1. Genera un audio con voz femenina usando [TTSMaker](https://ttsmaker.com/) o [ElevenLabs](https://elevenlabs.io/)
2. Guárdalo como `assets/welcome.mp3`
3. Se reproducirá automáticamente en vez de la voz del navegador

### Cambiar respuestas del Quiz
En `app.js`, busca la sección `quiz:` (~línea 32) y modifica las opciones y el índice `correct`.

### Cambiar la URL del QR de fotos
En `app.js`, línea ~25:
```js
photoQrUrl: 'https://TU_LINK_AQUI',
```

### Cambiar colores reservados
En `index.html`, busca la sección `section-colors` y modifica los colores y nombres.

## 🚀 Deployment Gratuito (Netlify)

### Opción A: Drag & Drop (la más fácil)
1. Ve a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastra toda la carpeta `invitacion-xv-rihana` al navegador
3. ¡Listo! Te dará un link como `random-name.netlify.app`
4. Puedes personalizar el nombre del sitio en la configuración

### Opción B: GitHub Pages
1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Ve a Settings → Pages → Source: main → Save
4. Tu sitio estará en `tu-usuario.github.io/nombre-repo`

### Opción C: Vercel
1. Ve a [vercel.com](https://vercel.com) y regístrate con GitHub
2. Importa tu repositorio
3. Deploy automático

> **Todas las opciones son 100% gratuitas, sin tarjeta de crédito.**

## 📱 Compatibilidad
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Android 6.0+ (Samsung J2 Prime y superior)
- ✅ iOS 12+
- ✅ Optimizado para conexiones lentas (~40KB sin audio)

## 📋 Notas
- La música y voz requieren interacción del usuario (política de navegadores)
- El quiz y playlist se guardan en el dispositivo del invitado (localStorage)
- Los efectos de sonido se generan programáticamente (sin archivos externos)
