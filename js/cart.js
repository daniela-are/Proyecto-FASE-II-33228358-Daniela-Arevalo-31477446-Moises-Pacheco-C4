const CART_KEY_PREFIX = "binaryshop_cart_";

function getCartKey() {
  const session = getCurrentSession();

  if (!session) {
    return null;
  }

  return CART_KEY_PREFIX + normalizeNickname(session.nickname);
}

function getCart() {
  const key = getCartKey();

  if (!key) {
    return [];
  }

  const items = getFromLocalStorage(key, []);

  return Array.isArray(items) ? items : [];
}

function saveCart(items) {
  const key = getCartKey();

  if (!key) {
    return false;
  }

  return saveToLocalStorage(key, items);
}

function getProductById(id) {
  return PRODUCTOS.find((product) => product.id === id);
}

const STOCK_KEY = "binaryshop_stock";

function getStockOverrides() {
  const data = getFromLocalStorage(STOCK_KEY, {});

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {};
  }

  return data;
}

function getProductStock(id) {
  const overrides = getStockOverrides();

  if (typeof overrides[id] === "number") {
    return overrides[id];
  }

  const product = getProductById(id);

  if (!product || typeof product.stock !== "number") {
    return 0;
  }

  return product.stock;
}

function setProductStock(id, value) {
  const overrides = getStockOverrides();
  overrides[id] = value;
  return saveToLocalStorage(STOCK_KEY, overrides);
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.cantidad, 0);
}

function getCartTotal() {
  return getCart().reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );
}

function addToCart(product, quantity = 1) {
  const session = getCurrentSession();

  if (!session) {
    return {
      success: false,
      code: "auth",
      message: "Debes iniciar sesión para añadir al carrito."
    };
  }

  const items = getCart();
  const existing = items.find((item) => item.id === product.id);
  const stock = getProductStock(product.id);
  const current = existing ? existing.cantidad : 0;

  if (current + quantity > stock) {
    return {
      success: false,
      code: "stock",
      message: `No hay más stock disponible de ${product.nombre}.`
    };
  }

  if (existing) {
    existing.cantidad += quantity;
    saveCart(items);
    updateCartUI(true);

    return {
      success: true,
      code: "updated",
      message: `Ya estaba en tu carrito: cantidad actualizada a ${existing.cantidad}.`
    };
  }

  items.push({
    id: product.id,
    nombre: product.nombre,
    precio: product.precio,
    categoria: product.categoria,
    cantidad: quantity
  });

  saveCart(items);
  updateCartUI(true);

  return {
    success: true,
    code: "added",
    message: `${product.nombre} añadido al carrito.`
  };
}

function changeItemQuantity(id, delta) {
  const items = getCart();
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    return;
  }

  const newQuantity = item.cantidad + delta;

  if (newQuantity <= 0) {
    removeItem(id);
    return;
  }

  const stock = getProductStock(id);

  if (newQuantity > stock) {
    showToast("No hay más stock disponible de este producto.", "warning");
    return;
  }

  item.cantidad = newQuantity;
  saveCart(items);
  updateCartUI(true);
}

function removeItem(id) {
  let items = getCart();
  const item = items.find((entry) => entry.id === id);

  items = items.filter((entry) => entry.id !== id);

  saveCart(items);
  updateCartUI(true);

  if (item) {
    showToast(`${item.nombre} eliminado del carrito.`, "info");
  }
}

function clearCart() {
  saveCart([]);
  updateCartUI(true);
  showToast("Carrito vaciado.", "info");
}

function updateCartUI(bump = false) {
  const countElement = document.getElementById("cart-count");
  const cartButton = document.getElementById("cart-button");
  const session = getCurrentSession();
  const count = session ? getCartCount() : 0;

  if (countElement) {
    countElement.textContent = count;
  }

  if (bump && cartButton && count > 0) {
    cartButton.classList.remove("cart-bump");
    void cartButton.offsetWidth;
    cartButton.classList.add("cart-bump");
  }

  const dropdown = document.getElementById("cart-dropdown");

  if (dropdown && dropdown.classList.contains("open")) {
    renderCartDropdown();
  }
}

function renderCartDropdown() {
  const itemsContainer = document.getElementById("cart-items");
  const footer = document.getElementById("cart-footer");
  const totalElement = document.getElementById("cart-total");

  if (!itemsContainer) {
    return;
  }

  const items = getCart();

  if (items.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        <p>Tu carrito está vacío.</p>
        <button id="cart-empty-browse" class="btn btn-secondary" type="button">
          Ver productos
        </button>
      </div>
    `;

    if (footer) {
      footer.classList.add("hidden");
    }

    return;
  }

  if (footer) {
    footer.classList.remove("hidden");
  }

  if (totalElement) {
    totalElement.textContent = formatPrice(getCartTotal());
  }

  itemsContainer.innerHTML = items
    .map((item) => {
      const stock = getProductStock(item.id);

      return `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-thumb">
            <span>Img</span>
          </div>

          <div class="cart-item-info">
            <strong>${escapeHtml(item.nombre)}</strong>
            <small>${formatPrice(item.precio)} c/u</small>

            <div class="cart-item-controls">
              <button
                class="qty-btn"
                type="button"
                data-cart-action="decrement"
                data-id="${item.id}"
                aria-label="Disminuir cantidad"
              >
                −
              </button>

              <span class="qty-value">${item.cantidad}</span>

              <button
                class="qty-btn"
                type="button"
                data-cart-action="increment"
                data-id="${item.id}"
                ${item.cantidad >= stock ? "disabled" : ""}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          <div class="cart-item-side">
            <span class="cart-item-subtotal">
              ${formatPrice(item.precio * item.cantidad)}
            </span>

            <button
              class="cart-item-remove"
              type="button"
              data-cart-action="remove"
              data-id="${item.id}"
              aria-label="Eliminar producto"
            >
              ×
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

function isCartDropdownOpen() {
  const dropdown = document.getElementById("cart-dropdown");

  return !!dropdown && dropdown.classList.contains("open");
}

function openCartDropdown() {
  const dropdown = document.getElementById("cart-dropdown");
  const cartButton = document.getElementById("cart-button");

  if (!dropdown) {
    return;
  }

  renderCartDropdown();
  dropdown.classList.add("open");

  if (cartButton) {
    cartButton.setAttribute("aria-expanded", "true");
  }
}

function closeCartDropdown() {
  const dropdown = document.getElementById("cart-dropdown");
  const cartButton = document.getElementById("cart-button");

  if (!dropdown) {
    return;
  }

  dropdown.classList.remove("open");

  if (cartButton) {
    cartButton.setAttribute("aria-expanded", "false");
  }
}

function toggleCartDropdown() {
  if (isCartDropdownOpen()) {
    closeCartDropdown();
  } else {
    openCartDropdown();
  }
}


function bindCartEvents() {
  const cartButton = document.getElementById("cart-button");
  const closeButton = document.getElementById("cart-close");
  const itemsContainer = document.getElementById("cart-items");
  const clearButton = document.getElementById("cart-clear");
  const checkoutButton = document.getElementById("cart-checkout");

  if (cartButton) {
    cartButton.addEventListener("click", () => {
      const session = getCurrentSession();

      if (!session) {
        showToast("Debes iniciar sesión para acceder al carrito.", "warning");
        openAuthModal("login", "Inicia sesión o regístrate para comprar.");
        return;
      }

      toggleCartDropdown();
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeCartDropdown);
  }

  if (itemsContainer) {
    itemsContainer.addEventListener("click", (event) => {
      const browseButton = event.target.closest("#cart-empty-browse");

      if (browseButton) {
        closeCartDropdown();

        const catalog = document.getElementById("catalogo");

        if (catalog) {
          catalog.scrollIntoView({ behavior: "smooth" });
        }

        return;
      }

      const actionButton = event.target.closest("[data-cart-action]");

      if (!actionButton) {
        return;
      }

      const id = Number(actionButton.dataset.id);
      const action = actionButton.dataset.cartAction;

      if (action === "increment") {
        changeItemQuantity(id, 1);
      } else if (action === "decrement") {
        changeItemQuantity(id, -1);
      } else if (action === "remove") {
        removeItem(id);
      }
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", clearCart);
  }

    if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (typeof openCheckout === "function") {
        openCheckout();
      }
    });
  }
}