if (!Store.requireAdmin()) {
  /* redirect */
} else {
  const logoutBtn = document.getElementById("admin-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Store.logout();
      window.location.href = "../home.html";
    });
  }

  const statsEl = document.getElementById("admin-stats");
  if (statsEl) {
    const orders = Store.getOrders();
    const requests = Store.getCustomRequests();
    const clients = Store.getUsers().filter((u) => u.role !== "admin");
    const messages = Store.getMessages();

    statsEl.innerHTML = `
      <a class="stat-card" href="products.html">
        <strong>${Store.getProducts().length}</strong>
        <span>товаров</span>
      </a>
      <a class="stat-card" href="orders.html">
        <strong>${orders.length}</strong>
        <span>заказов</span>
      </a>
      <a class="stat-card" href="clients.html">
        <strong>${clients.length}</strong>
        <span>клиентов</span>
      </a>
      <a class="stat-card" href="custom-requests.html">
        <strong>${requests.length}</strong>
        <span>заявок</span>
      </a>
      <div class="stat-card">
        <strong>${messages.length}</strong>
        <span>сообщений</span>
      </div>
    `;
  }

  const productsEl = document.getElementById("admin-products");
  if (productsEl) {
    Store.getProducts().forEach((item) => {
      const article = document.createElement("article");
      article.className = "product-card";
      article.innerHTML = `
        <div class="product-card-media" style="--tone: ${item.tone}"></div>
        <div class="product-card-body">
          <h2 class="product-card-title">${item.name}</h2>
          <p class="product-card-meta">${item.category} · ${item.color}</p>
          <p class="product-card-price">${Store.formatPrice(item.price)}</p>
        </div>
      `;
      productsEl.appendChild(article);
    });
  }

  const ordersEl = document.getElementById("admin-orders");
  if (ordersEl) {
    const orders = Store.getOrders();
    const empty = document.getElementById("admin-orders-empty");
    if (empty) empty.hidden = orders.length > 0;

    orders.forEach((order) => {
      const row = document.createElement("article");
      row.className = "list-row list-row-plain";
      const items = order.items.map((i) => i.name).join(", ");
      row.innerHTML = `
        <div class="list-row-body">
          <h2>${order.id}</h2>
          <p>${order.name} · ${order.email} · ${order.phone}</p>
          <p>${items}</p>
          <p>${Store.formatPrice(order.total)} · ${order.delivery} / ${order.payment}</p>
          <label class="field inline-field">
            <span>Статус</span>
            <select data-order-status="${order.id}">
              <option value="новый" ${order.status === "новый" ? "selected" : ""}>новый</option>
              <option value="в работе" ${order.status === "в работе" ? "selected" : ""}>в работе</option>
              <option value="отправлен" ${order.status === "отправлен" ? "selected" : ""}>отправлен</option>
              <option value="доставлен" ${order.status === "доставлен" ? "selected" : ""}>доставлен</option>
              <option value="отменён" ${order.status === "отменён" ? "selected" : ""}>отменён</option>
            </select>
          </label>
        </div>
      `;
      ordersEl.appendChild(row);
    });

    ordersEl.querySelectorAll("[data-order-status]").forEach((select) => {
      select.addEventListener("change", () => {
        Store.updateOrderStatus(select.dataset.orderStatus, select.value);
      });
    });
  }

  const clientsEl = document.getElementById("admin-clients");
  if (clientsEl) {
    Store.getUsers()
      .filter((u) => u.role !== "admin")
      .forEach((client) => {
        const row = document.createElement("article");
        row.className = "list-row list-row-plain";
        row.innerHTML = `
          <div class="list-row-body">
            <h2>${client.name}</h2>
            <p>${client.email}</p>
            <p>${client.phone || "телефон не указан"}</p>
          </div>
        `;
        clientsEl.appendChild(row);
      });

    if (!clientsEl.children.length) {
      clientsEl.innerHTML = '<p class="page-note">Пока нет зарегистрированных клиентов.</p>';
    }
  }

  const requestsEl = document.getElementById("admin-requests");
  if (requestsEl) {
    const requests = Store.getCustomRequests();
    const empty = document.getElementById("admin-requests-empty");
    if (empty) empty.hidden = requests.length > 0;

    requests.forEach((req) => {
      const row = document.createElement("article");
      row.className = "list-row list-row-plain";
      row.innerHTML = `
        <div class="list-row-body">
          <h2>${req.id} · ${req.type}</h2>
          <p>${req.name} · ${req.email} · ${req.phone || "—"}</p>
          <p>${req.materials || "материалы не указаны"}</p>
          <p>${req.description}</p>
          <label class="field inline-field">
            <span>Статус</span>
            <select data-request-status="${req.id}">
              <option value="новая" ${req.status === "новая" ? "selected" : ""}>новая</option>
              <option value="в обсуждении" ${req.status === "в обсуждении" ? "selected" : ""}>в обсуждении</option>
              <option value="принята" ${req.status === "принята" ? "selected" : ""}>принята</option>
              <option value="отклонена" ${req.status === "отклонена" ? "selected" : ""}>отклонена</option>
            </select>
          </label>
        </div>
      `;
      requestsEl.appendChild(row);
    });

    requestsEl.querySelectorAll("[data-request-status]").forEach((select) => {
      select.addEventListener("change", () => {
        Store.updateCustomRequestStatus(select.dataset.requestStatus, select.value);
      });
    });
  }
}
