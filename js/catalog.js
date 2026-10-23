let currentCatalogView = "destacados";

function getCategoryById(id) {
  return CATEGORIAS.find((category) => category.id === id);
}

function getCategoryName(id) {
  const category = getCategoriasActivas().find((c) => c.id === id);
  return category ? category.nombre : "General";
}

function getCategoryCount(id) {
  return PRODUCTOS.filter((product) => product.categoria === id).length;
}

function getFeaturedProducts() {
  return PRODUCTOS.filter((product) => product.destacado).slice(0, 12);
}

function getProductsByView(view) {
  if (view === "destacados") return getFeaturedProducts();
  if (view === "todos") return [...PRODUCTOS];
  return PRODUCTOS.filter((product) => product.categoria === view);
}

function updateCatalogTitle(view, count) {
  const title = document.getElementById("catalog-title");
  const subtitle = document.getElementById("catalog-subtitle");
  if (!title || !subtitle) return;

  if (view === "destacados") {
    title.textContent = "Productos destacados";
    subtitle.textContent = `Mostrando ${count} productos principales de la tienda.`;
  } else if (view === "todos") {
    title.textContent = "Todos los productos";
    subtitle.textContent = `Mostrando ${count} productos disponibles en la tienda.`;
  } else {
    title.textContent = getCategoryName(view);
    subtitle.textContent = `Mostrando ${count} productos de esta categoría.`;
  }
}

function createProductCard(product) {
  const imageHtml = product.imagen
    ? `<img src="${product.imagen}" alt="${escapeHtml(product.nombre)}">`
    : "<span>Imagen del producto</span>";

  return `
    <article class="product-card">
      <div class="product-image">${imageHtml}</div>
      <div class="product-info">
        <span class="product-category">${escapeHtml(getCategoryName(product.categoria))}</span>
        <h3>${escapeHtml(product.nombre)}</h3>
        <p>${escapeHtml(product.descripcion)}</p>
        <strong class="product-price">${formatPrice(product.precio)}</strong>
        <div class="product-actions">
          <button class="btn btn-secondary" type="button" data-action="add-to-cart" data-id="${product.id}">
            Añadir al carrito
          </button>
          <button class="btn btn-primary" type="button" data-action="buy-now" data-id="${product.id}">
            Comprar de inmediato
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderCategoryButtons() {
  const container = document.getElementById("category-list");
  if (!container) return;

  const featuredCount = getFeaturedProducts().length;
  const featuredButton = `
    <button class="category-card ${currentCatalogView === "destacados" ? "active" : ""}"
            type="button" data-view="destacados">
      <span>Destacados</span>
      <small>${featuredCount} productos</small>
    </button>
  `;

  const categoryButtons = getCategoriasActivas().map((category) => {
    const count = getCategoryCount(category.id);
    return `
      <button class="category-card ${currentCatalogView === category.id ? "active" : ""}"
              type="button" data-view="${category.id}">
        <span>${escapeHtml(category.nombre)}</span>
        <small>${count} productos</small>
      </button>
    `;
  }).join("");

  container.innerHTML = featuredButton + categoryButtons;
}

function renderCatalog(view = currentCatalogView) {
  currentCatalogView = view;
  const products = getProductsByView(view);
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = products.map(createProductCard).join("");
  updateCatalogTitle(view, products.length);
  renderCategoryButtons();
}

function handleProductAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const productId = button.dataset.id;
  const action = button.dataset.action;
  
  const product = PRODUCTOS.find((item) => String(item.id) === String(productId));
  if (!product) return;

  const session = getCurrentSession();
  if (!session) {
    showToast("Debes iniciar sesión o registrarte para continuar.", "warning");
    if (typeof openAuthModal === "function") {
      openAuthModal("login", "Inicia sesión o regístrate para comprar.");
    }
    return;
  }

  if (action === "add-to-cart") {
    const result = addToCart(product, 1);
    showToast(result.message, result.success ? "success" : "warning");
    return;
  }

  if (action === "buy-now") {
    const result = addToCart(product, 1);
    if (!result.success) {
      showToast(result.message, "warning");
      return;
    }
    showToast(result.message, "success");
    if (typeof openCheckout === "function") openCheckout();
  }
}