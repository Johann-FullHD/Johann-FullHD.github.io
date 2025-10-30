/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) =>{
   const toggle = document.getElementById(toggleId),
         nav = document.getElementById(navId)
   if (!toggle || !nav) return;

   // ARIA
   toggle.setAttribute('aria-controls', navId);
   toggle.setAttribute('aria-expanded', 'false');

   function setOpen(open){
     nav.classList.toggle('show-menu', open);
     toggle.classList.toggle('show-icon', open);
     toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
   }

   toggle.addEventListener('click', () =>{
       setOpen(!nav.classList.contains('show-menu'));
   });

   // Close on outside click
   document.addEventListener('click', (e) => {
     if (!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
   });

   // Close on ESC
   document.addEventListener('keydown', (e) => {
     if (e.key === 'Escape') setOpen(false);
   });

   // Close when a nav link is clicked
   nav.querySelectorAll('.nav__link').forEach(a => {
     a.addEventListener('click', () => setOpen(false));
   });
}

showMenu('nav-toggle','nav-menu')

// Neu: Aktiven Nav-Link anhand der URL markieren
(function setActiveNav(){
  const links = document.querySelectorAll('#nav-menu .nav__link[href]');
  if (!links.length) return;
  const norm = (p) => p.replace(/\/$/, '/index.html');
  const current = norm(location.pathname || '/index.html');

  let matched = false;
  links.forEach(a => {
    a.classList.remove('nav__link--active');
    a.removeAttribute('aria-current');
    const href = a.getAttribute('href') || '';
    const linkPath = norm(new URL(href, location.href).pathname);
    const isHomeGroup = current.endsWith('/index.html') && (href === '#' || linkPath === '/' || linkPath.endsWith('/index.html'));
    if (linkPath === current || isHomeGroup) {
      a.classList.add('nav__link--active');
      a.setAttribute('aria-current', 'page');
      matched = true;
    }
  });

  if (!matched) {
    const pre = document.querySelector('#nav-menu .nav__link[aria-current="page"]');
    if (pre) pre.classList.add('nav__link--active');
  }
})();