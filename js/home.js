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
        openAuthModal("login", "Inicia sesión o regístrate para comprar.");
      });
    }

    return;
  }

  authArea.innerHTML = `
    <span class="user-greeting">
      Hola, ${escapeHtml(session.nickname)} (${escapeHtml(session.rol)})
    </span>

    <button id="logout-button" class="btn btn-outline" type="button">
      Salir
    </button>
  `;

  const logoutButton = document.getElementById("logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
}

function handleLogout() {
  clearSession();
  updateAuthUI();
  showToast("Sesión cerrada correctamente.", "info");
}

function handleCartClick() {
  const session = getCurrentSession();

  if (!session) {
    showToast("Debes iniciar sesión para acceder al carrito.", "warning");
    openAuthModal("login", "Inicia sesión o regístrate para comprar.");
    return;
  }

  showToast("El carrito se implementará en el siguiente bloque.", "info");
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

  const cartButton = document.getElementById("cart-button");

  if (cartButton) {
    cartButton.addEventListener("click", handleCartClick);
  }
}

function initHome() {
  renderCatalog("destacados");
  updateAuthUI();
  bindAuthModalEvents();
  bindHomeEvents();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHome);
} else {
  initHome();
}