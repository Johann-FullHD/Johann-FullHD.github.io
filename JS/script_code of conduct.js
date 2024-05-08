// Get the page wrapper element
const pageWrapper = document.querySelector('.page-wrapper');

// Add an event listener to the page wrapper
pageWrapper.addEventListener('scroll', () => {
  // Get the current scroll position
  const scrollTop = pageWrapper.scrollTop;

  // Add a class to the main header when the user scrolls down
  if (scrollTop > 200) {
    document.querySelector('.main-header').classList.add('scrolled');
  } else {
    document.querySelector('.main-header').classList.remove('scrolled');
  }
});