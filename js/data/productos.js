const CATEGORIAS = [
  { id: "pisos", nombre: "Pisos y superficies" },
  { id: "cocina", nombre: "Cocina" },
  { id: "bano", nombre: "Baño" },
  { id: "desinfeccion", nombre: "Desinfección y aromas" }
];

const PRODUCTOS = [
  { id: 1, nombre: "Limpiador de pisos lavanda 1L", precio: 3.5, categoria: "pisos", descripcion: "Limpiador perfumado para pisos y superficies lavables.", destacado: true, stock: 12, imagen: "" },
  { id: 2, nombre: "Detergente multiusos 1L", precio: 2.99, categoria: "pisos", descripcion: "Detergente versátil para limpieza general del hogar.", destacado: true, stock: 10, imagen: "" },
  { id: 3, nombre: "Cera líquida para pisos", precio: 4.25, categoria: "pisos", descripcion: "Brillo y protección para pisos delicados.", destacado: false, stock: 8, imagen: "" },
  { id: 4, nombre: "Paño de microfibra premium", precio: 1.8, categoria: "pisos", descripcion: "Paño absorbente ideal para superficies y vidrios.", destacado: true, stock: 15, imagen: "" },
  { id: 5, nombre: "Escoba de cerdas suaves", precio: 5.2, categoria: "pisos", descripcion: "Escoba resistente para limpieza diaria.", destacado: false, stock: 6, imagen: "" },

  { id: 6, nombre: "Lavavajillas líquido limón 1L", precio: 3.1, categoria: "cocina", descripcion: "Elimina grasa con aroma fresco a limón.", destacado: true, stock: 14, imagen: "" },
  { id: 7, nombre: "Desengrasante de cocina 500ml", precio: 3.9, categoria: "cocina", descripcion: "Fórmula potente para grasa difícil.", destacado: true, stock: 9, imagen: "" },
  { id: 8, nombre: "Limpiador para horno y parrillas", precio: 4.6, categoria: "cocina", descripcion: "Remueve residuos quemados y grasa pegada.", destacado: false, stock: 7, imagen: "" },
  { id: 9, nombre: "Esponja multiusos paquete x3", precio: 2.2, categoria: "cocina", descripcion: "Esponjas duraderas para cocina y baño.", destacado: true, stock: 20, imagen: "" },
  { id: 10, nombre: "Limpiador antibacterial de superficies", precio: 3.75, categoria: "cocina", descripcion: "Limpia y desinfecta mesones y superficies.", destacado: false, stock: 11, imagen: "" },

  { id: 11, nombre: "Gel desinfectante para inodoro", precio: 3.2, categoria: "bano", descripcion: "Gel espumoso que limpia y desinfecta.", destacado: true, stock: 10, imagen: "" },
  { id: 12, nombre: "Limpiador antical para baño", precio: 3.85, categoria: "bano", descripcion: "Elimina sarro y manchas de agua.", destacado: true, stock: 8, imagen: "" },
  { id: 13, nombre: "Limpiavidrios con alcohol", precio: 2.95, categoria: "bano", descripcion: "Brillo sin rayas para vidrios y espejos.", destacado: true, stock: 13, imagen: "" },
  { id: 14, nombre: "Cepillo para baño con base", precio: 4.1, categoria: "bano", descripcion: "Cepillo higiénico con base incluida.", destacado: false, stock: 5, imagen: "" },
  { id: 15, nombre: "Desinfectante de baño en aerosol", precio: 4.4, categoria: "bano", descripcion: "Desinfección rápida en spray.", destacado: false, stock: 9, imagen: "" },

  { id: 16, nombre: "Alcohol isopropílico 1L", precio: 3.6, categoria: "desinfeccion", descripcion: "Ideal para desinfección de superficies.", destacado: true, stock: 18, imagen: "" },
  { id: 17, nombre: "Cloro concentrado 1L", precio: 2.5, categoria: "desinfeccion", descripcion: "Desinfectante poderoso para limpieza profunda.", destacado: true, stock: 16, imagen: "" },
  { id: 18, nombre: "Desinfectante en aerosol", precio: 4.7, categoria: "desinfeccion", descripcion: "Elimina gérmenes en superficies y ambientes.", destacado: false, stock: 10, imagen: "" },
  { id: 19, nombre: "Ambientador spray floral", precio: 3.3, categoria: "desinfeccion", descripcion: "Aroma fresco y duradero para espacios.", destacado: true, stock: 12, imagen: "" },
  { id: 20, nombre: "Guantes de látex multiuso", precio: 2.8, categoria: "desinfeccion", descripcion: "Protección para tareas de limpieza.", destacado: false, stock: 14, imagen: "" }
];