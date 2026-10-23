const CATEGORIAS = [
  { id: "ropa", nombre: "Ropa y Lavandería" },
  { id: "cocina", nombre: "Cocina" },
  { id: "bano", nombre: "Baño y Desinfección" },
  { id: "vidrios", nombre: "Vidrios y Multiusos" },
  { id: "accesorios", nombre: "Accesorios y Dosificadores" }
];

const PRODUCTOS = [
  // ============ ROPA Y LAVANDERÍA ============
  {
    id: 1,
    nombre: "Detergente En Polvo Concentrado para Ropa",
    precio: 21.00,
    categoria: "ropa",
    descripcion: "Disuelve mugre, manchas difíciles y grasa en todo tipo de telas lavables, manteniendo los blancos deslumbrantes y los colores brillantes.",
    caracteristicas: [
      "Disuelve rápidamente la mugre, las manchas difíciles y la grasa en todo tipo de telas lavables.",
      "Mantiene los blancos deslumbrantes y los colores brillantes lavada tras lavada.",
      "Formulado con cristales de disolución rápida que no dejan residuos blancos en las prendas.",
      "Ataca manchas orgánicas como sangre, hierba, salsa o sudor.",
      "Evita que las partes metálicas de la ropa o de la lavadora se oxiden.",
      "Probado por dermatólogos, apto para pieles sensibles."
    ],
    advertencia: "Evitar verter cerca del rostro para evitar irritaciones en los ojos o inhalar directamente el polvillo fino.",
    destacado: true,
    stock: 12,
    imagen: "js/data/images/producto-01.jpeg"
  },
  {
    id: 2,
    nombre: "Detergente Líquido Concentrado para Ropa",
    precio: 25.00,
    categoria: "ropa",
    descripcion: "Se disuelve al instante incluso en agua fría y penetra las fibras para remover manchas pesadas sin desgastar las prendas ni alterar sus colores.",
    caracteristicas: [
      "Formulado para disolverse al instante, incluso en agua fría.",
      "Penetra en las fibras para remover mugre y manchas pesadas sin desgastar las prendas ni alterar sus tonos originales.",
      "No deja residuos blancos en la ropa.",
      "Mantiene la elasticidad y suavidad de las telas.",
      "Biodegradable y seguro para fosas sépticas."
    ],
    advertencia: "En caso de contacto con los ojos, lavar con abundante agua durante 15 minutos. No aplicar sin diluir sobre prendas delicadas de seda o lana sin prueba previa de color.",
    destacado: true,
    stock: 10,
    imagen: "js/data/images/producto-02.jpeg"
  },
  {
    id: 3,
    nombre: "Blanqueador para Todo Tipo de Telas",
    precio: 19.00,
    categoria: "ropa",
    descripcion: "Blanqueador concentrado con oxígeno activo (sin cloro) que elimina manchas de café, vino o té sin debilitar las fibras ni desgastar los colores.",
    caracteristicas: [
      "Blanqueador concentrado a base de oxígeno activo (sin cloro).",
      "Elimina manchas difíciles como café, vino, té o jugo sin debilitar las fibras de las prendas ni desgastar los colores.",
      "Sin cloro, apto y seguro para prendas de color y blancas (excepto lana y seda).",
      "Se puede usar para limpiar y desinfectar teteras, tazas con manchas de café o té, o azulejos.",
      "Elimina bacterias causantes del mal olor en la ropa deportiva o toallas."
    ],
    advertencia: "No usar en lana, seda ni prendas con acabados metálicos. No mezclar nunca con blanqueadores a base de cloro: neutraliza su efecto y libera gases irritantes.",
    destacado: false,
    stock: 8,
    imagen: "js/data/images/producto-03.jpeg"
  },
  {
    id: 4,
    nombre: "Aerosol Quitamanchas",
    precio: 13.00,
    categoria: "ropa",
    descripcion: "Spray de prelavado que disuelve manchas difíciles sin frotar ni remojar. Ideal para puños, cuellos y zonas de rozadura constante.",
    caracteristicas: [
      "Spray de tratamiento previo al lavado formulado para disolver manchas difíciles sin necesidad de frotar ni remojar.",
      "Ideal para puños, cuellos y zonas expuestas a rozadura constante.",
      "Remueve eficazmente aceite, grasa de cocina, tinta, lápiz labial y grasa corporal.",
      "Fácil aplicación en aerosol directamente sobre la zona afectada.",
      "Seguro para telas de color que no destiñan."
    ],
    advertencia: "Extremadamente inflamable: no rociar cerca de llamas abiertas, pilotos de estufas ni chispas.",
    destacado: false,
    stock: 9,
    imagen: "js/data/images/producto-04.jpeg"
  },
  {
    id: 5,
    nombre: "Suavizante Concentrado para Ropa",
    precio: 15.50,
    categoria: "ropa",
    descripcion: "Restaura la esponjosidad y suavidad de las prendas, reduce la estática, facilita el planchado y deja un aroma floral duradero.",
    caracteristicas: [
      "Suavizante formulado para restaurar la esponjosidad y suavidad de las prendas, reduce la estática y facilita el planchado.",
      "Derivado de ingredientes naturales que protegen las fibras.",
      "Minimiza el desgaste del tejido durante el ciclo de secado.",
      "Aroma floral duradero que perdura tras guardar la ropa."
    ],
    advertencia: "",
    destacado: true,
    stock: 14,
    imagen: "js/data/images/producto-05.jpg"
  },
  {
    id: 6,
    nombre: "Detergente Concentrado para Ropa de Bebé",
    precio: 22.00,
    categoria: "ropa",
    descripcion: "Detergente sin colorantes ni fragancias agresivas, probado pediátrica y dermatológicamente, ideal para piel sensible y propensa a alergias.",
    caracteristicas: [
      "Diseñado minuciosamente para limpiar la ropa de bebé y personas con piel extremadamente sensible o propensa a alergias.",
      "Formulado sin colorantes ni fragancias agresivas.",
      "Probado pediátricamente y dermatológicamente.",
      "Elimina manchas difíciles biológicas como leche, fórmula y residuos orgánicos."
    ],
    advertencia: "Aunque es súper suave con la piel sensible, no deja de ser un detergente concentrado: mantener fuera del alcance de niños pequeños.",
    destacado: false,
    stock: 7,
    imagen: "js/data/images/producto-06.jpg"
  },

  // ============ COCINA ============
  {
    id: 7,
    nombre: "Lavaplatos Líquido Concentrado",
    precio: 16.50,
    categoria: "cocina",
    descripcion: "Arranca la grasa pegada y restos de comida quemada con pocas gotas, creando espuma duradera y cuidando la piel de las manos.",
    caracteristicas: [
      "Arranca la grasa pegada y los restos de comida quemada con solo unas cuantas gotas.",
      "Crea una espuma abundante y duradera, dejando vajillas, cristalería y sartenes impecables y relucientes.",
      "Contiene extractos de aloe vera y alfa-hidroxiácidos que cuidan y suavizan la piel de las manos durante el lavado.",
      "Elimina los malos olores fuertes (pescado, huevo, ajo) de la vajilla y utensilios."
    ],
    advertencia: "Se recomienda diluir el líquido siempre con agua en la proporción sugerida antes de usarlo.",
    destacado: true,
    stock: 16,
    imagen: "js/data/images/producto-07.jpg"
  },
  {
    id: 8,
    nombre: "Pastillas Detergente para Fregadero",
    precio: 18.00,
    categoria: "cocina",
    descripcion: "Pastillas 'todo en uno' que cortan la grasa, disuelven restos endurecidos y dejan la cristalería brillante sin marcas de agua dura.",
    caracteristicas: [
      "Otorgan una limpieza profunda que corta la grasa, disuelve restos endurecidos y deja la cristalería brillante.",
      "Fórmula 'todo en uno' que incluye función de aclarado y sal.",
      "Previene la acumulación de marcas de agua dura en vasos y copas.",
      "Empaque biodisoluble que no requiere abrirse manualmente."
    ],
    advertencia: "",
    destacado: true,
    stock: 10,
    imagen: "js/data/images/producto-08.jpg"
  },
  {
    id: 9,
    nombre: "Limpiador Concentrado para Cocina",
    precio: 10.50,
    categoria: "cocina",
    descripcion: "Desengrasante de acción rápida para estufas, campanas, encimeras y azulejos, con aroma cítrico y sin rastros pegajosos.",
    caracteristicas: [
      "Limpiador desengrasante diseñado para disolver acumulaciones de aceite, manteca y hollín en estufas, campanas extractoras, encimeras y azulejos.",
      "Acción rápida sin dejar rastros pegajosos.",
      "Deja un aroma cítrico refrescante.",
      "No requiere enjuague intensivo."
    ],
    advertencia: "No utilizar sobre madera no tratada ni piedra natural sin sellar (mármol o granito poroso) sin prueba previa en un área pequeña.",
    destacado: true,
    stock: 12,
    imagen: "js/data/images/producto-09.jpg"
  },
  {
    id: 10,
    nombre: "Limpiador para Acero Inoxidable y Cobre",
    precio: 14.00,
    categoria: "cocina",
    descripcion: "Crema pulidora que restaura el brillo original del acero inoxidable, cobre y bronce sin rayar las superficies metálicas.",
    caracteristicas: [
      "Crema limpiadora y pulidora que restaura el brillo original de vajillas, ollas de acero inoxidable, sartenes y piezas de cobre o bronce.",
      "Remueve la decoloración por calor y manchas de oxidación.",
      "Fórmula suave que no raya las superficies metálicas pulidas.",
      "Devuelve el acabado brillante e higiénico."
    ],
    advertencia: "No apto para superficies de acero inoxidable espejado o con acabados 'antihuella' que tengan recubrimientos sintéticos o plásticos.",
    destacado: false,
    stock: 8,
    imagen: "js/data/images/producto-10.jpg"
  },
  {
    id: 11,
    nombre: "Esponjas de Acero Inoxidable",
    precio: 12.00,
    categoria: "cocina",
    descripcion: "Almohadillas de acero inoxidable que remueven comida quemada, grasa incrustada y óxido sin deshilarse ni dejar astillas.",
    caracteristicas: [
      "Almohadillas de alambre de acero inoxidable de alta calidad.",
      "No se deshila ni deja astillas en las manos.",
      "Remueve comida quemada, grasa incrustada y óxido de ollas, sartenes y parrillas.",
      "No raya el acero ni superficies aptas para metal.",
      "Apta para lavar en lavaplatos para su desinfección y reutilización."
    ],
    advertencia: "No usar en sartenes u ollas con recubrimiento antiadherente (teflón), superficies plásticas pulidas ni cristalería fina decorada con oro o plata.",
    destacado: false,
    stock: 15,
    imagen: "js/data/images/producto-11.jpg"
  },

  // ============ BAÑO Y DESINFECCIÓN ============
  {
    id: 12,
    nombre: "Limpiador para Inodoros",
    precio: 11.00,
    categoria: "bano",
    descripcion: "Gel antisarro con cuello direccional que disuelve sedimentos minerales, desinfecta y elimina olores sin estropear las tuberías.",
    caracteristicas: [
      "Formulado para disolver la acumulación de sarro, manchas de agua dura y sedimentos minerales debajo del borde de la taza.",
      "Textura en gel que se adhiere a las paredes para mayor eficacia.",
      "Cuello direccional para alcanzar las zonas ocultas del inodoro.",
      "Elimina olores desagradables y desinfecta.",
      "No estropea las tuberías internas."
    ],
    advertencia: "Evite el contacto con la piel y los ojos durante su uso y aplicación.",
    destacado: true,
    stock: 11,
    imagen: "js/data/images/producto-12.jpg"
  },
  {
    id: 13,
    nombre: "Limpiador Concentrado para Baños",
    precio: 10.50,
    categoria: "bano",
    descripcion: "Solución antisarro para lavamanos, duchas y griferías que aporta brillo espejo y deja una capa protectora contra la suciedad futura.",
    caracteristicas: [
      "Solución antisarro diseñada para remover sedimentos minerales de agua dura, restos de jabón y opacidad en baños y griferías.",
      "Limpieza profunda en lavamanos, duchas, azulejos y tinas.",
      "Aporta un brillo espejo a grifos de cromo y acero inoxidable sin rayar.",
      "Deja una capa protectora que retrasa la acumulación futura de suciedad."
    ],
    advertencia: "Nunca usar en mármol, piedra caliza, travertino o terrazzo: los ácidos que disuelven el sarro erosionan y opacan permanentemente la piedra natural.",
    destacado: false,
    stock: 9,
    imagen: "js/data/images/producto-13.jpg"
  },
  {
    id: 14,
    nombre: "Limpiador Desinfectante Concentrado",
    precio: 15.00,
    categoria: "bano",
    descripcion: "Limpia, desinfecta y desodoriza en un solo paso; elimina virus, bacterias y hongos en superficies duras no porosas.",
    caracteristicas: [
      "Formulado para limpiar, desinfecta y desodorizar en un solo paso.",
      "Elimina virus, bacterias y hongos en superficies duras no porosas.",
      "Eficaz contra una amplia gama de microorganismos patógenos.",
      "Previene la aparición de moho en superficies expuestas a humedad como baños y duchas.",
      "Ideal para desinfectar mesones de cocina, picaportes, azulejos y sanitarios."
    ],
    advertencia: "En superficies en contacto directo con alimentos (tablas de picar, mesones), es obligatorio enjuagar con agua potable tras el tiempo de contacto desinfectante.",
    destacado: true,
    stock: 13,
    imagen: "js/data/images/producto-14.jpg"
  },

  // ============ VIDRIOS Y MULTIUSOS ============
  {
    id: 15,
    nombre: "Limpiador Concentrado para Vidrios",
    precio: 10.00,
    categoria: "vidrios",
    descripcion: "Elimina marcas de dedos, polvo y grasa de espejos y ventanas sin dejar vetas, con secado rápido y sin amoníaco.",
    caracteristicas: [
      "Limpiador de cristales que elimina marcas de dedos, polvo y grasa de espejos, ventanas y mamparas sin dejar vetas ni marcas de agua.",
      "Secado rápido sin empañamiento.",
      "Libre de amoníaco e ingredientes abrasivos.",
      "Seguro para usar en ventanas de autos con láminas de seguridad."
    ],
    advertencia: "No pulverizar directamente sobre pantallas de TV (OLED/LED), monitores, laptops o teléfonos: el líquido puede penetrar los bordes de la pantalla.",
    destacado: true,
    stock: 10,
    imagen: "js/data/images/producto-15.jpg"
  },
  {
    id: 16,
    nombre: "Toallitas Limpiadoras Multiusos",
    precio: 9.00,
    categoria: "vidrios",
    descripcion: "Toallitas biodegradables para limpiezas de emergencia en superficies, derrames y manos, con cierre hermético que conserva la humedad.",
    caracteristicas: [
      "Ideales para llevar en el auto, bolso o tener a mano en la oficina para limpiezas de emergencia.",
      "Tela resistente e impregnada con fórmula biodegradable.",
      "Perfectas para limpiar superficies, derrames accidentales y manos.",
      "Cierre hermético que conserva la humedad."
    ],
    advertencia: "",
    destacado: true,
    stock: 18,
    imagen: "js/data/images/producto-16.jpg"
  },

  // ============ ACCESORIOS Y DOSIFICADORES ============
  {
    id: 17,
    nombre: "Dosificador de Bomba (3 ml)",
    precio: 4.50,
    categoria: "accesorios",
    descripcion: "Dispensador de presión que entrega exactamente 3 ml por pulsación, con mecanismo antigoteo, para botellas de 1 litro.",
    caracteristicas: [
      "Dispensador de presión para acoplar directamente a las botellas de 1 litro de L.O.C. o Dish Drops.",
      "Entrega exactamente 3 ml por cada pulsación para evitar desperdicios.",
      "Mecanismo antigoteo."
    ],
    advertencia: "",
    destacado: true,
    stock: 20,
    imagen: "js/data/images/producto-17.jpg"
  },
  {
    id: 18,
    nombre: "Botella Oprimible para Lavaplatos",
    precio: 3.50,
    categoria: "accesorios",
    descripcion: "Envase flexible de 500 ml con tapa Flip-Top y marcadores de dilución para aplicar el lavaplatos líquido cómodamente.",
    caracteristicas: [
      "Envase flexible de 500 ml con tapa Flip-Top.",
      "Diseñada especialmente para diluir el lavaplatos líquido y aplicarlo cómodamente sobre la esponja o el lavaplatos.",
      "Marcadores claros para diluciones de rendimiento óptimo.",
      "Tapa de cierre antiderrames con válvula antiderrote."
    ],
    advertencia: "",
    destacado: false,
    stock: 12,
    imagen: "js/data/images/producto-18.jpg"
  },
  {
    id: 19,
    nombre: "Botella Rociadora con Pistola",
    precio: 4.00,
    categoria: "accesorios",
    descripcion: "Botella de 500 ml con guías de dilución impresas y gatillo ergonómico de rocío amplio o chorro directo, reutilizable.",
    caracteristicas: [
      "Diseñada específicamente para realizar las diluciones exactas de productos concentrados como L.O.C. Cocina, Vidrios o Baños.",
      "Incluye guías impresas con proporciones de agua y producto.",
      "Gatillo ergonómico con opciones de rocío amplio o chorro directo.",
      "Plástico duradero reutilizable para reducir desechos.",
      "Capacidad total de 500 ml."
    ],
    advertencia: "",
    destacado: true,
    stock: 14,
    imagen: "js/data/images/producto-19.jpg"
  }
];