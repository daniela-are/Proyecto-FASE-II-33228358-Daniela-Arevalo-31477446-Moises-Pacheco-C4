const SESSION_KEY = "binaryshop_session";
const USERS_KEY = "binaryshop_users";

function getStoredUsers() {
  const users = getFromLocalStorage(USERS_KEY, []);

  if (!Array.isArray(users)) {
    return [];
  }

  return users;
}

function saveStoredUsers(users) {
  return saveToLocalStorage(USERS_KEY, users);
}

function getAllUsers() {
  // Los usuarios guardados van primero para que las ediciones de perfil
  // tengan prioridad sobre los usuarios predefinidos.
  return [...getStoredUsers(), ...USUARIOS_PREDEFINIDOS];
}

function findUserByNickname(nickname) {
  const normalized = normalizeNickname(nickname);

  return getAllUsers().find((user) => {
    return normalizeNickname(user.nickname) === normalized;
  });
}

function getCurrentSession() {
  const session = getFromLocalStorage(SESSION_KEY, null);

  if (!session) {
    return null;
  }

  return session;
}

function saveSession(user) {
  const session = {
    nombre: user.nombre,
    apellido: user.apellido,
    nickname: user.nickname,
    rol: user.rol
  };

  return saveToLocalStorage(SESSION_KEY, session);
}

function clearSession() {
  return removeFromLocalStorage(SESSION_KEY);
}

function loginUser(credentials) {
  const nickname = credentials.nickname || "";
  const password = credentials.password || "";
  const rol = credentials.rol || "";

  if (!nickname.trim() || !password || !rol) {
    return {
      success: false,
      message: "Ingresa nickname, contraseña y rol."
    };
  }

  const user = findUserByNickname(nickname);

  if (!user || user.password !== password) {
    return {
      success: false,
      message: "Nickname o contraseña incorrectos."
    };
  }

  if (user.rol !== rol) {
    return {
      success: false,
      message: "El rol seleccionado no coincide con este usuario."
    };
  }

  saveSession(user);

  return {
    success: true,
    session: getCurrentSession()
  };
}

function registerUser(data) {
  if (!data) {
    return {
      success: false,
      message: "No se recibieron datos para el registro."
    };
  }

  if (!ROLES_REGISTRO.includes(data.rol)) {
    return {
      success: false,
      message: "El rol seleccionado no es válido para registro."
    };
  }

  if (findUserByNickname(data.nickname)) {
    return {
      success: false,
      message: "Ese nickname ya está registrado."
    };
  }

  const users = getStoredUsers();

  const newUser = {
    id: Date.now(),
    nombre: data.nombre.trim(),
    apellido: data.apellido.trim(),
    direccion: data.direccion.trim(),
    nickname: data.nickname.trim(),
    password: data.password,
    rol: data.rol,
    banco: data.banco.trim(),
    tarjeta: data.tarjeta.trim(),
    registrado: true
  };

  users.push(newUser);
  saveStoredUsers(users);
  saveSession(newUser);

  return {
    success: true,
    session: getCurrentSession()
  };
}

function updateUserProfile(nickname, changes) {
  const normalized = normalizeNickname(nickname);
  const stored = getStoredUsers();

  let user = stored.find(
    (entry) => normalizeNickname(entry.nickname) === normalized
  );

  if (user) {
    Object.assign(user, changes);
    saveStoredUsers(stored);
  } else {
    const base = USUARIOS_PREDEFINIDOS.find(
      (entry) => normalizeNickname(entry.nickname) === normalized
    );

    if (!base) {
      return {
        success: false,
        message: "Usuario no encontrado."
      };
    }

    user = Object.assign({}, base, changes, { editado: true });
    stored.push(user);
    saveStoredUsers(stored);
  }

  saveSession(user);

  return {
    success: true,
    user
  };
}