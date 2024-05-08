const downloadBtns = document.querySelectorAll('.download-btn');

downloadBtns.forEach((downloadBtn) => {
  downloadBtn.addEventListener('click', () => {
    const passwords = ['Johann', 'Kramer', 'Juli'];
    const password = prompt('Enter password to access the premium:');

    // Add some basic styling to the prompt
    document.querySelector('body').style.backgroundColor = '#f5f5f5';
    document.querySelector('.prompt').style.backgroundColor = '#fff';
    document.querySelector('.prompt').style.border = '1px solid #ccc';
    document.querySelector('.prompt').style.padding = '10px';
    document.querySelector('.prompt').style.fontFamily = 'Segoe UI';
    document.querySelector('.prompt input').style.padding = '5px';
    document.querySelector('.prompt input').style.fontSize = '16px';

    if (passwords.includes(password)) {
      window.open('https://example.com/hidden-gallery', '_blank');
    } else {
      alert('Invalid password');
    }
  });
});

document.addEventListener('scroll', function() {
  var nav = document.querySelector('nav.nav-bg');
  if (window.pageYOffset > 200) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});