let profileEditMode = false;

function maskCard(card) {
  const digits = String(card == null ? "" : card).replace(/\D/g, "");
  if (!digits) return "••••";
  return `•••• ${digits.slice(-4)}`;
}

function getInitials(session) {
  const parts = `${session.nombre} ${session.apellido}`.trim().split(/\s+/);
  const initials = parts.map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase();
  return initials || "BS";
}

function getProfileUser(session) {
  return findUserByNickname(session.nickname);
}

function profileCardHtml(session, user, esVendedor) {
    let acciones;

  if (esVendedor === "admin") {
    acciones = `
      <div class="profile-actions">
        <button id="profile-edit-button" class="btn btn-secondary" type="button">Editar datos</button>
        <a class="btn btn-primary" href="administrador.html">Ir al panel de administración</a>
      </div>
    `;
  } else if (esVendedor) {
    acciones = `
      <div class="profile-actions">
        <button id="profile-edit-button" class="btn btn-secondary" type="button">Editar datos</button>
        <a class="btn btn-primary" href="vendedor.html">Agregar producto</a>
        <a class="btn btn-secondary" href="vendedor.html#historial">Ver mis ventas</a>
      </div>
    `;
  } else {
    acciones = `
      <div class="profile-actions">
        <button id="profile-edit-button" class="btn btn-secondary" type="button">Editar datos</button>
        <a class="btn btn-primary" href="../index.html">Empezar a comprar</a>
      </div>
    `;
  }

  return `
    <div class="profile-card">
      <div class="profile-avatar">${escapeHtml(getInitials(session))}</div>
      <h2 class="profile-name">${escapeHtml(user.nombre)} ${escapeHtml(user.apellido)}</h2>
      <p class="profile-nickname">@${escapeHtml(user.nickname)}</p>
      <span class="role-badge role-${escapeHtml(user.rol)}">${escapeHtml(user.rol)}</span>
      <div class="profile-data">
        <div class="profile-data-row"><span>Dirección</span><strong>${escapeHtml(user.direccion)}</strong></div>
        <div class="profile-data-row"><span>Banco</span><strong>${escapeHtml(user.banco)}</strong></div>
        <div class="profile-data-row"><span>Tarjeta</span><strong>${escapeHtml(maskCard(user.tarjeta))}</strong></div>
      </div>
      ${acciones}
    </div>
  `;
}

function profileEditFormHtml(user) {
  return `
    <div class="profile-card">
      <h2 class="profile-title">Editar mis datos</h2>
      <p class="profile-nickname">El nickname y el rol no se pueden modificar.</p>
      <form id="profile-edit-form" class="auth-form">
        <div class="form-row">
          <div class="form-group"><label for="edit-nombre">Nombre</label>
            <input id="edit-nombre" type="text" value="${escapeHtml(user.nombre)}" required>
          </div>
          <div class="form-group"><label for="edit-apellido">Apellido</label>
            <input id="edit-apellido" type="text" value="${escapeHtml(user.apellido)}" required>
          </div>
        </div>
        <div class="form-group"><label for="edit-direccion">Dirección</label>
          <input id="edit-direccion" type="text" value="${escapeHtml(user.direccion)}" required>
        </div>
        <div class="form-group"><label for="edit-banco">Banco</label>
          <input id="edit-banco" type="text" value="${escapeHtml(user.banco)}" required>
        </div>
        <div class="form-group"><label for="edit-card">Número de tarjeta</label>
          <input id="edit-card" type="text" value="${escapeHtml(user.tarjeta)}" required>
        </div>
        <p id="profile-edit-error" class="form-error" role="alert"></p>
        <div class="profile-actions">
          <button class="btn btn-primary" type="submit">Guardar cambios</button>
          <button id="profile-edit-cancel" class="btn btn-outline" type="button">Cancelar</button>
        </div>
      </form>
    </div>
  `;
}

function noticeCardHtml(session) {
  return `
    <div class="profile-card notice-card">
      <div class="notice-icon">⚙</div>
      <h2 class="profile-title">Panel de ${escapeHtml(session.rol)} en desarrollo</h2>
      <p class="profile-nickname">
        Los paneles de vendedor y administrador serán desarrollados próximamente.
        Mientras tanto, puedes seguir explorando la tienda.
      </p>
      <a class="btn btn-primary" href="../index.html">Volver a la tienda</a>
    </div>
  `;
}

function bindProfileEvents(session) {
  const editButton = document.getElementById("profile-edit-button");
  const cancelButton = document.getElementById("profile-edit-cancel");
  const editForm = document.getElementById("profile-edit-form");

  if (editButton) editButton.addEventListener("click", () => { profileEditMode = true; renderProfile(); });
  if (cancelButton) cancelButton.addEventListener("click", () => { profileEditMode = false; renderProfile(); });
  if (editForm) editForm.addEventListener("submit", (event) => handleProfileSave(event, session));
}

function handleProfileSave(event, session) {
  event.preventDefault();
  const errorElement = document.getElementById("profile-edit-error");

  const changes = {
    nombre: getInputValue("edit-nombre").trim(),
    apellido: getInputValue("edit-apellido").trim(),
    direccion: getInputValue("edit-direccion").trim(),
    banco: getInputValue("edit-banco").trim(),
    tarjeta: getInputValue("edit-card").trim()
  };

  if (!changes.nombre || !changes.apellido || !changes.direccion || !changes.banco || !changes.tarjeta) {
    if (errorElement) errorElement.textContent = "Todos los campos son obligatorios.";
    return;
  }

  const cardDigits = changes.tarjeta.replace(/\D/g, "");
  if (cardDigits.length < 12) {
    if (errorElement) errorElement.textContent = "El número de tarjeta debe tener al menos 12 dígitos.";
    return;
  }

  const result = updateUserProfile(session.nickname, changes);
  if (!result.success) {
    if (errorElement) errorElement.textContent = result.message;
    return;
  }

  profileEditMode = false;
  renderProfile();
  showToast("Datos actualizados correctamente.", "success");
}

function renderMisCompras(session) {
  const seccion = document.getElementById("mis-compras");
  const contenedor = document.getElementById("mis-compras-lista");
  if (!seccion || !contenedor) return;

  const ordenes = getOrdenesDeComprador(session.nickname);
  contenedor.innerHTML = "";

  if (ordenes.length === 0) {
    contenedor.innerHTML = '<p class="profile-nickname">Aún no has realizado compras.</p>';
  } else {
    ordenes.slice().reverse().forEach((orden) => {
      const fecha = new Date(orden.fecha);
      const nombres = orden.items.map((item) => `${item.nombre} x${item.cantidad}`).join(", ");
      const tarjeta = document.createElement("article");
      tarjeta.className = "mis-compras-item";
      tarjeta.innerHTML = `
        <header>
          <span>${escapeHtml(orden.id)}</span>
          <span>${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}</span>
        </header>
        <p>${escapeHtml(nombres)}</p>
        <strong>Total: ${formatPrice(orden.total)}</strong>
      `;
      contenedor.appendChild(tarjeta);
    });
  }
  seccion.classList.remove("hidden");
}

function hideMisCompras() {
  const seccion = document.getElementById("mis-compras");
  if (seccion) seccion.classList.add("hidden");
}

function renderProfile() {
  const container = document.getElementById("profile-container");
  if (!container) return;

  const session = getCurrentSession();
  if (!session) return;

  const user = getProfileUser(session);

   if (session.rol === "administrador") {
    container.innerHTML = user
      ? (profileEditMode ? profileEditFormHtml(user) : profileCardHtml(session, user, "admin"))
      : noticeCardHtml(session);
    hideMisCompras();
    if (user) bindProfileEvents(session);
    return;
  }

  if (session.rol === "vendedor") {
    container.innerHTML = user
      ? (profileEditMode ? profileEditFormHtml(user) : profileCardHtml(session, user, true))
      : noticeCardHtml(session);
    hideMisCompras();
    if (user) bindProfileEvents(session);
    return;
  }

  if (session.rol !== "comprador") {
    container.innerHTML = noticeCardHtml(session);
    hideMisCompras();
    return;
  }

  if (!user) {
    container.innerHTML = noticeCardHtml(session);
    hideMisCompras();
    return;
  }

  container.innerHTML = profileEditMode ? profileEditFormHtml(user) : profileCardHtml(session, user, false);
  bindProfileEvents(session);
  renderMisCompras(session);
}

function initPerfil() {
  const session = getCurrentSession();
  if (!session) {
    saveToLocalStorage("binaryshop_notice", "Debes iniciar sesión para ver tu perfil.");
    window.location.href = "../index.html";
    return;
  }
  renderProfile();

  const avisoPendiente = getFromLocalStorage("binaryshop_notice", "");
  if (avisoPendiente) {
    removeFromLocalStorage("binaryshop_notice");
    showToast(avisoPendiente, "success");
  }

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      clearSession();
      saveToLocalStorage("binaryshop_notice", "Sesión cerrada correctamente.");
      window.location.href = "../index.html";
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPerfil);
} else {
  initPerfil();
}