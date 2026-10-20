(async function initAdmin() {
  Store.ensureLocalAdmin();
  await Store.refreshUser();

  if (!Store.requireAdmin()) {
    return;
  }

  const user = Store.getUser();
  const welcome = document.getElementById("admin-welcome");
  if (welcome && user) {
    welcome.textContent = `${user.name}, кабинет мастера: каталог, заказы, клиенты и заявки.`;
  }

  const logoutBtn = document.getElementById("admin-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await Store.logout();
      window.location.href = "../home.html";
    });
  }

  let dbUsers = [];
  try {
    const response = await fetch(Store._apiUrl("users.php"), { credentials: "include" });
    const data = await response.json();
    if (data.ok) dbUsers = data.users || [];
  } catch {
    dbUsers = [];
  }

  if (!dbUsers.length) {
    dbUsers = Store._getLocalUsers().map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      role: u.role || "user",
    }));
  }

  const statsEl = document.getElementById("admin-stats");
  if (statsEl) {
    const orders = Store.getOrders();
    const requests = Store.getCustomRequests();
    const clients = dbUsers.filter((u) => u.role !== "admin");
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
      <a class="stat-card" href="messages.html">
        <strong>${messages.length}</strong>
        <span>сообщений</span>
      </a>
    `;
  }

  const productsEl = document.getElementById("admin-products");
  if (productsEl) {
    Store.getProducts().forEach((item) => {
      const article = document.createElement("article");
      article.className = "product-card";
      const cats = Array.isArray(item.categories)
        ? item.categories.join(" · ")
        : item.category;
      article.innerHTML = `
        <div class="product-card-media${item.image ? " has-image" : ""}" style="--tone: ${item.tone}">
          ${item.image ? `<img src="../${item.image}" alt="${item.name}" />` : ""}
        </div>
        <div class="product-card-body">
          <h2 class="product-card-title">${item.name}</h2>
          <p class="product-card-meta">${cats}</p>
          <p class="product-card-meta">Цвет: ${item.color || "—"}</p>
          <p class="product-card-price">${Store.formatPrice(item.price)}</p>
        </div>
      `;
      productsEl.appendChild(article);
    });
  }

  const ordersEl = document.getElementById("admin-orders");
  if (ordersEl) {
    const ORDER_STATUSES = [
      "создан",
      "ожидает оплаты",
      "подтверждён",
      "собирается",
      "отправлен",
      "в пути",
      "в пункте выдачи",
      "выполнен",
      "отменён",
    ];

    const normalizeOrderStatus = (status) => {
      const map = {
        новый: "создан",
        "в работе": "собирается",
        доставлен: "выполнен",
      };
      return map[status] || status || "создан";
    };

    const orders = Store.getOrders();
    const empty = document.getElementById("admin-orders-empty");
    if (empty) empty.hidden = orders.length > 0;

    orders.forEach((order) => {
      const currentStatus = normalizeOrderStatus(order.status);
      if (order.status !== currentStatus) {
        Store.updateOrderStatus(order.id, currentStatus);
      }

      const row = document.createElement("article");
      row.className = "admin-order-card";
      const items = order.items.map((i) => i.name).join(", ");
      const statusChips = ORDER_STATUSES.map((status) => {
        const active = status === currentStatus ? " is-active" : "";
        const tone = status.replace(/\s+/g, "-");
        return `<button type="button" class="admin-status-chip admin-status-${tone}${active}" data-order-status="${order.id}" data-status="${status}">${status}</button>`;
      }).join("");

      row.innerHTML = `
        <div class="admin-order-head">
          <div>
            <h2>${order.id}</h2>
            <p class="admin-order-meta">${order.name} · ${order.email} · ${order.phone}</p>
          </div>
          <span class="account-status account-status-${currentStatus.replace(/\s+/g, "-")}">${currentStatus}</span>
        </div>
        <p class="admin-order-items">${items}</p>
        <p class="admin-order-meta">${Store.formatPrice(order.total)} · ${order.delivery} / ${order.payment}</p>
        ${order.address ? `<p class="admin-order-meta">Адрес: ${order.address}</p>` : ""}
        <div class="admin-status-block">
          <p class="admin-status-label">Статус заказа</p>
          <div class="admin-status-list">${statusChips}</div>
        </div>
      `;
      ordersEl.appendChild(row);
    });

    ordersEl.querySelectorAll("[data-order-status]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.orderStatus;
        const status = btn.dataset.status;
        Store.updateOrderStatus(id, status);

        const card = btn.closest(".admin-order-card");
        card.querySelectorAll(".admin-status-chip").forEach((chip) => {
          chip.classList.toggle("is-active", chip.dataset.status === status);
        });
        const badge = card.querySelector(".account-status");
        if (badge) {
          badge.className = `account-status account-status-${status.replace(/\s+/g, "-")}`;
          badge.textContent = status;
        }
      });
    });
  }

  const clientsEl = document.getElementById("admin-clients");
  if (clientsEl) {
    const clients = dbUsers.filter((u) => u.role !== "admin");
    clients.forEach((client) => {
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
    const REQUEST_STATUSES = [
      "создана",
      "принята",
      "отклонена",
      "обсуждение",
      "ожидает оплаты",
      "подтверждена",
      "согласование",
      "выполнена",
      "отправлена",
      "в пути",
      "в пункте выдачи",
      "отменена",
    ];
    const CHAT_STATUSES = ["обсуждение", "согласование"];

    const normalizeRequestStatus = (status) => {
      const map = {
        новая: "создана",
        "в обсуждении": "обсуждение",
      };
      return map[status] || status || "создана";
    };

    const renderChatMessages = (container, chat) => {
      if (!chat.length) {
        container.innerHTML = '<p class="request-chat-empty">Пока нет сообщений</p>';
        return;
      }
      container.innerHTML = chat
        .map((msg) => {
          const who = msg.from === "admin" ? "Мастер" : "Заказчик";
          const side = msg.from === "admin" ? "is-admin" : "is-client";
          const date = msg.createdAt
            ? new Date(msg.createdAt).toLocaleString("ru-RU")
            : "";
          const photo = msg.photo
            ? `<img class="request-chat-photo" src="${msg.photo}" alt="Фото в чате" />`
            : "";
          return `
            <div class="request-chat-bubble ${side}">
              <div class="request-chat-meta">${who}${date ? ` · ${date}` : ""}</div>
              ${msg.text ? `<p>${msg.text}</p>` : ""}
              ${photo}
            </div>
          `;
        })
        .join("");
      container.scrollTop = container.scrollHeight;
    };

    const bindChatForm = (card, requestId, role) => {
      const form = card.querySelector("[data-chat-form]");
      if (!form) return;
      const textInput = form.querySelector("[data-chat-text]");
      const fileInput = form.querySelector("[data-chat-file]");
      const preview = form.querySelector("[data-chat-preview]");
      const messagesEl = card.querySelector("[data-chat-messages]");
      let photoData = "";

      fileInput.addEventListener("change", () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) {
          photoData = "";
          preview.hidden = true;
          preview.removeAttribute("src");
          return;
        }
        if (file.size > 2.5 * 1024 * 1024) {
          alert("Фото слишком большое. Максимум около 2.5 МБ.");
          fileInput.value = "";
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          photoData = String(reader.result || "");
          preview.src = photoData;
          preview.hidden = false;
        };
        reader.readAsDataURL(file);
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const result = Store.addCustomRequestChatMessage(requestId, {
          from: role,
          text: textInput.value,
          photo: photoData,
        });
        if (!result.ok) {
          alert(result.error || "Не удалось отправить");
          return;
        }
        const updated = Store.getCustomRequest(requestId);
        renderChatMessages(messagesEl, updated.chat || []);
        textInput.value = "";
        fileInput.value = "";
        photoData = "";
        preview.hidden = true;
        preview.removeAttribute("src");
      });
    };

    const requests = Store.getCustomRequests();
    const empty = document.getElementById("admin-requests-empty");
    if (empty) empty.hidden = requests.length > 0;

    requests.forEach((req) => {
      const currentStatus = normalizeRequestStatus(req.status);
      if (req.status !== currentStatus) {
        Store.updateCustomRequestStatus(req.id, currentStatus);
      }

      const row = document.createElement("article");
      row.className = "admin-order-card";
      const canChat = CHAT_STATUSES.includes(currentStatus);
      const chat = Array.isArray(req.chat) ? req.chat : [];
      const statusChips = REQUEST_STATUSES.map((status) => {
        const active = status === currentStatus ? " is-active" : "";
        const tone = status.replace(/\s+/g, "-");
        return `<button type="button" class="admin-status-chip admin-status-${tone}${active}" data-request-status="${req.id}" data-status="${status}">${status}</button>`;
      }).join("");

      row.innerHTML = `
        <div class="admin-order-head">
          <div>
            <h2>${req.id} · ${req.type || "заявка"}</h2>
            <p class="admin-order-meta">${req.name || "без имени"} · ${req.email || "—"} · ${req.phone || "—"}</p>
          </div>
          <span class="account-status account-status-${currentStatus.replace(/\s+/g, "-")}">${currentStatus}</span>
        </div>
        <p class="admin-order-meta">${
          req.yarn
            ? `Пряжа: ${req.yarn}${req.colorNumber ? ` · № ${req.colorNumber}` : ""}`
            : "пряжа не нужна"
        }</p>
        ${req.flowerColors ? `<p class="admin-order-meta">Цвета цветов: ${req.flowerColors}</p>` : ""}
        <p class="admin-order-meta">${
          req.deadlineMode === "date" && req.deadlineDate
            ? `Срок: к ${req.deadlineDate}`
            : "Срок: по готовности"
        }</p>
        <p class="admin-order-items">${req.description || "без описания"}</p>
        ${
          req.photo
            ? `<p><img class="account-request-photo" src="${req.photo}" alt="Фото к заявке" /></p>`
            : ""
        }
        <div class="admin-status-block">
          <p class="admin-status-label">Статус заявки</p>
          <div class="admin-status-list">${statusChips}</div>
        </div>
        <div class="request-chat" data-chat-wrap="${req.id}" ${canChat || chat.length ? "" : "hidden"}>
          <p class="admin-status-label">Чат с заказчиком</p>
          <div class="request-chat-messages" data-chat-messages></div>
          ${
            canChat
              ? `<form class="request-chat-form" data-chat-form>
                  <textarea data-chat-text rows="2" placeholder="Сообщение заказчику..."></textarea>
                  <div class="request-chat-actions">
                    <label class="btn btn-ghost btn-small request-chat-file">
                      Фото
                      <input type="file" accept="image/*" data-chat-file hidden />
                    </label>
                    <button type="submit" class="btn btn-primary btn-small">Отправить</button>
                  </div>
                  <img class="request-chat-preview" data-chat-preview alt="" hidden />
                </form>`
              : chat.length
                ? `<p class="page-note">Чат доступен на этапах «обсуждение» и «согласование».</p>`
                : ""
          }
        </div>
      `;
      requestsEl.appendChild(row);
      renderChatMessages(row.querySelector("[data-chat-messages]"), chat);
      if (canChat) {
        bindChatForm(row, req.id, "admin");
      }
    });

    requestsEl.querySelectorAll("[data-request-status]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.requestStatus;
        const status = btn.dataset.status;
        Store.updateCustomRequestStatus(id, status);

        const card = btn.closest(".admin-order-card");
        card.querySelectorAll(".admin-status-chip").forEach((chip) => {
          chip.classList.toggle("is-active", chip.dataset.status === status);
        });
        const badge = card.querySelector(".account-status");
        if (badge) {
          badge.className = `account-status account-status-${status.replace(/\s+/g, "-")}`;
          badge.textContent = status;
        }

        // Перерисуем карточку целиком, чтобы корректно показать/скрыть форму чата
        window.location.reload();
      });
    });
  }

  const messagesEl = document.getElementById("admin-messages");
  if (messagesEl) {
    const messages = Store.getMessages();
    const empty = document.getElementById("admin-messages-empty");
    if (empty) empty.hidden = messages.length > 0;

    messages.forEach((msg) => {
      const row = document.createElement("article");
      row.className = "list-row list-row-plain";
      const date = msg.createdAt
        ? new Date(msg.createdAt).toLocaleString("ru-RU")
        : "";
      row.innerHTML = `
        <div class="list-row-body">
          <h2>${msg.name || "Без имени"}</h2>
          <p>${msg.email || "—"} · ${msg.phone || "без телефона"}</p>
          <p>${msg.message || msg.text || "без текста"}</p>
          ${date ? `<p class="page-note">${date}</p>` : ""}
        </div>
      `;
      messagesEl.appendChild(row);
    });
  }
})();
