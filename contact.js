document.getElementById('contactFormSubmit').addEventListener('click', function(event) {
  event.preventDefault();

  // Validation
  const name = document.getElementById('contact-form-9-name').value;
  const email = document.getElementById('contact-form-9-email').value;
  const topic = document.getElementById('contact-form-9-options').value;
  const message = document.getElementById('contact-form-9-message').value;
  const termsAccepted = document.getElementById('contact-form-9-check').checked;

  if (!name || !email || !topic || !message || !termsAccepted) {
    alert('Please fill out all required fields and accept the Terms of Service.');
    return;
  }
  
    const templateParams = {
      name: name,
      email: email,
      topic: topic,
      message: message
    };
  
    emailjs.send("service_op9vtjb", "template_qq550dm", templateParams)
      .then(function(response) {
         document.getElementById('contactForm').reset();
         const modal = document.getElementById('successModal');
         modal.style.display = "block";
         document.getElementById('closeModal').onclick = function() {
           modal.style.display = "none";
         }
         window.onclick = function(event) {
           if (event.target == modal) {
             modal.style.display = "none";
           }
         }
      }, function(error) {
         alert('An error occurred. Please try again.');
      });
  });
  