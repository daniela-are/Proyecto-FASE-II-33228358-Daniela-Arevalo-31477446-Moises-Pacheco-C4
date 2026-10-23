const CLAVE_PRODUCTOS_PUBLICADOS = "binaryshop_products";
const CLAVE_ORDENES = "binaryshop_orders";
const VENDEDOR_TIENDA = "BinaryShop";

/* ---------- Productos publicados ---------- */

function getPublicados() {
  try {
    const raw = localStorage.getItem(CLAVE_PRODUCTOS_PUBLICADOS);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function guardarPublicados(lista) {
  localStorage.setItem(CLAVE_PRODUCTOS_PUBLICADOS, JSON.stringify(lista));
}

function getPublicadoPorId(id) {
  return getPublicados().find((p) => p.id === id) || null;
}

function getPublicadosDeVendedor(nickname) {
  return getPublicados().filter((p) => p.vendedor === nickname);
}

function crearProductoPublicado(datos) {
  const lista = getPublicados();
  const producto = {
    id: "pub-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    precio: datos.precio,
    categoria: datos.categoria,
    stock: datos.stock,
    imagen: datos.imagen,
    vendedor: datos.vendedor,
    destacado: false,
    publicadoEl: new Date().toISOString()
  };
  lista.push(producto);
  guardarPublicados(lista);
  return producto;
}

function actualizarProductoPublicado(id, cambios) {
  const lista = getPublicados();
  const producto = lista.find((p) => p.id === id);
  if (!producto) return null;
  Object.assign(producto, cambios);
  guardarPublicados(lista);
  return producto;
}

function eliminarProductoPublicado(id) {
  guardarPublicados(getPublicados().filter((p) => p.id !== id));
}

/* ---------- Combinar con el catálogo oficial ---------- */

function cargarPublicadosEnCatalogo() {
  getPublicados().forEach((producto) => {
    const existe = PRODUCTOS.some((p) => p.id === producto.id);
    if (!existe) PRODUCTOS.push(producto);
  });
}

/* ---------- Categorías activas (oficiales + dinámicas) ---------- */

function getCategoriasActivas() {
  const categorias = CATEGORIAS.map((c) => ({ id: c.id, nombre: c.nombre }));

  PRODUCTOS.forEach((producto) => {
    const yaEsta = categorias.some((c) => c.id === producto.categoria);
    if (!yaEsta) {
      categorias.push({ id: producto.categoria, nombre: producto.categoria });
    }
  });

  return categorias;
}

/* ---------- Órdenes ---------- */

function getOrdenes() {
  try {
    const raw = localStorage.getItem(CLAVE_ORDENES);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function guardarOrdenes(lista) {
  localStorage.setItem(CLAVE_ORDENES, JSON.stringify(lista));
}

function registrarOrden(datos) {
  const lista = getOrdenes();
  const orden = {
    id: "ord-" + Date.now(),
    fecha: new Date().toISOString(),
    comprador: datos.comprador,
    items: datos.items,
    total: datos.total
  };
  lista.push(orden);
  guardarOrdenes(lista);
  return orden;
}

function getOrdenesDeVendedor(nickname) {
  return getOrdenes().filter((orden) =>
    orden.items.some((item) => item.vendedor === nickname)
  );
}

function getOrdenesDeComprador(nickname) {
  return getOrdenes().filter((orden) => orden.comprador === nickname);
}