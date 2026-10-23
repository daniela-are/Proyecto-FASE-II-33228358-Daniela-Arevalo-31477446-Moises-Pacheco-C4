let redirectAfterLogin = false;

function getAuthModalElements() {
  return {
    modal: document.getElementById("auth-modal"),
    close: document.getElementById("close-auth-modal"),
    tabLogin: document.getElementById("tab-login"),
    tabRegister: document.getElementById("tab-register"),
    loginForm: document.getElementById("login-form"),
    registerForm: document.getElementById("register-form"),
    loginError: document.getElementById("login-error"),
    registerError: document.getElementById("register-error"),
    title: document.getElementById("auth-modal-title"),
    message: document.getElementById("auth-modal-message")
  };
}

function setAuthModalMessage(message) {
  const elements = getAuthModalElements();
  if (elements.message) elements.message.textContent = message || "";
}

function clearAuthErrors() {
  const elements = getAuthModalElements();
  if (elements.loginError) elements.loginError.textContent = "";
  if (elements.registerError) elements.registerError.textContent = "";
}

function switchAuthTab(tab = "login") {
  const elements = getAuthModalElements();
  const isLogin = tab === "login";
  if (elements.loginForm) elements.loginForm.classList.toggle("hidden", !isLogin);
  if (elements.registerForm) elements.registerForm.classList.toggle("hidden", isLogin);
  if (elements.tabLogin) elements.tabLogin.classList.toggle("active", isLogin);
  if (elements.tabRegister) elements.tabRegister.classList.toggle("active", !isLogin);
  if (elements.title) elements.title.textContent = isLogin ? "Iniciar sesión" : "Crear cuenta";
}

function openAuthModal(tab = "login", message = "", redirect = false) {
  const elements = getAuthModalElements();
  if (!elements.modal) return;
  redirectAfterLogin = redirect;
  elements.modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  switchAuthTab(tab);
  setAuthModalMessage(message || "Inicia sesión o regístrate para comprar.");
}

function closeAuthModal() {
  const elements = getAuthModalElements();
  if (!elements.modal) return;
  elements.modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  clearAuthErrors();
  redirectAfterLogin = false;
}

function getRegisterFormData() {
  return {
    nombre: getInputValue("register-nombre").trim(),
    apellido: getInputValue("register-apellido").trim(),
    direccion: getInputValue("register-direccion").trim(),
    nickname: getInputValue("register-nickname").trim(),
    password: getInputValue("register-password"),
    confirmPassword: getInputValue("register-confirm-password"),
    rol: getInputValue("register-role"),
    banco: getInputValue("register-bank").trim(),
    tarjeta: getInputValue("register-card").trim()
  };
}

function validateRegisterForm(data) {
  if (!data.nombre || !data.apellido || !data.direccion || !data.nickname ||
      !data.password || !data.confirmPassword || !data.rol || !data.banco || !data.tarjeta) {
    return { success: false, message: "Todos los campos son obligatorios." };
  }
  if (data.nickname.trim().length < 3) {
    return { success: false, message: "El nickname debe tener al menos 3 caracteres." };
  }
  if (data.password.length < 6) {
    return { success: false, message: "La contraseña debe tener al menos 6 caracteres." };
  }
  if (data.password !== data.confirmPassword) {
    return { success: false, message: "Las contraseñas no coinciden." };
  }
  if (!ROLES_REGISTRO.includes(data.rol)) {
    return { success: false, message: "El rol seleccionado no es válido." };
  }
  const cardDigits = data.tarjeta.replace(/\D/g, "");
  if (cardDigits.length < 12) {
    return { success: false, message: "El número de tarjeta debe tener al menos 12 dígitos." };
  }
  return { success: true };
}

function handleLoginSubmit(event) {
  event.preventDefault();
  clearAuthErrors();

  const nickname = getInputValue("login-nickname");
  const password = getInputValue("login-password");
  const rol = getInputValue("login-role");

  if (!nickname.trim() || !password || !rol) {
    const elements = getAuthModalElements();
    if (elements.loginError) elements.loginError.textContent = "Ingresa nickname, contraseña y rol.";
    return;
  }

  const result = loginUser({ nickname, password, rol });
  if (!result.success) {
    const elements = getAuthModalElements();
    if (elements.loginError) elements.loginError.textContent = result.message;
    return;
  }

  const elements = getAuthModalElements();
  if (elements.loginForm) elements.loginForm.reset();

  if (redirectAfterLogin) {
    redirectAfterLogin = false;
    window.location.href = "pages/perfil.html";
    return;
  }

  closeAuthModal();
  if (typeof updateAuthUI === "function") updateAuthUI();
  showToast(`Bienvenido, ${result.session.nombre}.`, "success");
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  clearAuthErrors();

  const data = getRegisterFormData();
  const validation = validateRegisterForm(data);

  if (!validation.success) {
    const elements = getAuthModalElements();
    if (elements.registerError) elements.registerError.textContent = validation.message;
    return;
  }

  const existente = findUserByNickname(data.nickname);
  if (existente) {
    const coincide = existente.password === data.password;
    const esComprador = existente.rol === "comprador";
    const quiereVender = data.rol === "vendedor";

    if (coincide && esComprador && quiereVender) {
      const resultado = updateUserProfile(existente.nickname, { rol: "vendedor" });
      if (resultado.success) {
        const elements = getAuthModalElements();
        if (elements.registerForm) elements.registerForm.reset();

        if (redirectAfterLogin) {
          redirectAfterLogin = false;
          window.location.href = "pages/perfil.html";
          return;
        }

        closeAuthModal();
        if (typeof updateAuthUI === "function") updateAuthUI();
        showToast("Opciones de venta habilitadas. Bienvenido, " + resultado.user.nickname + ".", "success");
      }
      return;
    }
  }

  const result = registerUser(data);
  if (!result.success) {
    const elements = getAuthModalElements();
    if (elements.registerError) elements.registerError.textContent = result.message;
    return;
  }

  const elements = getAuthModalElements();
  if (elements.registerForm) elements.registerForm.reset();

  if (redirectAfterLogin) {
    redirectAfterLogin = false;
    window.location.href = "pages/perfil.html";
    return;
  }

  closeAuthModal();
  if (typeof updateAuthUI === "function") updateAuthUI();
  showToast("Registro exitoso. Bienvenido a BinaryShop.", "success");
}

function bindAuthModalEvents() {
  const elements = getAuthModalElements();
  if (!elements.modal) return;

  if (elements.close) elements.close.addEventListener("click", closeAuthModal);

  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) closeAuthModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.classList.contains("hidden")) closeAuthModal();
  });

  if (elements.tabLogin) elements.tabLogin.addEventListener("click", () => switchAuthTab("login"));
  if (elements.tabRegister) elements.tabRegister.addEventListener("click", () => switchAuthTab("register"));
  if (elements.loginForm) elements.loginForm.addEventListener("submit", handleLoginSubmit);
  if (elements.registerForm) elements.registerForm.addEventListener("submit", handleRegisterSubmit);
}