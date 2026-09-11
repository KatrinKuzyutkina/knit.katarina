const listEl = document.getElementById("cart-list");
const emptyEl = document.getElementById("cart-empty");
const formEl = document.getElementById("checkout-form");
const totalEl = document.getElementById("cart-total");
const statusEl = document.getElementById("checkout-status");

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
    row.innerHTML = `
      <div class="list-row-media" style="--tone: ${item.tone}"></div>
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

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = Store.getUser();
  if (!user) {
    window.location.href = "login.html?next=" + encodeURIComponent("cart.html");
    return;
  }

  const data = new FormData(formEl);
  const items = getCartProducts();
  const order = {
    id: "ORD-" + Date.now(),
    createdAt: new Date().toISOString(),
    userEmail: user.email,
    name: data.get("name"),
    phone: data.get("phone"),
    email: data.get("email"),
    delivery: data.get("delivery"),
    payment: data.get("payment"),
    address: data.get("address"),
    items: items.map((i) => ({ id: i.id, name: i.name, price: i.price })),
    total: items.reduce((acc, i) => acc + i.price, 0),
    status: "новый",
  };

  Store.addOrder(order);
  Store.clearCart();
  renderCart();
  statusEl.hidden = false;
  statusEl.textContent = `Заказ ${order.id} оформлен. Статус можно смотреть в личном кабинете.`;
  formEl.reset();
});

renderCart();
