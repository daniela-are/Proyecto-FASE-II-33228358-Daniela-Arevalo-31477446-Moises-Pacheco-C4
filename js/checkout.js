// Tiempo de simulación del procesamiento del pago (en milisegundos).
// Si quieres 5 segundos, cambia 1500 por 5000.
const PROCESAMIENTO_MS = 1500;

function getCheckoutElements() {
  return {
    modal: document.getElementById("checkout-modal"),
    close: document.getElementById("close-checkout"),
    title: document.getElementById("checkout-title"),
    message: document.getElementById("checkout-message"),
    form: document.getElementById("checkout-form"),
    receipt: document.getElementById("checkout-receipt"),
    error: document.getElementById("checkout-error"),
    submit: document.getElementById("checkout-submit"),
    total: document.getElementById("checkout-total")
  };
}

function showCheckoutError(message) {
  const elements = getCheckoutElements();

  if (elements.error) {
    elements.error.textContent = message;
  }
}

function clearCheckoutError() {
  const elements = getCheckoutElements();

  if (elements.error) {
    elements.error.textContent = "";
  }
}

function resetCheckoutSubmit() {
  const elements = getCheckoutElements();

  if (elements.submit) {
    elements.submit.disabled = false;
    elements.submit.textContent = "Pagar";
  }
}

function showCheckoutStep(step) {
  const elements = getCheckoutElements();
  const isPayment = step === "pago";

  if (elements.form) {
    elements.form.classList.toggle("hidden", !isPayment);
  }

  if (elements.receipt) {
    elements.receipt.classList.toggle("hidden", isPayment);
  }

  if (elements.title) {
    elements.title.textContent = isPayment
      ? "Finalizar compra"
      : "Recibo de compra";
  }

  if (elements.message) {
    elements.message.textContent = isPayment
      ? "Confirma tu método de pago para procesar la orden."
      : "¡Gracias por tu compra! Estos son los detalles de tu orden.";
  }
}

function prefillPaymentForm(session) {
  const user = findUserByNickname(session.nickname);

  const bankInput = document.getElementById("pay-bank");
  const holderInput = document.getElementById("pay-holder");
  const cardInput = document.getElementById("pay-card");
  const expiryInput = document.getElementById("pay-expiry");
  const cvvInput = document.getElementById("pay-cvv");

  if (bankInput) {
    bankInput.value = user && user.banco ? user.banco : "";
  }

  if (holderInput) {
    holderInput.value = `${session.nombre} ${session.apellido}`.trim();
  }

  if (cardInput) {
    cardInput.value = user && user.tarjeta ? user.tarjeta : "";
  }

  if (expiryInput) {
    expiryInput.value = "";
  }

  if (cvvInput) {
    cvvInput.value = "";
  }
}

function openCheckout() {
  const session = getCurrentSession();

  if (!session) {
    showToast("Debes iniciar sesión para completar la compra.", "warning");
    openAuthModal("login", "Inicia sesión o regístrate para comprar.");
    return;
  }

  if (session.rol !== "comprador") {
    showToast(
      "Solo los usuarios con rol comprador pueden procesar compras.",
      "warning"
    );
    return;
  }

  const items = getCart();

  if (items.length === 0) {
    showToast("Tu carrito está vacío. Añade productos antes de pagar.", "warning");
    return;
  }

  if (typeof closeCartDropdown === "function") {
    closeCartDropdown();
  }

  prefillPaymentForm(session);

  const elements = getCheckoutElements();

  if (elements.total) {
    elements.total.textContent = formatPrice(getCartTotal());
  }

  clearCheckoutError();
  resetCheckoutSubmit();
  showCheckoutStep("pago");

  if (elements.modal) {
    elements.modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
  }
}

function closeCheckout() {
  const elements = getCheckoutElements();

  if (!elements.modal) {
    return;
  }

  elements.modal.classList.add("hidden");
  document.body.classList.remove("modal-open");

  clearCheckoutError();

  const expiryInput = document.getElementById("pay-expiry");
  const cvvInput = document.getElementById("pay-cvv");

  if (expiryInput) {
    expiryInput.value = "";
  }

  if (cvvInput) {
    cvvInput.value = "";
  }

  resetCheckoutSubmit();
}

function validatePaymentForm(data) {
  if (!data.bank.trim()) {
    return {
      success: false,
      message: "Ingresa el nombre del banco emisor."
    };
  }

  if (!data.holder.trim()) {
    return {
      success: false,
      message: "Ingresa el nombre del titular de la tarjeta."
    };
  }

  const cardDigits = data.card.replace(/\D/g, "");

  if (cardDigits.length < 12 || cardDigits.length > 19) {
    return {
      success: false,
      message: "El número de tarjeta debe tener entre 12 y 19 dígitos."
    };
  }

  const expiryMatch = data.expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);

  if (!expiryMatch) {
    return {
      success: false,
      message: "El vencimiento debe tener el formato MM/AA."
    };
  }

  const month = Number(expiryMatch[1]);
  const year = 2000 + Number(expiryMatch[2]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return {
      success: false,
      message: "La tarjeta está vencida. Ingresa una fecha de vigencia."
    };
  }

  if (!/^\d{3,4}$/.test(data.cvv)) {
    return {
      success: false,
      message: "El CVV debe tener 3 o 4 dígitos."
    };
  }

  return {
    success: true
  };
}

function renderReceipt(order) {
  const elements = getCheckoutElements();

  if (!elements.receipt) {
    return;
  }

  const itemsHtml = order.items
    .map((item) => {
      return `
        <div class="receipt-line">
          <span>${item.cantidad}x ${escapeHtml(item.nombre)}</span>
          <span>${formatPrice(item.subtotal)}</span>
        </div>
      `;
    })
    .join("");

  elements.receipt.innerHTML = `
    <div class="receipt">
      <p class="receipt-success">
        <span class="receipt-icon">✔</span>
        Compra exitosa
      </p>

      <div class="receipt-meta">
        <span>Orden: <strong>${escapeHtml(order.id)}</strong></span>
        <span>Fecha: ${escapeHtml(order.fecha)}</span>
        <span>
          Método de pago: ${escapeHtml(order.banco)} •••• ${escapeHtml(order.last4)}
        </span>
      </div>

      <div class="receipt-items">
        ${itemsHtml}
        <div class="receipt-total">
          <span>Total pagado</span>
          <span>${formatPrice(order.total)}</span>
        </div>
      </div>
    `;
}

function processSuccessfulPayment(items, paymentData) {
  const session = getCurrentSession();

  const order = {
    id: `BS-${String(Date.now()).slice(-6)}`,
    fecha: new Date().toLocaleString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }),
    comprador: session ? session.nickname : "",
    banco: getInputValue("pay-bank"),
    last4: paymentData.card.replace(/\D/g, "").slice(-4),
    items: items.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio: item.precio,
      subtotal: item.precio * item.cantidad
    })),
    total: getCartTotal()
  };

  order.items.forEach((item) => {
    const available = getProductStock(item.id);
    setProductStock(item.id, Math.max(0, available - item.cantidad));
  });

  saveCart([]);
  updateCartUI();

  resetCheckoutSubmit();
  renderReceipt(order);
  showCheckoutStep("recibo");
  showToast("Pago procesado correctamente.", "success");
}

function handlePaymentSubmit(event) {
  event.preventDefault();

  clearCheckoutError();

  const items = getCart();

  if (items.length === 0) {
    showCheckoutError("Tu carrito está vacío, no se puede procesar el pago.");
    return;
  }

  const data = {
    bank: getInputValue("pay-bank"),
    holder: getInputValue("pay-holder"),
    card: getInputValue("pay-card"),
    expiry: getInputValue("pay-expiry"),
    cvv: getInputValue("pay-cvv")
  };

  const validation = validatePaymentForm(data);

  if (!validation.success) {
    showCheckoutError(validation.message);
    return;
  }

  const elements = getCheckoutElements();

  if (elements.submit) {
    elements.submit.disabled = true;
    elements.submit.innerHTML =
      '<span class="spinner"></span> Procesando pago...';
  }

  setTimeout(() => {
    // Caso de fallo simulado: CVV 000 = tarjeta rechazada por el banco.
    if (data.cvv === "000") {
      resetCheckoutSubmit();
      showCheckoutError(
        "Tarjeta rechazada por el banco emisor. Verifica otro método de pago."
      );
      return;
    }

    processSuccessfulPayment(items, data);
  }, PROCESAMIENTO_MS);
}

function bindCheckoutEvents() {
  const elements = getCheckoutElements();

  const expiryInput = document.getElementById("pay-expiry");
  const cvvInput = document.getElementById("pay-cvv");

  if (elements.close) {
    elements.close.addEventListener("click", closeCheckout);
  }

  if (elements.modal) {
    elements.modal.addEventListener("click", (event) => {
      if (event.target !== elements.modal) {
        return;
      }

      const submit = document.getElementById("checkout-submit");

      if (submit && submit.disabled) {
        return;
      }

      // Con el recibo visible, el modal se cierra únicamente con la "X".
      const receipt = document.getElementById("checkout-receipt");

      if (receipt && !receipt.classList.contains("hidden")) {
        return;
      }

      closeCheckout();
    });
  }
  if (elements.form) {
    elements.form.addEventListener("submit", handlePaymentSubmit);
  }

  if (expiryInput) {
    expiryInput.addEventListener("input", () => {
      const digits = expiryInput.value.replace(/\D/g, "").slice(0, 4);

      expiryInput.value = digits.length > 2
        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
        : digits;
    });
  }

  if (cvvInput) {
    cvvInput.addEventListener("input", () => {
      cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 4);
    });
  }
}