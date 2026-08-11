const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const toast = document.getElementById('toast');
const heroPlay = document.getElementById('heroPlay');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

menuToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

heroPlay.addEventListener('click', () => {
  heroPlay.textContent = heroPlay.textContent === '❚❚' ? '▶' : '❚❚';
  showToast(heroPlay.textContent === '❚❚'
    ? 'Preview diputar — tambahkan audio player untuk musik asli.'
    : 'Preview dijeda.');
});

document.querySelectorAll('.mini-play').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.music-card');
    const title = card.querySelector('h3').textContent;
    showToast(`Preview "${title}" dipilih.`);
  });
});

document.querySelectorAll('.news-card a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    showToast('Halaman artikel siap dikembangkan.');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
