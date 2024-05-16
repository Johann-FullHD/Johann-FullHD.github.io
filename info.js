let downloadLink = "";
const validPasswords = {
  "link-to-eos-templates.zip": ["password1", "password2"],
  "link-to-eos-templates2.zip": ["password3", "password4"],
  "link-to-powerpoint-templates.zip": ["password5", "password6"],
};

function openModal(link) {
  downloadLink = link;
  if (localStorage.getItem(link) === "true") {
    window.location.href = link;
  } else {
    const modal = document.getElementById("passwordModal");
    modal.style.display = "block";
    setTimeout(() => {
      modal.classList.add("show");
      document.querySelector(".modal-content").classList.add("show");
    }, 10);
  }
}

function closeModal() {
  const modal = document.getElementById("passwordModal");
  modal.classList.remove("show");
  document.querySelector(".modal-content").classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
  document.getElementById("passwordInput").value = "";
  document.getElementById("feedback").textContent = "";
}

function checkPassword() {
  const password = document.getElementById("passwordInput").value;
  const rememberMe = document.getElementById("rememberMe").checked;
  const feedback = document.getElementById("feedback");

  if (validPasswords[downloadLink].includes(password)) {
    feedback.textContent = "Password correct. Redirecting...";
    feedback.className = "feedback success";
    if (rememberMe) {
      localStorage.setItem(downloadLink, "true");
    }
    setTimeout(() => {
      window.location.href = downloadLink;
    }, 1000);
    return false;
  } else {
    feedback.textContent = "Incorrect password. Please try again.";
    feedback.className = "feedback error";
    document.getElementById("passwordInput").value = "";
    return false;
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("passwordModal");
  if (event.target === modal) {
    closeModal();
  }
};
