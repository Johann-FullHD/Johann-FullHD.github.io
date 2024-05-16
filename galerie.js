const images = document.querySelectorAll('.gallery7-image');

images.forEach((img) => {
  if (img) {
    img.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      // Add any additional functionality here
    });
  } else {
    console.warn('No image found with class "gallery7-image"');
  }
});


function handleScroll() {
  const images = document.querySelectorAll('.gallery7-image');

  images.forEach((img) => {
    if (isInViewport(img)) {
      img.src = img.getAttribute('src');
    }
  });
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

window.addEventListener('scroll', handleScroll);