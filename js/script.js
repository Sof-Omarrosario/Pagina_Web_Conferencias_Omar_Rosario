/* ═══════════════════════════════════════════════════════════
   Col5.0 TechTalks 2025 — script.js
═══════════════════════════════════════════════════════════ */

/* ── 1. DARK / LIGHT MODE ──────────────────────────────── */
const darkToggle = document.getElementById('darkToggle');
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

/* ── 2. HAMBURGER ───────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
  navToggle.classList.remove('open');
  navMenu.classList.remove('open');
}));

/* ── 3. NAVBAR SCROLL + ACTIVE LINK ────────────────────── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('#home,#conf1,#conf2,#glossary,#reflexion');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  let current = 'home';
  sections.forEach(s => { if (s.getBoundingClientRect().top <= 100) current = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
});

/* ── 4. SCROLL TO ───────────────────────────────────────── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
}
navLinks.forEach(l => l.addEventListener('click', e => {
  e.preventDefault();
  if (l.dataset.section) scrollToSection(l.dataset.section);
}));

/* ── 5. LANG TOGGLE ─────────────────────────────────────── */
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const conf = btn.dataset.conf;
    const lang = btn.dataset.lang;
    document.getElementById(`langToggle${conf}`).querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const esDiv = document.getElementById(`conf${conf}-es`);
    const enDiv = document.getElementById(`conf${conf}-en`);
    if (lang === 'es') { esDiv.classList.remove('hidden'); enDiv.classList.add('hidden'); }
    else               { esDiv.classList.add('hidden');    enDiv.classList.remove('hidden'); }
    const newContent = lang === 'es' ? esDiv : enDiv;
    newContent.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => revealObserver.observe(el), 60);
    });
  });
});

/* ── 6. SCROLL REVEAL ───────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 7. BACK TO TOP ─────────────────────────────────────── */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 400));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── 8. CARRUSEL ────────────────────────────────────────── */
function initCarousel(num) {
  const track   = document.getElementById(`track${num}`);
  const dotsBox = document.getElementById(`dots${num}`);
  const counter = document.getElementById(`counter${num}`);
  if (!track) return;

  const slides = Array.from(track.children);
  const total  = slides.length;
  let current  = 0;
  let autoTimer;

  /* Crear puntos */
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(d);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsBox.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  /* Botones prev / next */
  const carousel = document.getElementById(`carousel${num}`);
  carousel.querySelector('.carousel-prev').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  carousel.querySelector('.carousel-next').addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  /* Auto-play cada 4s */
  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4000); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }
  startAuto();

  /* Swipe táctil */
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); resetAuto(); }
  });
}

initCarousel(1);
initCarousel(2);

/* ── 9. GLOSARIO ────────────────────────────────────────── */
const glossaryData = [
  { en:'Onboarding',           es:'Incorporación / Bienvenida',      def:'Proceso de introducir a un nuevo usuario a un producto o juego de forma progresiva y guiada.',                   conf:1 },
  { en:'Dynamic UX',           es:'UX Dinámico',                     def:'Diseño de experiencia que se adapta en tiempo real al comportamiento del usuario.',                              conf:1 },
  { en:'Pitch',                es:'Presentación comercial',          def:'Presentación breve de un proyecto ante inversores o clientes potenciales.',                                       conf:1 },
  { en:'Deck Builder',         es:'Constructor de presentaciones',   def:'Documento visual que narra la historia, propuesta de valor y mercado de un producto.',                           conf:1 },
  { en:'Golden Candidate',     es:'Candidato dorado',                def:'Versión del producto que pasa todas las pruebas internas y está lista para entrega.',                           conf:1 },
  { en:'Feedback',             es:'Retroalimentación',               def:'Respuesta de usuarios o sistemas sobre el desempeño de un producto o acción.',                                  conf:1 },
  { en:'Feedback Hardware',    es:'Hardware de retroalimentación',   def:'Dispositivos que devuelven respuesta física o háptica al usuario (controles vibratorios, etc.).',               conf:1 },
  { en:'Unity',                es:'Unity (motor de videojuegos)',    def:'Motor multiplataforma para desarrollo de videojuegos, muy usado en estudios indie.',                            conf:1 },
  { en:'React',                es:'React (librería web)',            def:'Librería de JavaScript para construir interfaces de usuario dinámicas y componentes reutilizables.',             conf:1 },
  { en:'Clusion',              es:'Conclusión de mecánica',          def:'Término de Indie Level Studio: momento en que el jugador completa satisfactoriamente una mecánica.',            conf:1 },
  { en:'Study Margin',         es:'Margen de estudio',               def:'Capacidad operativa máxima de un estudio: proyectos sostenibles con los recursos actuales.',                    conf:1 },
  { en:'Progression System',   es:'Sistema de progresión',          def:'Mecanismo que recompensa al jugador con avances y desbloqueos a medida que juega.',                             conf:1 },
  { en:'Flexible Code',        es:'Código flexible',                 def:'Arquitectura de software diseñada para cambios rápidos, escalable y fácil de mantener.',                       conf:1 },
  { en:'Indie Studio',         es:'Estudio independiente',          def:'Empresa pequeña de videojuegos sin respaldo editorial, con autonomía creativa.',                                 conf:1 },
  { en:'Gameplay',             es:'Mecánica de juego',              def:'Conjunto de reglas e interacciones que definen cómo se juega un videojuego.',                                   conf:1 },
  { en:'Prototype',            es:'Prototipo',                       def:'Versión temprana funcional de un producto usada para probar ideas y recibir retroalimentación.',                conf:1 },
  { en:'Ethical Hacking',      es:'Hacking ético',                  def:'Práctica de atacar sistemas con autorización para identificar vulnerabilidades antes de actores maliciosos.',   conf:2 },
  { en:'Two-Factor Auth (2FA)',es:'Doble autenticación',             def:'Método de seguridad que requiere dos formas de verificación para acceder a una cuenta.',                        conf:2 },
  { en:'Deep Fakes',           es:'Falsificaciones profundas',      def:'Contenido audiovisual generado por IA que suplanta la identidad de personas reales.',                           conf:2 },
  { en:'Weak Passwords',       es:'Contraseñas débiles',            def:'Contraseñas cortas o predecibles fácilmente descifradas por ataques de fuerza bruta.',                          conf:2 },
  { en:'Password Manager',     es:'Gestor de contraseñas',          def:'Aplicación que genera y almacena contraseñas únicas y seguras.',                                                conf:2 },
  { en:'Traffic Slitting',     es:'División de tráfico',            def:'Técnica para interceptar o desviar tráfico de red hacia servidores del atacante.',                              conf:2 },
  { en:'Web Sides',            es:'Sitios web clonados',            def:'Páginas falsas que imitan sitios legítimos para robar credenciales o datos bancarios.',                         conf:2 },
  { en:'Use Cases',            es:'Casos de uso',                   def:'Escenarios en que una tecnología se aplica de forma legítima y beneficiosa.',                                   conf:2 },
  { en:'Abuse Cases',          es:'Casos de abuso',                 def:'Escenarios en que una tecnología es usada de forma maliciosa o dañina.',                                        conf:2 },
  { en:'Cybercrime',           es:'Cibercrimen',                    def:'Actividades delictivas realizadas a través de medios digitales.',                                                conf:2 },
  { en:'Login Vulnerability',  es:'Vulnerabilidad de inicio de sesión', def:'Fallo de seguridad en el sistema de autenticación que permite acceso no autorizado.',                       conf:2 },
  { en:'Phishing',             es:'Suplantación de identidad',      def:'Ataque que engaña al usuario para que revele información confidencial.',                                         conf:2 },
  { en:'Cyberbullying',        es:'Ciberacoso',                     def:'Acoso o intimidación realizada a través de plataformas digitales.',                                              conf:2 },
  { en:'AI Compliance',        es:'Complacencia de la IA',          def:'Tendencia de modelos IA a responder cualquier solicitud sin cuestionar la intención del usuario.',              conf:2 },
  { en:'Secure Software',      es:'Software seguro',                def:'Aplicación desarrollada con prácticas que minimizan vulnerabilidades y riesgos.',                               conf:2 },
  { en:'Brute Force Attack',   es:'Ataque de fuerza bruta',         def:'Método que prueba sistemáticamente todas las combinaciones posibles para descifrar una contraseña.',            conf:2 },
];

const glossBody   = document.getElementById('glossBody');
const glossSearch = document.getElementById('glossSearch');
const glossEmpty  = document.getElementById('glossEmpty');
const filterBtns  = document.querySelectorAll('.filter-btn');
let currentFilter = 'all', currentSearch = '';

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
function hl(text, q) {
  if (!q) return text;
  return text.replace(new RegExp(`(${esc(q)})`,'gi'),'<mark>$1</mark>');
}

function renderGlossary() {
  const q = currentSearch.toLowerCase().trim();
  const filtered = glossaryData.filter(item => {
    if (currentFilter === 'conf1' && item.conf !== 1) return false;
    if (currentFilter === 'conf2' && item.conf !== 2) return false;
    if (q) return item.en.toLowerCase().includes(q) || item.es.toLowerCase().includes(q) || item.def.toLowerCase().includes(q);
    return true;
  });
  glossEmpty.classList.toggle('hidden', filtered.length > 0);
  glossBody.innerHTML = filtered.map((item, i) => `
    <tr>
      <td class="td-num">${String(i+1).padStart(2,'0')}</td>
      <td class="td-en">${hl(item.en,q)}</td>
      <td>${hl(item.es,q)}</td>
      <td>${hl(item.def,q)}</td>
      <td class="td-conf"><span class="conf-dot dot-${item.conf}" title="Conferencia ${item.conf}"></span></td>
    </tr>`).join('');
}

glossSearch.addEventListener('input', e => { currentSearch = e.target.value; renderGlossary(); });
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.filter;
  renderGlossary();
}));
renderGlossary();
