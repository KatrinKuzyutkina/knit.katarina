const listEl = document.getElementById("cart-list");
const emptyEl = document.getElementById("cart-empty");
const formEl = document.getElementById("checkout-form");
const totalEl = document.getElementById("cart-total");
const statusEl = document.getElementById("checkout-status");
const authGate = document.getElementById("auth-gate");
const content = document.getElementById("cart-content");
const loginBtn = document.getElementById("auth-gate-login");
const checkoutDropdowns = [
  ...document.querySelectorAll(".checkout-dropdown"),
];
const deliveryDropdown = document.querySelector(
  '.checkout-dropdown[data-dropdown="delivery"]'
);
const paymentDropdown = document.querySelector(
  '.checkout-dropdown[data-dropdown="payment"]'
);
const deliveryInput = document.getElementById("delivery-input");
const paymentInput = document.getElementById("payment-input");

function setDropdownValue(dropdown, input, value) {
  if (!dropdown || !input) return;
  input.value = value;
  const summary = dropdown.querySelector("[data-summary]");
  summary.textContent = value;
  dropdown.querySelectorAll(".filter-option[data-value]").forEach((option) => {
    const selected = option.dataset.value === value;
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-selected", selected ? "true" : "false");
  });
}

function setDeliveryValue(value) {
  setDropdownValue(deliveryDropdown, deliveryInput, value);
  syncPaymentOptions();
}

function setPaymentValue(value) {
  setDropdownValue(paymentDropdown, paymentInput, value);
}

function syncPaymentOptions() {
  if (!paymentDropdown) return;
  const isPickup = deliveryInput.value === "Самовывоз";
  const cashOption = paymentDropdown.querySelector('[data-pickup-only]');

  if (cashOption) {
    cashOption.hidden = !isPickup;
  }

  if (!isPickup && paymentInput.value === "Наличные") {
    setPaymentValue("Перевод");
  }
}

function setDropdownOpen(dropdown, open) {
  if (!dropdown) return;
  const toggle = dropdown.querySelector(".filter-dropdown-toggle");
  const menu = dropdown.querySelector(".filter-dropdown-menu");
  dropdown.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  menu.hidden = !open;
}

function closeAllDropdowns(except) {
  checkoutDropdowns.forEach((dropdown) => {
    if (dropdown !== except) {
      setDropdownOpen(dropdown, false);
    }
  });
}

function getCartProducts() {
  return Store.getCart()
    .map((id) => Store.getProduct(id))
    .filter(Boolean);
}

function renderCart() {
  const items = getCartProducts();
  listEl.innerHTML = "";
  emptyEl.hidden = items.length > 0;
  formEl.hidden = items.length === 0;

  items.forEach((item) => {
    const row = document.createElement("article");
    row.className = "list-row";
    const mediaContent = item.image
      ? `<img src="${item.image}" alt="${item.name}" loading="lazy" />`
      : "";
    row.innerHTML = `
      <div class="list-row-media${item.image ? " has-image" : ""}" style="--tone: ${item.tone}">${mediaContent}</div>
      <div class="list-row-body">
        <h2><a href="product.html?id=${item.id}">${item.name}</a></h2>
        <p>${item.category} · ${Store.formatPrice(item.price)}</p>
      </div>
      <button type="button" class="btn btn-ghost btn-small" data-remove="${item.id}">Удалить</button>
    `;
    listEl.appendChild(row);
  });

  const sum = items.reduce((acc, item) => acc + item.price, 0);
  totalEl.textContent = `Итого: ${Store.formatPrice(sum)}`;

  listEl.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      Store.removeFromCart(btn.dataset.remove);
      renderCart();
    });
  });

  const user = Store.getUser();
  if (user && items.length) {
    formEl.name.value = user.name || "";
    formEl.email.value = user.email || "";
    formEl.phone.value = user.phone || "";
  }
}

checkoutDropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector(".filter-dropdown-toggle");
  const menu = dropdown.querySelector(".filter-dropdown-menu");
  const name = dropdown.dataset.dropdown;

  toggle.addEventListener("click", () => {
    const willOpen = menu.hidden;
    closeAllDropdowns(dropdown);
    setDropdownOpen(dropdown, willOpen);
  });

  menu.querySelectorAll(".filter-option[data-value]").forEach((option) => {
    option.addEventListener("click", () => {
      if (option.hidden) return;
      if (name === "delivery") {
        setDeliveryValue(option.dataset.value);
      } else if (name === "payment") {
        setPaymentValue(option.dataset.value);
      }
      setDropdownOpen(dropdown, false);
    });
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".checkout-dropdown")) {
    closeAllDropdowns();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllDropdowns();
  }
});

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = Store.getUser();
  if (!user) {
    window.location.href =
      "login.html?next=" + encodeURIComponent("cart.html");
    return;
  }

  const data = new FormData(formEl);
  const delivery = data.get("delivery");
  let payment = data.get("payment");

  if (delivery !== "Самовывоз" && payment === "Наличные") {
    payment = "Перевод";
    setPaymentValue("Перевод");
  }

  const items = getCartProducts();
  const order = {
    id: "ORD-" + Date.now(),
    createdAt: new Date().toISOString(),
    userEmail: user.email,
    name: data.get("name"),
    phone: data.get("phone"),
    email: data.get("email"),
    delivery,
    payment,
    address: data.get("address"),
    items: items.map((i) => ({ id: i.id, name: i.name, price: i.price })),
    total: items.reduce((acc, i) => acc + i.price, 0),
    status: "создан",
  };

  Store.addOrder(order);
  Store.clearCart();
  renderCart();
  statusEl.hidden = false;
  statusEl.textContent = `Заказ ${order.id} оформлен. Статус можно смотреть в личном кабинете.`;
  formEl.reset();
  setDeliveryValue("Самовывоз");
  setPaymentValue("Перевод");
});

(async function initCart() {
  if (Store.refreshUser) {
    await Store.refreshUser();
  }

  if (!Store.getUser()) {
    content.hidden = true;
    authGate.hidden = false;
    loginBtn.href = "login.html?next=" + encodeURIComponent("cart.html");
    return;
  }

  authGate.hidden = true;
  content.hidden = false;
  setDeliveryValue("Самовывоз");
  setPaymentValue("Перевод");
  renderCart();
})();
