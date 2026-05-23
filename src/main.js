const cursorGlow = document.querySelector('#cursor-glow');
if (cursorGlow) {
  window.addEventListener('mousemove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

const navbar = document.querySelector('#navbar');
const updateNav = () => {
  if (!navbar) return;
  navbar.classList.toggle('nav-blur', window.scrollY > 24);
};
updateNav();
window.addEventListener('scroll', updateNav);

const menuBtn = document.querySelector('#menu-btn');
const mobileMenu = document.querySelector('#mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
  });
  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 140) current = section.id;
  });
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
});

const terminalLines = [
  'scanning project scope...',
  'checking responsive layout...',
  'polishing interface details...',
  'ready to ship.'
];
let lineIndex = 0;
setInterval(() => {
  const target = document.querySelector('.type-caret');
  if (!target) return;
  target.textContent = terminalLines[lineIndex % terminalLines.length];
  lineIndex += 1;
}, 2400);
