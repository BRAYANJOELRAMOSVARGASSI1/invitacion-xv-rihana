/* ============================================
   INVITACIÓN XV AÑOS — RIHANA NICOL
   Lógica, partículas, audio, animaciones,
   quiz, countdown, playlist.
   Optimizado para dispositivos de gama baja.
   ============================================ */

'use strict';

/* =============================================
   1. CONFIGURACIÓN
   ============================================= */
const CONFIG = {
  // Fecha del evento: 17 de julio de 2026, 19:30 (hora local)
  eventDate: new Date(2026, 6, 17, 19, 30, 0),

  // URL para el QR de fotos (cambia esto por tu link real)
  // Opciones sugeridas:
  //   - Google Forms: https://forms.gle/TU_LINK
  //   - Google Photos album: https://photos.app.goo.gl/TU_LINK
  photoQrUrl: 'https://forms.gle/nLoFwX2M4bAymoKn7',

  // URL de SheetDB para guardar canciones automáticamente en Google Sheets
  // Déjalo vacío por ahora. Cuando crees la API en SheetDB, pega aquí tu link (ej. 'https://sheetdb.io/api/v1/tusletras')
  sheetDbUrl: 'https://sheetdb.io/api/v1/v51luj8slq5s5',

  // Partículas
  particles: {
    maxCount: 35,       // Bajo para rendimiento en gama baja
    colors: ['#5DADE2', '#3498DB', '#D4AF37', '#A8A8AD', '#21618C'],
    speed: 0.4,
  },

  // Quiz — ¡Personaliza las respuestas correctas!
  quiz: [
    {
      question: '¿Qué es lo que más le gusta hacer a Rihana en su tiempo libre?',
      options: ['Cantar en karaoke', 'Dibujar', 'Bailar coreografías', 'Cocinar postres'],
      correct: 1, // Dibujar
    },
    {
      question: '¿Cuál es la comida favorita de Rihana?',
      options: ['Pizza', 'Pollo frito', 'Pasta', 'Hamburguesa'],
      correct: 0, // Índice de la respuesta correcta (Pizza)
    },
    {
      question: '¿Qué película le encanta a Rihana?',
      options: ['Enredados', 'Frozen', 'Moana', 'Encanto'],
      correct: 0, // Enredados
    },
    {
      question: '¿Cuál es la canción favorita de Rihana?',
      options: ['Harvey — Her\'s', 'Flowers — Miley', 'Blinding Lights', 'Cruel Summer'],
      correct: 0, // Harvey
    },
    {
      question: '¿Cuál es su color favorito?',
      options: ['Rosa pastel', 'Morado', 'Plateado', 'Azul Reflejo'],
      correct: 3, // Azul
    }
  ],

  // URL del audio pre-grabado (debe estar en la misma carpeta que el index.html)
  welcomeVoiceUrl: 'ElevenLabs_Mi_Doblaje.mp3',

  // Texto de la voz de bienvenida
  welcomeVoiceText: 'Hola, invitado especial. En este día tan importante para nuestra familia, queremos hacerte parte de un momento único. Te invitamos a celebrar los quince años de Rihana Nicol, el diecisiete de julio. ¡Bienvenido!',
};


/* =============================================
   2. AUDIO ENGINE (Web Audio API)
   Genera efectos de sonido sin archivos externos
   ============================================= */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.initialized = false;
  }

  /** Inicializar AudioContext (requiere gesto del usuario) */
  init() {
    if (this.initialized) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.initialized = true;
    } catch (e) {
      console.warn('AudioEngine: Web Audio API no soportado.', e);
    }
  }

  /** Sonido de chispa/destello */
  playSparkle() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000 + Math.random() * 3000, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  /** Sonido de whoosh (materialización) */
  playWhoosh() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = 0.8;

    // Ruido blanco filtrado
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(3000, now + dur * 0.4);
    filter.frequency.exponentialRampToValueAtTime(500, now + dur);
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + dur * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    source.connect(filter).connect(gain).connect(this.ctx.destination);
    source.start(now);
    source.stop(now + dur);
  }

  /** Sonido de papel/sobre abriéndose */
  playPaper() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = 0.4;

    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    filter.Q.value = 1;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    source.connect(filter).connect(gain).connect(this.ctx.destination);
    source.start(now);
    source.stop(now + dur);
  }

  /** Sonido de chime (quiz completado) */
  playChime() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523, 659, 784, 1047]; // Do, Mi, Sol, Do (octava)

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.15;

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain).connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  /** Click suave para interacciones */
  playClick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  /** Efecto de explosión de partículas (varios sparkles simultáneos) */
  playBurst() {
    if (!this.ctx) return;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.playSparkle(), i * 80);
    }
  }
}


/* =============================================
   3. SISTEMA DE PARTÍCULAS (Canvas ligero)
   ============================================= */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.animFrame = null;

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limitar DPR para rendimiento
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.scale(dpr, dpr);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  /** Crear partículas ambientales (suaves, flotantes) */
  createAmbient(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * CONFIG.particles.speed,
        vy: -Math.random() * CONFIG.particles.speed * 0.8 - 0.1,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)],
        life: 1,
        decay: 0.0005 + Math.random() * 0.001,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
      });
    }
  }

  /** Crear explosión de partículas desde un punto */
  createBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
      const speed = 1.5 + Math.random() * 4;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        alpha: 0.8 + Math.random() * 0.2,
        color: CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)],
        life: 1,
        decay: 0.008 + Math.random() * 0.012,
        twinkle: 0,
        twinkleSpeed: 0,
      });
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.draw();
    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.twinkle += p.twinkleSpeed;

      // Reciclar partículas ambientales que salen de pantalla
      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
        p.life = 1;
      }

      // Eliminar partículas de burst que mueren
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Limitar partículas máximas
    if (this.particles.length > CONFIG.particles.maxCount * 2) {
      this.particles.splice(0, this.particles.length - CONFIG.particles.maxCount);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const p of this.particles) {
      const twinkleAlpha = p.twinkleSpeed > 0
        ? p.alpha * p.life * (0.5 + 0.5 * Math.sin(p.twinkle))
        : p.alpha * p.life;

      this.ctx.globalAlpha = Math.max(0, twinkleAlpha);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Glow sutil para partículas grandes
      if (p.size > 2) {
        this.ctx.globalAlpha = twinkleAlpha * 0.3;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1;
  }

  clear() {
    this.particles = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}


/* =============================================
   4. VOZ DE BIENVENIDA
   ============================================= */
class VoiceEngine {
  constructor() {
    this.ready = true;
  }
  speak(text) {
    // Motor de robot destruido intencionalmente
    return Promise.resolve(true);
  }
}


/* =============================================
   5. MUSIC PLAYER (música de fondo y voz)
   ============================================= */
class MusicPlayer {
  constructor() {
    this.voiceAudio = null;
    this.bgMusic = null;
    this.playing = false;
  }

  /** Intentar reproducir voz y luego música */
  play() {
    if (this.playing) return;

    this.voiceAudio = new Audio(CONFIG.welcomeVoiceUrl);
    this.bgMusic = new Audio('cancion.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.3;

    // Al terminar la voz, inicia la música
    this.voiceAudio.addEventListener('ended', () => {
      this.bgMusic.play().catch(e => console.info('No se encontró cancion.mp3'));
    });

    // Iniciar primero la voz
    this.voiceAudio.play()
      .then(() => { this.playing = true; })
      .catch(() => {
        // Si no hay archivo de voz, saltar directamente a la música
        console.info('No se encontró archivo de voz pre-grabado, intentando reproducir música de fondo.');
        this.bgMusic.play().then(() => { this.playing = true; }).catch(e => console.info('No se encontró cancion.mp3'));
      });
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.playing = false;
    }
  }

  setVolume(vol) {
    if (this.audio) this.audio.volume = vol;
  }
}


/* =============================================
   6. COUNTDOWN TIMER
   ============================================= */
class CountdownTimer {
  constructor(targetDate, elements) {
    this.target = targetDate.getTime();
    this.els = elements;
    this.interval = null;
  }

  start() {
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = Date.now();
    const diff = this.target - now;

    if (diff <= 0) {
      this.els.days.textContent = '0';
      this.els.hours.textContent = '0';
      this.els.minutes.textContent = '0';
      this.els.seconds.textContent = '0';
      clearInterval(this.interval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.els.days.textContent = days;
    this.els.hours.textContent = String(hours).padStart(2, '0');
    this.els.minutes.textContent = String(minutes).padStart(2, '0');
    this.els.seconds.textContent = String(seconds).padStart(2, '0');
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }
}


/* =============================================
   7. QUIZ INTERACTIVO
   ============================================= */
class QuizManager {
  constructor(container, questions, audioEngine) {
    this.container = container;
    this.questions = questions;
    this.audio = audioEngine;
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
    this.userAnswers = [];
  }

  init() {
    this.render();
  }

  render() {
    if (this.currentIndex >= this.questions.length) {
      this.showResult();
      return;
    }

    const q = this.questions[this.currentIndex];
    const totalQ = this.questions.length;

    // Progress dots
    let dotsHtml = '<div class="quiz-progress">';
    for (let i = 0; i < totalQ; i++) {
      const cls = i < this.currentIndex ? 'answered' : (i === this.currentIndex ? 'active' : '');
      dotsHtml += `<div class="quiz-dot ${cls}"></div>`;
    }
    dotsHtml += '</div>';

    this.container.innerHTML = `
      <div class="quiz-question active">
        <div class="quiz-question-number">Pregunta ${this.currentIndex + 1} de ${totalQ}</div>
        <div class="quiz-question-text">${q.question}</div>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `
            <button class="quiz-option" data-index="${i}">${opt}</button>
          `).join('')}
        </div>
        ${dotsHtml}
      </div>
    `;

    this.answered = false;

    // Event listeners
    this.container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleAnswer(e), { once: true });
    });
  }

  handleAnswer(e) {
    if (this.answered) return;
    this.answered = true;

    const selectedIndex = parseInt(e.target.dataset.index);
    const correctIndex = this.questions[this.currentIndex].correct;
    this.userAnswers[this.currentIndex] = selectedIndex;
    const options = this.container.querySelectorAll('.quiz-option');

    // Deshabilitar todas las opciones
    options.forEach(btn => btn.classList.add('disabled'));

    // Marcar correcta/incorrecta
    if (selectedIndex === correctIndex) {
      e.target.classList.add('correct');
      this.score++;
      this.audio.playClick();
    } else {
      e.target.classList.add('incorrect');
      options[correctIndex].classList.add('correct');
      this.audio.playClick();
    }

    // Siguiente pregunta después de 1.2s
    setTimeout(() => {
      this.currentIndex++;
      this.render();
    }, 1200);
  }

  showResult() {
    const total = this.questions.length;
    const pct = Math.round((this.score / total) * 100);
    let message = '';

    if (pct === 100) message = '¡Nivel Bestie desbloqueado! Eres su confidente oficial. 👑';
    else if (pct >= 80) message = '¡Impresionante! Realmente la conoces bien. 🎉';
    else if (pct >= 60) message = '¡Nada mal! Sabes bastante de ella. 😊';
    else if (pct >= 40) message = '¡No estuvo tan mal! Hay detalles por descubrir. 🤔';
    else message = '¡Uy! Vas a tener que sentarte con ella en la fiesta para que te ponga al día. 😅';

    let factsHtml = '<div class="quiz-facts-list">';
    this.questions.forEach((q, i) => {
      const isCorrect = this.userAnswers[i] === q.correct;
      const userText = q.options[this.userAnswers[i]];
      const correctText = q.options[q.correct];
      const icon = isCorrect ? '✅' : '❌';
      let text = '';
      if (isCorrect) {
          text = `¡Acertaste! Efectivamente es <b>${correctText}</b>.`;
      } else {
          const userStr = userText ? `Creíste que era <i>${userText}</i>, pero` : 'En realidad';
          text = `${userStr} prefiere <b>${correctText}</b>.`;
      }
      factsHtml += `<div class="quiz-fact-item ${isCorrect ? 'correct' : 'incorrect'}">
                      <span class="quiz-fact-icon">${icon}</span>
                      <span class="quiz-fact-text">${text}</span>
                    </div>`;
    });
    factsHtml += '</div>';

    this.container.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-score"><span id="quiz-final-score">0</span>/${total}</div>
        <div class="quiz-score-label">${message}</div>
        ${factsHtml}
      </div>
    `;

    this.audio.playChime();
    
    // Animar puntaje
    const scoreEl = document.getElementById('quiz-final-score');
    if (this.score > 0) {
      let currentScore = 0;
      const interval = setInterval(() => {
        currentScore++;
        scoreEl.textContent = currentScore;
        if (currentScore >= this.score) {
          clearInterval(interval);
          if (pct >= 80) {
            const rect = scoreEl.getBoundingClientRect();
            window.dispatchEvent(new CustomEvent('quiz-high-score', { detail: { x: rect.left + rect.width/2, y: rect.top + rect.height/2 } }));
          }
        }
      }, 200);
    }

    // Guardar en localStorage
    try {
      localStorage.setItem('xv-rihana-quiz-score', JSON.stringify({
        score: this.score,
        total,
        date: new Date().toISOString()
      }));
    } catch (e) { /* localStorage no disponible */ }
  }
}


/* =============================================
   8. PLAYLIST MANAGER
   ============================================= */
class PlaylistManager {
  constructor(formEl, inputEl, listEl, audioEngine) {
    this.form = formEl;
    this.input = inputEl;
    this.list = listEl;
    this.audio = audioEngine;
    this.songs = [];

    this.loadFromStorage();
    this.renderList();

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addSong();
    });
  }

  async addSong() {
    const value = this.input.value.trim();
    if (!value || value.length < 2) return;
    if (this.songs.length >= 10) return; // Límite razonable

    this.songs.push(value);
    this.input.value = '';
    this.renderList();
    this.saveToStorage();
    this.audio.playClick();
    
    // Enviar a SheetDB automáticamente (si la URL está configurada)
    if (typeof CONFIG !== 'undefined' && CONFIG.sheetDbUrl) {
      try {
        // Asume que la columna en el Excel se llama "Cancion"
        await fetch(CONFIG.sheetDbUrl, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: [{ "Cancion": value }] })
        });
      } catch (err) {
        console.log("Error al conectar con SheetDB", err);
      }
    }
    
    // Mostrar mensaje de éxito
    const successMsg = document.getElementById('playlist-success');
    if (successMsg) {
      successMsg.style.display = 'block';
      setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
    }
  }

  renderList() {
    this.list.innerHTML = this.songs
      .map(song => `<div class="playlist-item">${this.escapeHtml(song)}</div>`)
      .join('');
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  saveToStorage() {
    try {
      localStorage.setItem('xv-rihana-playlist', JSON.stringify(this.songs));
    } catch (e) { /* sin localStorage */ }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem('xv-rihana-playlist');
      if (data) this.songs = JSON.parse(data);
    } catch (e) { /* sin localStorage */ }
  }
}

// Función global para que el programador extraiga las canciones
window.descargarCanciones = function() {
  const data = localStorage.getItem('xv-rihana-playlist');
  if (!data) {
    console.warn("No hay canciones registradas todavía.");
    return;
  }
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'canciones_xv_rihana.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  console.log("Canciones descargadas con éxito.");
};


/* =============================================
   9. SCROLL ANIMATIONS (IntersectionObserver)
   ============================================= */
class ScrollAnimator {
  constructor() {
    this.observer = null;
  }

  init() {
    // Verificar soporte (J2 Prime con Chrome 80+ lo soporta)
    if (!('IntersectionObserver' in window)) {
      // Fallback: mostrar todo sin animación
      document.querySelectorAll('.card').forEach(el => el.classList.add('visible'));
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    // Observar todas las cards (excepto la primera que ya es visible)
    document.querySelectorAll('.card:not(.visible)').forEach(el => {
      this.observer.observe(el);
    });
  }
}


/* =============================================
   10. SCREEN MANAGER (transiciones entre pantallas)
   ============================================= */
class ScreenManager {
  constructor() {
    this.audio = new AudioEngine();
    this.particles = new ParticleSystem(document.getElementById('particles-canvas'));
    this.voice = new VoiceEngine();
    this.music = new MusicPlayer();
    this.scrollAnimator = new ScrollAnimator();
    this.countdown = null;
    this.quiz = null;
    this.playlist = null;

    // Elementos
    this.landingScreen = document.getElementById('landing-screen');
    this.envelopeScreen = document.getElementById('envelope-screen');
    this.mainInvitation = document.getElementById('main-invitation');
    this.envelope = document.getElementById('envelope');
    this.startBtn = document.getElementById('start-btn');
  }

  init() {
    // Iniciar partículas ambientales en landing
    this.particles.createAmbient(CONFIG.particles.maxCount);
    this.particles.start();

    // Botón "Toca para descubrir"
    this.startBtn.addEventListener('click', () => this.onStartTap(), { once: true });

    // Sobre: click/touch para abrir
    this.envelope.addEventListener('click', () => this.onEnvelopeTap(), { once: true });
    this.envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.onEnvelopeTap();
      }
    }, { once: true });
  }

  /** Tap en "Toca para descubrir" */
  onStartTap() {
    // Inicializar audio (requiere gesto del usuario)
    this.audio.init();

    // Explosión de partículas
    this.particles.createBurst(window.innerWidth / 2, window.innerHeight / 2, 25);
    this.audio.playBurst();

    // Transición: ocultar landing
    this.landingScreen.classList.add('hidden');

    // Mostrar envelope screen
    setTimeout(() => {
      this.envelopeScreen.classList.remove('hidden');

      // Materializar el sobre con efecto
      setTimeout(() => {
        this.envelope.classList.add('materialized');
        this.audio.playWhoosh();
      }, 400);
    }, 600);
  }

  /** Tap en el sobre */
  async onEnvelopeTap() {
    this.audio.playPaper();

    // Explosión de partículas desde el sobre
    const rect = this.envelope.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    this.particles.createBurst(cx, cy, 30);

    // Animación de apertura del sobre
    this.envelope.classList.add('opening');

    // Ocultar la instrucción
    const instruction = document.getElementById('envelope-instruction');
    instruction.style.opacity = '0';

    // La voz de ElevenLabs y la música se iniciarán juntas más adelante
    // (eliminada la llamada al robot de voz TTS)

    // Después de la animación del sobre, mostrar contenido
    setTimeout(() => {
      // Ocultar envelope screen
      this.envelopeScreen.classList.add('hidden');

      // Mostrar invitación principal
      this.mainInvitation.classList.add('visible');

      // Intentar reproducir música
      setTimeout(() => this.music.play(), 1000);

      // Iniciar componentes del contenido
      this.initContent();
    }, 1800);
  }

  /** Inicializar todo el contenido interactivo */
  initContent() {
    // Countdown
    this.countdown = new CountdownTimer(CONFIG.eventDate, {
      days: document.getElementById('cd-days'),
      hours: document.getElementById('cd-hours'),
      minutes: document.getElementById('cd-minutes'),
      seconds: document.getElementById('cd-seconds'),
    });
    this.countdown.start();

    // Scroll animations
    this.scrollAnimator.init();

    // Quiz
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
      this.quiz = new QuizManager(quizContainer, CONFIG.quiz, this.audio);
      this.quiz.init();
      
      window.addEventListener('quiz-high-score', (e) => {
        this.particles.createBurst(e.detail.x, e.detail.y, 40);
        this.audio.playBurst();
      });
    }

    // Playlist
    const playlistForm = document.getElementById('playlist-form');
    const playlistInput = document.getElementById('playlist-input');
    const playlistList = document.getElementById('playlist-list');
    if (playlistForm && playlistInput && playlistList) {
      this.playlist = new PlaylistManager(playlistForm, playlistInput, playlistList, this.audio);
    }

    // QR Code
    this.generateQR();

    // Reducir partículas en el contenido principal para rendimiento
    setTimeout(() => {
      this.particles.clear();
      this.particles.createAmbient(15); // Menos partículas en el contenido
    }, 2000);
  }

  /** Generar código QR */
  generateQR() {
    const qrEl = document.getElementById('qr-code');
    if (!qrEl || typeof QRCode === 'undefined') {
      // Si la librería no cargó, mostrar el link como texto
      if (qrEl) {
        qrEl.innerHTML = `<p style="color:#333;font-size:0.8rem;padding:0.5rem;">
          <a href="${CONFIG.photoQrUrl}" target="_blank" style="color:#2E86C1;">
            Toca aquí para compartir fotos
          </a>
        </p>`;
      }
      return;
    }

    new QRCode(qrEl, {
      text: CONFIG.photoQrUrl,
      width: 160,
      height: 160,
      colorDark: '#1C1C1E',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.M,
    });

    // Hacer el QR clickable (táctil)
    qrEl.style.cursor = 'pointer';
    qrEl.title = 'Toca para subir fotos';
    qrEl.addEventListener('click', () => {
      window.open(CONFIG.photoQrUrl, '_blank');
    });
  }
}


/* =============================================
   11. INICIALIZACIÓN
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const app = new ScreenManager();
  app.init();
});
