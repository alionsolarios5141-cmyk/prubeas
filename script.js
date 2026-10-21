/**
 * Cuero & Alma
 * JavaScript vanilla, modular y accesible.
 */

"use strict";

/* =========================================================
   Utilidades
   ========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

/* =========================================================
   Menú móvil
   ========================================================= */

const initMobileMenu = () => {
  const toggle = $(".menu-toggle");
  const navigation = $("#main-navigation");

  if (!toggle || !navigation) return;

  const closeMenu = () => {
    navigation.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú de navegación");
  };

  const openMenu = () => {
    navigation.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú de navegación");
  };

  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Cerrar el menú después de seleccionar un enlace.
  $$(".main-nav a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Cerrar el menú con Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Si cambiamos a escritorio, restauramos el estado inicial.
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 960) {
      closeMenu();
    }
  });
};

/* =========================================================
   Modales de inicio de sesión y registro (independientes)
   ========================================================= */

const initAuthModals = () => {
  // Cada modal es completamente independiente: su propio elemento,
  // su propio formulario y su propio mensaje de estado.
  const modals = $$(".modal");

  if (!modals.length) return;

  let lastFocusedElement = null;
  let activeModal = null;

  const getFirstField = (modal) => $("input, select, textarea", modal);

  const closeModal = (modal) => {
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.body.style.overflow = "";
    activeModal = null;

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  const openModal = (id) => {
    const modal = document.getElementById(id);

    if (!modal) return;

    // Si hay otro modal abierto, se cierra primero (nunca se solapan).
    if (activeModal && activeModal !== modal) {
      closeModal(activeModal);
    }

    lastFocusedElement = document.activeElement;
    activeModal = modal;

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    const firstField = getFirstField(modal);

    if (firstField) {
      firstField.focus();
    }
  };

  // Botones del nav (Iniciar sesión / Registrarse).
  $$("[data-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.dataset.modal);
    });
  });

  // Botones de cierre (X) y overlay de cada modal.
  $$("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.closest(".modal"));
    });
  });

  // Enlaces "¿No tienes cuenta? / ¿Ya tienes cuenta?" para saltar de un
  // modal a otro sin pasar por el nav.
  $$("[data-switch-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.dataset.switchModal);
    });
  });

  // Cierre con la tecla Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeModal) {
      closeModal(activeModal);
    }
  });

  /* ---------- Formulario de inicio de sesión ---------- */

  const loginForm = $("#login-form");
  const loginMessage = $("#login-message");

  if (loginForm && loginMessage) {
    loginForm.addEventListener("submit", (event) => {
      if (!loginForm.checkValidity()) {
        event.preventDefault();
        loginForm.reportValidity();
        return;
      }

      // Validación superada: dejamos que el formulario se envíe de forma
      // normal (sin preventDefault ni reset) para que Flask reciba los
      // datos reales en /signin.
    });
  }

  /* ---------- Formulario de registro ---------- */

  const registerForm = $("#register-form");
  const registerMessage = $("#register-message");
  const registerPassword = $("#register-password");
  const registerPasswordConfirm = $("#register-password-confirm");

  if (registerForm && registerMessage) {
    registerForm.addEventListener("submit", (event) => {
      if (!registerForm.checkValidity()) {
        event.preventDefault();
        registerForm.reportValidity();
        return;
      }

      if (registerPassword.value !== registerPasswordConfirm.value) {
        event.preventDefault();
        registerPasswordConfirm.setCustomValidity(
          "Las contraseñas no coinciden."
        );
        registerForm.reportValidity();
        registerPasswordConfirm.setCustomValidity("");
        return;
      }

      // Validación superada: dejamos que el formulario se envíe de forma
      // normal (sin preventDefault) para que Flask reciba los datos en /signup.
    });

    // Limpia el mensaje de error personalizado al volver a escribir.
    registerPasswordConfirm.addEventListener("input", () => {
      registerPasswordConfirm.setCustomValidity("");
    });
  }
};

/* =========================================================
   Newsletter
   ========================================================= */

const initNewsletter = () => {
  const form = $("#newsletter-form");
  const email = $("#email");
  const message = $("#form-message");

  if (!form || !email || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!email.checkValidity()) {
      message.textContent =
        "Por favor, introduce un correo electrónico válido.";

      email.focus();
      return;
    }

    message.textContent =
      "¡Gracias por suscribirte! Te mantendremos al tanto de nuestras novedades.";

    form.reset();
  });
};

/* =========================================================
   Año automático del footer
   ========================================================= */

const initCurrentYear = () => {
  const year = $("#current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
};

/* =========================================================
   Inicialización
   ========================================================= */

const init = () => {
  initMobileMenu();
  initAuthModals();
  initNewsletter();
  initCurrentYear();
};

document.addEventListener("DOMContentLoaded", init);