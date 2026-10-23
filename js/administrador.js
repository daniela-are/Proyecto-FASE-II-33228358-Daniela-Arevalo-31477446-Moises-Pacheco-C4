(function () {
  const session = getCurrentSession();

  if (!session || session.rol !== "administrador") {
    showToast("Solo los administradores pueden acceder al panel de gestión.");
    window.location.href = "../index.html";
    return;
  }

  cargarPublicadosEnCatalogo();

  document.getElementById("admin-nombre").textContent =
    session.nombre + " " + session.apellido;
  document.getElementById("admin-nickname").textContent = "@" + session.nickname;
  document.getElementById("admin-avatar").textContent =
    session.nombre.charAt(0).toUpperCase();

  document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
    clearSession();
    showToast("Sesión cerrada correctamente.", "info");
    window.location.href = "../index.html";
  });

  const CLAVE_CARRITO_PREFIJO = "binaryshop_cart_";

  /* ---------- Pestañas ---------- */
  const tabs = document.querySelectorAll(".vendedor-tab");

  function activarTab(nombre) {
    tabs.forEach((t) => t.classList.toggle("activa", t.dataset.tab === nombre));
    document.querySelectorAll(".vendedor-panel").forEach((p) => p.classList.remove("activa"));
    document.getElementById("panel-" + nombre).classList.add("activa");
    if (nombre === "resumen") renderResumen();
    if (nombre === "usuarios") renderUsuarios();
    if (nombre === "productos") renderProductos();
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => activarTab(tab.dataset.tab)));

  /* ---------- Helpers ---------- */
  function esPredefinido(user) {
    return user.predefinido === true ||
      USUARIOS_PREDEFINIDOS.some((u) => u.nickname === user.nickname);
  }

  function limpiarCarritosDeProducto(productId) {
    Object.keys(localStorage)
      .filter((clave) => clave.startsWith(CLAVE_CARRITO_PREFIJO))
      .forEach((clave) => {
        try {
          const items = JSON.parse(localStorage.getItem(clave)) || [];
          const filtrados = items.filter((item) => String(item.id) !== String(productId));
          if (filtrados.length !== items.length) {
            localStorage.setItem(clave, JSON.stringify(filtrados));
          }
        } catch (error) {
          /* clave dañada: se ignora */
        }
      });
  }

  /* ---------- Pestaña Resumen ---------- */
  function renderResumen() {
    const contenedor = document.getElementById("admin-metricas");
    const usuarios = getAllUsers();
    const registrados = getStoredUsers().length;
    const compradores = usuarios.filter((u) => u.rol === "comprador").length;
    const vendedores = usuarios.filter((u) => u.rol === "vendedor").length;
    const publicados = getPublicados().length;
    const ordenes = getOrdenes();
    const ventas = ordenes.reduce((total, orden) => total + orden.total, 0);

    contenedor.innerHTML = `
      <div class="admin-metrica">
        <span>Usuarios totales</span>
        <strong>${usuarios.length}</strong>
        <small>${registrados} registrados</small>
      </div>
      <div class="admin-metrica"><span>Compradores</span><strong>${compradores}</strong></div>
      <div class="admin-metrica"><span>Vendedores</span><strong>${vendedores}</strong></div>
      <div class="admin-metrica"><span>Productos publicados</span><strong>${publicados}</strong></div>
      <div class="admin-metrica"><span>Órdenes procesadas</span><strong>${ordenes.length}</strong></div>
      <div class="admin-metrica"><span>Ventas de la tienda</span><strong>${formatPrice(ventas)}</strong></div>
    `;
  }

  /* ---------- Pestaña Usuarios ---------- */
  function renderUsuarios() {
    const contenedor = document.getElementById("admin-usuarios-lista");
    const filtro = document.getElementById("admin-filtro-rol").value;

    let usuarios = getAllUsers();
    if (filtro !== "todos") {
      usuarios = usuarios.filter((u) => u.rol === filtro);
    }

    contenedor.innerHTML = "";

    if (usuarios.length === 0) {
      contenedor.innerHTML = '<p class="mis-productos-vacio">No hay usuarios para este filtro.</p>';
      return;
    }

    usuarios.forEach((user) => {
      const esSesionActual = user.nickname === session.nickname;
      const protegido = esPredefinido(user) || esSesionActual;

      const fila = document.createElement("article");
      fila.className = "admin-usuario-item";
      fila.innerHTML = `
        <div class="admin-usuario-datos">
          <strong>@${escapeHtml(user.nickname)}</strong>
          <span>${escapeHtml(user.nombre)} ${escapeHtml(user.apellido)}</span>
          <span class="role-badge role-${escapeHtml(user.rol)}">${escapeHtml(user.rol)}</span>
          <span class="origen-badge ${esPredefinido(user) ? "origen-predefinida" : "origen-registrada"}">
            ${esPredefinido(user) ? "Predefinida" : "Registrada"}
          </span>
        </div>
        <div class="admin-usuario-acciones">
          ${protegido
            ? `<span class="admin-protegido">${esSesionActual ? "Tu cuenta" : "Protegida"}</span>`
            : `<button class="btn btn-danger" data-accion="eliminar-usuario" data-nickname="${escapeHtml(user.nickname)}">Eliminar</button>`}
        </div>
      `;
      contenedor.appendChild(fila);
    });
  }

  document.getElementById("admin-filtro-rol").addEventListener("change", renderUsuarios);

  /* ---------- Pestaña Productos publicados ---------- */
  function renderProductos() {
    const contenedor = document.getElementById("admin-productos-lista");
    const productos = getPublicados();

    contenedor.innerHTML = "";

    if (productos.length === 0) {
      contenedor.innerHTML =
        '<p class="mis-productos-vacio">No hay productos publicados por vendedores.</p>';
      return;
    }

    productos.forEach((producto) => {
      const fila = document.createElement("article");
      fila.className = "admin-producto-item";
      fila.innerHTML = `
        <div class="mis-productos-imagen">
          <img src="${producto.imagen}" alt="${escapeHtml(producto.nombre)}">
        </div>
        <div class="admin-producto-datos">
          <strong>${escapeHtml(producto.nombre)}</strong>
          <span class="mis-productos-categoria">${escapeHtml(producto.categoria)}</span>
          <span>Vendedor: @${escapeHtml(producto.vendedor)}</span>
          <span>${formatPrice(producto.precio)} · Stock: ${producto.stock}</span>
        </div>
        <div class="admin-producto-acciones">
          <button class="btn btn-danger" data-accion="eliminar-producto" data-id="${producto.id}">Eliminar</button>
        </div>
      `;
      contenedor.appendChild(fila);
    });
  }

  /* ---------- Eliminación de cuentas ---------- */
  function eliminarUsuario(nickname) {
    const user = findUserByNickname(nickname);
    if (!user) return;
    if (esPredefinido(user) || nickname === session.nickname) return;

    const publicadosDelVendedor = user.rol === "vendedor"
      ? getPublicadosDeVendedor(nickname)
      : [];

    const avisoProductos = publicadosDelVendedor.length > 0
      ? ` Se eliminarán también sus ${publicadosDelVendedor.length} productos publicados.`
      : "";

    if (!confirm(`¿Seguro que deseas eliminar la cuenta "@${nickname}" (${user.rol})?${avisoProductos}`)) {
      return;
    }

    if (publicadosDelVendedor.length > 0) {
      guardarPublicados(getPublicados().filter((p) => p.vendedor !== nickname));
      publicadosDelVendedor.forEach((producto) => {
        limpiarCarritosDeProducto(producto.id);
        const indice = PRODUCTOS.findIndex((p) => p.id === producto.id);
        if (indice !== -1) PRODUCTOS.splice(indice, 1);
      });
    }

    saveStoredUsers(getStoredUsers().filter((u) => u.nickname !== nickname));

    showToast(`Cuenta "@${nickname}" eliminada correctamente.`, "success");
    renderResumen();
    renderUsuarios();
    renderProductos();
  }

  /* ---------- Remoción de publicaciones ---------- */
  function eliminarProducto(id) {
    const producto = getPublicadoPorId(id);
    if (!producto) return;

    if (!confirm(
      `¿Seguro que deseas remover la publicación "${producto.nombre}" de @${producto.vendedor}? También se quitará de los carritos que lo contengan.`
    )) {
      return;
    }

    eliminarProductoPublicado(id);
    limpiarCarritosDeProducto(id);

    const indice = PRODUCTOS.findIndex((p) => p.id === id);
    if (indice !== -1) PRODUCTOS.splice(indice, 1);

    showToast(`Publicación "${producto.nombre}" removida.`, "success");
    renderResumen();
    renderProductos();
  }

  /* ---------- Listeners de acciones ---------- */
  document.getElementById("admin-usuarios-lista").addEventListener("click", (event) => {
    const boton = event.target.closest("button[data-accion='eliminar-usuario']");
    if (!boton) return;
    eliminarUsuario(boton.dataset.nickname);
  });

  document.getElementById("admin-productos-lista").addEventListener("click", (event) => {
    const boton = event.target.closest("button[data-accion='eliminar-producto']");
    if (!boton) return;
    eliminarProducto(boton.dataset.id);
  });

  /* ---------- Init ---------- */
  renderResumen();
})();