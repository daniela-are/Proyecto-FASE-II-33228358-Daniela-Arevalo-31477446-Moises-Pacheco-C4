const USUARIOS_PREDEFINIDOS = [
  {
    id: 1,
    nombre: "Administrador",
    apellido: "General",
    direccion: "Sistema BinaryShop",
    nickname: "admin",
    password: "admin123",
    rol: "administrador",
    banco: "Banco Binary",
    tarjeta: "0000-0000-0000-0000",
    predefinido: true
  },
  {
    id: 2,
    nombre: "Comprador",
    apellido: "Demo",
    direccion: "Calle Principal",
    nickname: "comprador",
    password: "comprador123",
    rol: "comprador",
    banco: "Banco Demo",
    tarjeta: "1111-2222-3333-4444",
    predefinido: true
  },
  {
    id: 3,
    nombre: "Vendedor",
    apellido: "Demo",
    direccion: "Avenida Central",
    nickname: "vendedor",
    password: "vendedor123",
    rol: "vendedor",
    banco: "Banco Demo",
    tarjeta: "5555-6666-7777-8888",
    predefinido: true
  }
];

const ROLES_REGISTRO = ["comprador", "vendedor"];