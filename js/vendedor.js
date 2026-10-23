(function () {
  const session = getCurrentSession();

  if (!session || session.rol !== "vendedor") {
    showToast("Solo los vendedores pueden acceder al panel de ventas.");
    window.location.href = "../index.html";
    return;
  }

  cargarPublicadosEnCatalogo();

  document.getElementById("vendedor-nombre").textContent =
    session.nombre + " " + session.apellido;
  document.getElementById("vendedor-nickname").textContent = "@" + session.nickname;
  document.getElementById("vendedor-avatar").textContent =
    session.nombre.charAt(0).toUpperCase();

  document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
    clearSession();
    showToast("Sesión cerrada correctamente.", "info");
    window.location.href = "../index.html";
  });

  /* ---------- Pestañas ---------- */
  const tabs = document.querySelectorAll(".vendedor-tab");

  function activarTab(nombre) {
    tabs.forEach((t) => t.classList.toggle("activa", t.dataset.tab === nombre));
    document.querySelectorAll(".vendedor-panel").forEach((p) => p.classList.remove("activa"));
    document.getElementById("panel-" + nombre).classList.add("activa");
    if (nombre === "mis-productos") renderMisProductos();
    if (nombre === "historial") renderHistorial();
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => activarTab(tab.dataset.tab)));

  /* ---------- Categorías del select ---------- */
  const selectCategoria = document.getElementById("pub-categoria");
  const labelNuevaCategoria = document.getElementById("label-nueva-categoria");
  const inputNuevaCategoria = document.getElementById("pub-nueva-categoria");

  function llenarCategorias() {
    selectCategoria.innerHTML = "";
    getCategoriasActivas().forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria.id;
      option.textContent = categoria.nombre;
      selectCategoria.appendChild(option);
    });
    const optionNueva = document.createElement("option");
    optionNueva.value = "__nueva__";
    optionNueva.textContent = "Nueva categoría...";
    selectCategoria.appendChild(optionNueva);
  }
  llenarCategorias();

  selectCategoria.addEventListener("change", () => {
    const esNueva = selectCategoria.value === "__nueva__";
    labelNuevaCategoria.classList.toggle("oculto", !esNueva);
    inputNuevaCategoria.required = esNueva;
    if (!esNueva) inputNuevaCategoria.value = "";
  });

  /* ---------- Imagen (preview + validación) ---------- */
  const inputImagen = document.getElementById("pub-imagen");
  const preview = document.getElementById("pub-imagen-preview");
  const mensaje = document.getElementById("pub-mensaje");
  let imagenBase64 = null;

  inputImagen.addEventListener("change", () => {
    mensaje.textContent = "";
    preview.classList.add("oculto");
    preview.innerHTML = "";
    const archivo = inputImagen.files[0];
    if (!archivo) { imagenBase64 = null; return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(archivo.type)) {
      mensaje.textContent = "Formato inválido. Usa jpg, png o webp.";
      inputImagen.value = ""; imagenBase64 = null; return;
    }
    if (archivo.size > 1.5 * 1024 * 1024) {
      mensaje.textContent = "La imagen supera 1.5 MB. Elige una más liviana.";
      inputImagen.value = ""; imagenBase64 = null; return;
    }
    const reader = new FileReader();
    reader.onload = (evento) => {
      imagenBase64 = evento.target.result;
      preview.innerHTML = `<img src="${imagenBase64}" alt="Vista previa">`;
      preview.classList.remove("oculto");
    };
    reader.readAsDataURL(archivo);
  });

  /* ---------- Reset del formulario ---------- */
  function resetForm() {
    document.getElementById("form-publicar").reset();
    document.getElementById("pub-edit-id").value = "";
    document.getElementById("form-publicar-titulo").textContent = "Publicar producto";
    document.getElementById("form-publicar-boton").textContent = "Publicar producto";
    document.getElementById("btn-cancelar-edicion").classList.add("oculto");
    inputImagen.required = true;
    imagenBase64 = null;
    preview.classList.add("oculto");
    preview.innerHTML = "";
    mensaje.textContent = "";
    labelNuevaCategoria.classList.add("oculto");
    inputNuevaCategoria.required = false;
    llenarCategorias();
  }

  document.getElementById("btn-cancelar-edicion").addEventListener("click", resetForm);

  /* ---------- Publicar / Guardar cambios ---------- */
  document.getElementById("form-publicar").addEventListener("submit", (evento) => {
    evento.preventDefault();
    mensaje.textContent = "";

    if (!imagenBase64) {
      mensaje.textContent = "Debes subir una imagen válida del producto.";
      return;
    }

    let categoria = selectCategoria.value;
    if (categoria === "__nueva__") {
      categoria = inputNuevaCategoria.value.trim();
      if (!categoria) {
        mensaje.textContent = "Escribe el nombre de la nueva categoría.";
        return;
      }
    }

    const nombre = document.getElementById("pub-nombre").value.trim();
    const descripcion = document.getElementById("pub-descripcion").value.trim();
    const precio = parseFloat(document.getElementById("pub-precio").value);
    const stock = parseInt(document.getElementById("pub-stock").value, 10);

    if (!nombre || !descripcion || isNaN(precio) || precio <= 0 || isNaN(stock) || stock < 1) {
      mensaje.textContent = "Completa todos los campos con valores válidos.";
      return;
    }

    const datos = {
      nombre, descripcion, precio, categoria, stock,
      imagen: imagenBase64
    };
    const editId = document.getElementById("pub-edit-id").value;

    if (editId) {
      actualizarProductoPublicado(editId, datos);
      const enCatalogo = PRODUCTOS.find((p) => p.id === editId);
      if (enCatalogo) Object.assign(enCatalogo, datos);
      mensaje.textContent = "Cambios guardados con éxito.";
      showToast("Producto actualizado correctamente.", "success");
    } else {
      datos.vendedor = session.nickname;
      const nuevo = crearProductoPublicado(datos);
      PRODUCTOS.push(nuevo);
      mensaje.textContent = "Producto publicado con éxito.";
      showToast("Producto publicado correctamente.", "success");
    }

    resetForm();
    llenarCategorias();
  });

  /* ---------- Mis productos ---------- */
  function renderMisProductos() {
    const contenedor = document.getElementById("mis-productos-lista");
    const productos = getPublicadosDeVendedor(session.nickname);
    contenedor.innerHTML = "";
    if (productos.length === 0) {
      contenedor.innerHTML =
        '<p class="mis-productos-vacio">Aún no has publicado productos.</p>';
      return;
    }
    productos.forEach((producto) => {
      const tarjeta = document.createElement("article");
      tarjeta.className = "mis-productos-item";
      tarjeta.innerHTML = `
        <div class="mis-productos-imagen">
          <img src="${producto.imagen}" alt="${escapeHtml(producto.nombre)}">
        </div>
        <div class="mis-productos-datos">
          <h3>${escapeHtml(producto.nombre)}</h3>
          <p class="mis-productos-categoria">${escapeHtml(producto.categoria)}</p>
          <p class="mis-productos-precio">
            ${formatPrice(producto.precio)} · Stock: ${producto.stock}
          </p>
        </div>
        <div class="mis-productos-acciones">
          <button class="btn btn-secondary" data-accion="editar" data-id="${producto.id}">Editar</button>
          <button class="btn btn-danger" data-accion="eliminar" data-id="${producto.id}">Eliminar</button>
        </div>
      `;
      contenedor.appendChild(tarjeta);
    });
  }

  document.getElementById("mis-productos-lista").addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;
    const id = boton.dataset.id;
    const producto = getPublicadoPorId(id);
    if (!producto) return;

    if (boton.dataset.accion === "eliminar") {
      if (confirm(`¿Seguro que deseas eliminar "${producto.nombre}"?`)) {
        eliminarProductoPublicado(id);
        const indice = PRODUCTOS.findIndex((p) => p.id === id);
        if (indice !== -1) PRODUCTOS.splice(indice, 1);
        renderMisProductos();
        showToast("Producto eliminado.", "info");
      }
    } else if (boton.dataset.accion === "editar") {
      document.getElementById("pub-edit-id").value = producto.id;
      document.getElementById("pub-nombre").value = producto.nombre;
      document.getElementById("pub-descripcion").value = producto.descripcion;
      document.getElementById("pub-precio").value = producto.precio;
      document.getElementById("pub-stock").value = producto.stock;
      llenarCategorias();
      selectCategoria.value = producto.categoria;
      imagenBase64 = producto.imagen;
      preview.innerHTML = `<img src="${imagenBase64}" alt="Vista previa">`;
      preview.classList.remove("oculto");
      inputImagen.required = false;
      document.getElementById("form-publicar-titulo").textContent = "Editar producto";
      document.getElementById("form-publicar-boton").textContent = "Guardar cambios";
      document.getElementById("btn-cancelar-edicion").classList.remove("oculto");
      activarTab("publicar");
    }
  });

  /* ---------- Historial de ventas ---------- */
  function renderHistorial() {
    const resumen = document.getElementById("historial-resumen");
    const lista = document.getElementById("historial-lista");
    const ordenes = getOrdenesDeVendedor(session.nickname);

    let ingresos = 0;
    let unidades = 0;
    ordenes.forEach((orden) => {
      orden.items.forEach((item) => {
        if (item.vendedor === session.nickname) {
          ingresos += item.precio * item.cantidad;
          unidades += item.cantidad;
        }
      });
    });

    resumen.innerHTML = `
      <div class="historial-resumen-item">
        <span>Ingresos totales</span>
        <strong>${formatPrice(ingresos)}</strong>
      </div>
      <div class="historial-resumen-item">
        <span>Unidades vendidas</span>
        <strong>${unidades}</strong>
      </div>
      <div class="historial-resumen-item">
        <span>Órdenes con ventas tuyas</span>
        <strong>${ordenes.length}</strong>
      </div>
    `;

    lista.innerHTML = "";
    if (ordenes.length === 0) {
      lista.innerHTML =
        '<p class="historial-vacio">Aún no tienes ventas registradas.</p>';
      return;
    }

    ordenes.slice().reverse().forEach((orden) => {
      const fecha = new Date(orden.fecha);
      let filas = "";
      orden.items.forEach((item) => {
        if (item.vendedor === session.nickname) {
          filas += `
            <tr>
              <td>${escapeHtml(item.nombre)}</td>
              <td>${item.cantidad}</td>
              <td>${formatPrice(item.precio)}</td>
              <td>${formatPrice(item.precio * item.cantidad)}</td>
            </tr>
          `;
        }
      });
      const tarjeta = document.createElement("article");
      tarjeta.className = "historial-item";
      tarjeta.innerHTML = `
        <header class="historial-item-header">
          <span>${escapeHtml(orden.id)}</span>
          <span>${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}</span>
        </header>
        <table class="historial-tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>P. unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      `;
      lista.appendChild(tarjeta);
    });
  }

  /* ---------- Detección de hash para abrir pestaña directa ---------- */

    /* ---------- Cambio de hash al cambiar de pestaña ---------- */
  window.addEventListener("hashchange", () => {
    const nuevoHash = window.location.hash.replace("#", "");
    if (tabsValidas.includes(nuevoHash)) {
      activarTab(nuevoHash);
    }
  });

  const hash = window.location.hash.replace("#", "");
  const tabsValidas = ["publicar", "mis-productos", "historial"];

  if (tabsValidas.includes(hash)) {
    activarTab(hash);
  }
})();