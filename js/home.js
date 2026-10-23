function updateAuthUI() {
  const authArea = document.getElementById("auth-area");

  if (!authArea) {
    return;
  }

  const session = getCurrentSession();

  if (!session) {
    authArea.innerHTML = `
      <button id="open-auth-button" class="btn btn-primary" type="button">
        Ingresar
      </button>
    `;

    const openButton = document.getElementById("open-auth-button");

    if (openButton) {
      openButton.addEventListener("click", () => {
        openAuthModal(
          "login",
          "Inicia sesión o regístrate para comprar.",
          true
        );
      });
    }
  } else {
    authArea.innerHTML = `
      <a class="user-greeting" href="./pages/perfil.html">
        Hola, ${escapeHtml(session.nickname)} (${escapeHtml(session.rol)})
      </a>

      <button id="logout-button" class="btn btn-outline" type="button">
        Salir
      </button>
    `;

    const logoutButton = document.getElementById("logout-button");

    if (logoutButton) {
      logoutButton.addEventListener("click", handleLogout);
    }
  }

  if (typeof updateCartUI === "function") {
    updateCartUI();
  }
}

function handleLogout() {
  if (typeof closeCartDropdown === "function") {
    closeCartDropdown();
  }

  clearSession();
  updateAuthUI();
  showToast("Sesión cerrada correctamente.", "info");
}

function showPendingNotice() {
  const notice = getFromLocalStorage("binaryshop_notice", "");

  if (!notice) {
    return;
  }

  removeFromLocalStorage("binaryshop_notice");
  showToast(notice, "info");
}

function bindHomeEvents() {
  const productGrid = document.getElementById("product-grid");

  if (productGrid) {
    productGrid.addEventListener("click", handleProductAction);
  }

  const categoryList = document.getElementById("category-list");

  if (categoryList) {
    categoryList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-view]");

      if (button) {
        renderCatalog(button.dataset.view);
      }
    });
  }

  const viewAllButton = document.getElementById("view-all-button");

  if (viewAllButton) {
    viewAllButton.addEventListener("click", () => {
      renderCatalog("todos");
    });
  }
}

function initHome() {
  renderCatalog("destacados");
  updateAuthUI();
  bindAuthModalEvents();
  bindCartEvents();
  bindCheckoutEvents();
  bindHomeEvents();
  showPendingNotice();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHome);
} else {
  initHome();
}