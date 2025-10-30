(function () {
  const loginForm = document.querySelector(".glitch-card");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.querySelector(".submit-btn");
  const loginError = document.createElement("div");
  loginError.className = "login-error";
  loginError.style.display = "none";
  loginError.style.color = "#ff3b30";
  loginError.style.fontSize = "0.85rem";
  loginError.style.padding = "0.5rem 0";
  loginError.style.textAlign = "center";
  loginError.style.marginTop = "0.5rem";

  const TOKEN_EXPIRY = 5 * 60 * 1000;
  const ADMIN_URL = "admin.html";

  const OBF_USERS = {
    Admin: {
      pw2: "YzJseWFtWnI=",
      role: "administrator",
      name: "Admin",
    },
    Abitur: {
      pw2: "UjFsTFRESTM=",
      role: "editor",
      name: "Abitur Benutzer",
    },
  };
  function decodePwd(obf) {
    try {
      return atob(atob(obf));
    } catch (e) {
      return "";
    }
  }

  function init() {
    if (loginForm) {
      loginForm.appendChild(loginError);
    }

    checkUrlParams();

    checkLoginStatus();

    if (loginForm) {
      loginForm.addEventListener("submit", handleLogin);
    }

    if (loginButton) {
      loginButton.addEventListener("click", handleLogin);
    }

    if (usernameInput) {
      usernameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          handleLogin(e);
        }
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          handleLogin(e);
        }
      });
    }
  }

  /**
   *
   */
  function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get("reason");
    const error = urlParams.get("error");

    if (reason && loginError) {
      loginError.textContent = decodeURIComponent(reason);
      loginError.style.display = "block";
    }

    if (error && loginError) {
      loginError.textContent = decodeURIComponent(error);
      loginError.style.display = "block";
      loginError.classList.add("shake");

      setTimeout(() => {
        loginError.classList.remove("shake");
      }, 500);
    }
  }

  /**
   *
   *
   */
  function checkLoginStatus() {
    const path = window.location.pathname;
    const isLoginPage = /login\.html?$/.test(path);
    if (isLoginPage) {
      try {
        sessionStorage.removeItem("admin_session");
        sessionStorage.removeItem("abitur_session");
      } catch (_) {}
      clearAuthToken();
      return;
    }
    if (path.includes("admin") && !sessionStorage.getItem("admin_session")) {
      window.location.replace(
        "login.html?reason=" + encodeURIComponent("Bitte melden Sie sich an.")
      );
      return;
    }
    if (
      path.includes("admin") &&
      sessionStorage.getItem("abitur_session") &&
      !sessionStorage.getItem("admin_session")
    ) {
      window.location.replace(
        "login.html?reason=" + encodeURIComponent("Keine Berechtigung.")
      );
      return;
    }
  }

  /**
   *
   * @param {Event}
   */
  function handleLogin(e) {
    e.preventDefault();

    if (!usernameInput || !passwordInput) {
      showError("Login-Formular ist unvollständig.");
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showError("Bitte geben Sie Benutzername und Passwort ein.");
      return;
    }

    if (loginButton) {
      loginButton.disabled = true;
      loginButton.querySelector(".btn-text").textContent = "CONNECTING...";
    }

    setTimeout(() => {
      authenticateUser(username, password);
    }, 1000);
  }

  /**
   * Benutzer authentifizieren
   * @param {string}
   * @param {string}
   */
  function authenticateUser(username, password) {
    const entry = OBF_USERS[username];
    if (entry) {
      const real = decodePwd(entry.pw2);
      if (real === password) {
        try {
          if (username === "Admin")
            sessionStorage.setItem("admin_session", "1");
          else if (username === "Abitur")
            sessionStorage.setItem("abitur_session", "1");
        } catch (_) {}
        if (username === "Admin") {
          window.location.href = ADMIN_URL;
        } else {
          window.location.href =
            "https://drive.google.com/drive/folders/1bUR9_5pOCzpGarQA08MV352y6xsKfIX6";
        }
        return;
      }
    }
    showError("Benutzername oder Passwort falsch.");
    if (loginButton) {
      loginButton.disabled = false;
      const span = loginButton.querySelector(".btn-text");
      if (span) span.textContent = "INITIATE_CONNECTION";
    }
  }

  /**
   * Token generieren
   * @param {Object}
   * @returns {string}
   */
  function generateToken(user) {
    const tokenData = {
      user: user,
      exp: Date.now() + TOKEN_EXPIRY,
    };

    return btoa(JSON.stringify(tokenData));
  }

  /**
   *
   * @param {string}
   * @returns {boolean}
   */
  function validateToken(token) {
    try {
      const tokenData = JSON.parse(atob(token));

      if (tokenData.exp < Date.now()) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Auth-Token speichern
   * @param {string} token - Auth-Token
   * @param {boolean}
   */
  function storeAuthToken(token, remember) {
    if (remember) {
      try {
        localStorage.setItem("adminAuthToken", token);
      } catch (e) {
        console.error("Fehler beim Speichern des Tokens in localStorage:", e);
      }
    } else {
      try {
        sessionStorage.setItem("adminAuthToken", token);
      } catch (e) {
        console.error("Fehler beim Speichern des Tokens in sessionStorage:", e);
      }
    }
  }

  /**
   * Auth-Token holen
   * @returns {string|null}
   */
  function getAuthToken() {
    let token = null;
    try {
      token = sessionStorage.getItem("adminAuthToken");
    } catch (e) {
      console.error("Fehler beim Lesen des Tokens aus sessionStorage:", e);
    }

    if (!token) {
      try {
        token = localStorage.getItem("adminAuthToken");
      } catch (e) {
        console.error("Fehler beim Lesen des Tokens aus localStorage:", e);
      }
    }

    return token;
  }

  /**
   *
   */
  function clearAuthToken() {
    try {
      sessionStorage.removeItem("adminAuthToken");
      localStorage.removeItem("adminAuthToken");
    } catch (e) {
      console.error("Fehler beim Löschen des Auth-Tokens:", e);
    }
  }

  /**
   *
   * @param {string}
   */
  function redirectToLogin(reason) {
    window.location.href = `login.html?reason=${encodeURIComponent(reason)}`;
  }

  /**
   * Fehlermeldung anzeigen
   * @param {string}
   */
  function showError(message) {
    if (loginError) {
      loginError.textContent = message;
      loginError.style.display = "block";
      loginError.classList.add("shake");

      setTimeout(() => {
        loginError.classList.remove("shake");
      }, 500);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
