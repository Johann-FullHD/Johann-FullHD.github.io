// Rotierende Begriffe im Hero-Text (ohne jQuery)
document.addEventListener('DOMContentLoaded', function(){
  const words = document.querySelectorAll('.rotating-words span');
  if (!words.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  words.forEach(w => w.classList.remove('show','leave'));

  let i = 0;
  words[i].classList.add('show');

  if (prefersReduced) return; // Keine Animation bei reduzierter Bewegung

  setInterval(() => {
    const prev = i;
    words[prev].classList.remove('show');
    words[prev].classList.add('leave');
    i = (i + 1) % words.length;
    words[i].classList.remove('leave');
    words[i].classList.add('show');
  }, 2000);
});
