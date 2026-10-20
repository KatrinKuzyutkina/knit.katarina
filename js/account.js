(async function initAccount() {
  await Store.refreshUser();

  if (!Store.requireAuth("account.html")) {
    return;
  }

  const profileInfo = document.getElementById("profile-info");
  const editForm = document.getElementById("profile-edit-form");
  const editBtn = document.getElementById("edit-profile-btn");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const statusEl = document.getElementById("profile-status");
  const passwordForm = document.getElementById("password-form");
  const passwordStatus = document.getElementById("password-status");

  function renderProfile(user) {
    const initial = (user.name || "К").trim().charAt(0).toUpperCase();
    document.getElementById("account-avatar").textContent = initial;
    document.getElementById("account-greeting").textContent =
      `Здравствуйте, ${user.name}`;

    profileInfo.innerHTML = `
      <div class="account-field">
        <span>Имя</span>
        <strong>${user.name}</strong>
      </div>
      <div class="account-field account-field-email">
        <span>Email</span>
        <strong>${user.email}</strong>
      </div>
      <div class="account-field">
        <span>Телефон</span>
        <strong>${user.phone || "не указан"}</strong>
      </div>
    `;

    editForm.name.value = user.name || "";
    editForm.email.value = user.email || "";
    editForm.phone.value = user.phone || "";
  }

  function showView() {
    profileInfo.hidden = false;
    editForm.hidden = true;
    editBtn.hidden = false;
    statusEl.hidden = true;
  }

  function showEdit() {
    const current = Store.getUser();
    editForm.name.value = current.name || "";
    editForm.email.value = current.email || "";
    editForm.phone.value = current.phone || "";
    profileInfo.hidden = true;
    editForm.hidden = false;
    editBtn.hidden = true;
    statusEl.hidden = true;
  }

  let user = Store.getUser();

  if (user.role === "admin") {
    window.location.href = "admin/index.html";
    return;
  }

  renderProfile(user);

  editBtn.addEventListener("click", showEdit);
  cancelBtn.addEventListener("click", showView);

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(editForm);
    const result = await Store.updateProfile({
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      password: "",
    });

    statusEl.hidden = false;
    if (!result.ok) {
      statusEl.classList.add("error");
      statusEl.textContent = result.error || "Не удалось сохранить";
      return;
    }

    statusEl.classList.remove("error");
    statusEl.textContent = "Данные сохранены";
    user = Store.getUser();
    renderProfile(user);
    showView();
    statusEl.hidden = false;
  });

  passwordForm.querySelectorAll("[data-password-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".password-input");
      const input = wrap.querySelector("input");
      const show = input.type === "password";

      input.type = show ? "text" : "password";
      btn.classList.toggle("is-visible", show);
      btn.setAttribute(
        "aria-label",
        show ? "Скрыть пароль" : "Показать пароль"
      );
    });
  });

  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(passwordForm);
    const password = String(data.get("password") || "");
    const passwordConfirm = String(data.get("passwordConfirm") || "");

    passwordStatus.hidden = false;

    if (password.length < 4) {
      passwordStatus.classList.add("error");
      passwordStatus.textContent = "Пароль должен быть не короче 4 символов";
      return;
    }

    if (password !== passwordConfirm) {
      passwordStatus.classList.add("error");
      passwordStatus.textContent = "Пароли не совпадают";
      return;
    }

    const current = Store.getUser();
    const result = await Store.updateProfile({
      name: current.name,
      email: current.email,
      phone: current.phone || "",
      password,
    });

    if (!result.ok) {
      passwordStatus.classList.add("error");
      passwordStatus.textContent = result.error || "Не удалось сменить пароль";
      return;
    }

    passwordStatus.classList.remove("error");
    passwordStatus.textContent = "Пароль обновлён";
    passwordForm.reset();

    passwordForm.querySelectorAll(".password-input").forEach((wrap) => {
      const input = wrap.querySelector("input");
      const btn = wrap.querySelector("[data-password-toggle]");
      input.type = "password";
      btn.classList.remove("is-visible");
      btn.setAttribute("aria-label", "Показать пароль");
    });
  });

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await Store.logout();
    window.location.href = "home.html";
  });

  const userEmail = String(user.email || "").toLowerCase();

  const requests = Store.getCustomRequests().filter(
    (r) => String(r.userEmail || r.email || "").toLowerCase() === userEmail
  );
  const requestsList = document.getElementById("requests-list");
  const requestsEmpty = document.getElementById("requests-empty");
  const requestsCount = document.getElementById("requests-count");

  requestsEmpty.hidden = requests.length > 0;
  requestsCount.textContent =
    requests.length === 0
      ? ""
      : requests.length === 1
        ? "1 заявка"
        : `Заявок: ${requests.length}`;

  requests.forEach((req) => {
    const row = document.createElement("article");
    row.className = "account-order";
    const statusMap = {
      новая: "создана",
      "в обсуждении": "обсуждение",
    };
    const status = statusMap[req.status] || req.status || "создана";
    const statusClass = String(status).replace(/\s+/g, "-").toLowerCase();
    const chatStatuses = ["обсуждение", "согласование"];
    const canChat = chatStatuses.includes(status);
    const chat = Array.isArray(req.chat) ? req.chat : [];
    const deadlineText =
      req.deadlineMode === "date" && req.deadlineDate
        ? `К дате: ${req.deadlineDate}`
        : "По готовности";
    const yarnText = req.yarn
      ? `Пряжа: ${req.yarn}${req.colorNumber ? ` · № ${req.colorNumber}` : ""}`
      : "";
    const flowersText = req.flowerColors
      ? `Цвета: ${req.flowerColors}`
      : "";
    const photoHtml = req.photo
      ? `<img class="account-request-photo" src="${req.photo}" alt="Фото к заявке" />`
      : "";

    const chatHtml =
      canChat || chat.length
        ? `
      <div class="request-chat">
        <p class="admin-status-label">Чат с мастером</p>
        <div class="request-chat-messages" data-chat-messages></div>
        ${
          canChat
            ? `<form class="request-chat-form" data-chat-form>
                <textarea data-chat-text rows="2" placeholder="Сообщение мастеру..."></textarea>
                <div class="request-chat-actions">
                  <label class="btn btn-ghost btn-small request-chat-file">
                    Фото
                    <input type="file" accept="image/*" data-chat-file hidden />
                  </label>
                  <button type="submit" class="btn btn-primary btn-small">Отправить</button>
                </div>
                <img class="request-chat-preview" data-chat-preview alt="" hidden />
              </form>`
            : `<p class="page-note">Чат доступен, когда заявка в статусе «обсуждение» или «согласование».</p>`
        }
      </div>`
        : "";

    row.innerHTML = `
      <div class="account-order-top">
        <div>
          <h3>${req.id} · ${req.type || "заявка"}</h3>
          <p class="account-order-date">${new Date(req.createdAt).toLocaleString("ru-RU")}</p>
        </div>
        <span class="account-status account-status-${statusClass}">${status}</span>
      </div>
      <p class="account-order-items">${deadlineText}${yarnText ? ` · ${yarnText}` : ""}</p>
      ${flowersText ? `<p class="account-order-items">${flowersText}</p>` : ""}
      <p class="account-order-items">${req.description || "Без описания"}</p>
      ${photoHtml}
      ${chatHtml}
      <div class="account-request-actions">
        <a class="btn btn-ghost btn-small" href="custom-order.html?edit=${encodeURIComponent(req.id)}">Редактировать</a>
        <button type="button" class="btn btn-ghost btn-small" data-delete-request="${req.id}">Удалить</button>
      </div>
    `;
    requestsList.appendChild(row);

    const messagesEl = row.querySelector("[data-chat-messages]");
    if (messagesEl) {
      if (!chat.length) {
        messagesEl.innerHTML = '<p class="request-chat-empty">Пока нет сообщений</p>';
      } else {
        messagesEl.innerHTML = chat
          .map((msg) => {
            const who = msg.from === "admin" ? "Мастер" : "Вы";
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
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }

    const form = row.querySelector("[data-chat-form]");
    if (form) {
      const textInput = form.querySelector("[data-chat-text]");
      const fileInput = form.querySelector("[data-chat-file]");
      const preview = form.querySelector("[data-chat-preview]");
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
        const result = Store.addCustomRequestChatMessage(req.id, {
          from: "client",
          text: textInput.value,
          photo: photoData,
        });
        if (!result.ok) {
          alert(result.error || "Не удалось отправить");
          return;
        }
        window.location.reload();
      });
    }
  });

  requestsList.querySelectorAll("[data-delete-request]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.deleteRequest;
      if (!confirm("Удалить эту заявку?")) {
        return;
      }
      Store.deleteCustomRequest(id);
      window.location.reload();
    });
  });

  const orders = Store.getOrders().filter(
    (o) => String(o.userEmail || "").toLowerCase() === userEmail
  );
  const list = document.getElementById("orders-list");
  const empty = document.getElementById("orders-empty");
  const countEl = document.getElementById("orders-count");

  empty.hidden = orders.length > 0;
  countEl.textContent =
    orders.length === 0
      ? ""
      : orders.length === 1
        ? "1 заказ"
        : `Заказов: ${orders.length}`;

  orders.forEach((order) => {
    const row = document.createElement("article");
    row.className = "account-order";
    const items = order.items.map((i) => i.name).join(", ");
    const statusMap = {
      новый: "создан",
      "в работе": "собирается",
      доставлен: "выполнен",
    };
    const status = statusMap[order.status] || order.status || "создан";
    const statusClass = String(status).replace(/\s+/g, "-").toLowerCase();
    row.innerHTML = `
      <div class="account-order-top">
        <div>
          <h3>${order.id}</h3>
          <p class="account-order-date">${new Date(order.createdAt).toLocaleString("ru-RU")}</p>
        </div>
        <span class="account-status account-status-${statusClass}">${status}</span>
      </div>
      <p class="account-order-items">${items}</p>
      <p class="account-order-total">${Store.formatPrice(order.total)}</p>
    `;
    list.appendChild(row);
  });
})();
