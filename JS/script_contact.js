// script_contact.js
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const contactForm = document.querySelector('#contact-form');
const nameInput = contactForm.querySelector('#name');
const emailInput = contactForm.querySelector('#email');
const messageInput = contactForm.querySelector('#message');
const errorElement = document.querySelector('#error');
const successMsg = document.querySelector('#success-msg');
const submitBtn = contactForm.querySelector('#submit');

// Toggle theme function
function switchTheme(e) {
  document.documentElement.setAttribute('data-theme', e.target.checked? 'dark' : 'light');
}

// Add event listener to toggle switch
toggleSwitch.addEventListener('change', switchTheme);

// Validation functions
function validateName(name) {
  return name.trim().length >= 3; // Trim whitespace from input
}

function validateEmail(email) {
  // Use a more comprehensive email validation regex
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim()); // Trim whitespace from input
}

function validateMessage(message) {
  return message.trim().length >= 15; // Trim whitespace from input
}

// Form submission handler
function handleSubmit(e) {
  e.preventDefault();

  const name = nameInput.value.trim(); // Trim whitespace from input
  const email = emailInput.value.trim(); // Trim whitespace from input
  const message = messageInput.value.trim(); // Trim whitespace from input

  let errorMessage = '';

  if (!validateName(name)) {
    errorMessage = 'Your name should be at least 3 characters long.';
  } else if (!validateEmail(email)) {
    errorMessage = 'Please enter a valid email address.';
  } else if (!validateMessage(message)) {
    errorMessage = 'Please write a longer message.';
  }

  if (errorMessage) {
    errorElement.innerHTML = errorMessage;
    return;
  }

  // Send email using PHP
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('message', message);

  fetch('send-email.php', {
    method: 'POST',
    body: formData
  })
 .then(response => response.text())
 .then(data => {
    if (data === 'uccess') {
      errorElement.innerHTML = '';
      successMsg.innerHTML = 'Thank you! I will get back to you as soon as possible.';

      setTimeout(() => {
        successMsg.innerHTML = '';
        contactForm.reset();
      }, 6000);
    } else {
      errorElement.innerHTML = 'There was an error sending your message. Please try again later.';
    }
  })
 .catch(error => {
    errorElement.innerHTML = 'There was an error sending your message. Please try again later.';
  });
}

// Add event listener to form submission
contactForm.addEventListener('submit', handleSubmit);

// Check the browser's prefers-color-scheme media query to set the theme based on the user's preference
const theme = window.matchMedia('(prefers-color-scheme: dark)').matches? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', theme);