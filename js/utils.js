function formatPrice(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "$0.00";
  }

  return `$${number.toFixed(2)}`;
} 

function escapeHtml(value) {
  const text = String(value === undefined || value === null ? "" : value);

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeNickname(value) {
  return String(value || "").trim().toLowerCase();
}

function getInputValue(id) {
  const element = document.getElementById(id);

  if (!element) {
    return "";
  }

  return element.value;
}

function getFromLocalStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    if (parsed === null || parsed === undefined) {
      return fallback;
    }

    return parsed;
  } catch (error) {
    return fallback;
  }
}

function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}