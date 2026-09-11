if (!Store.requireAuth("account.html")) {
  /* redirect */
} else {
  const user = Store.getUser();

  if (user.role === "admin") {
    window.location.href = "admin/index.html";
  } else {
    document.getElementById("profile-info").innerHTML = `
      <p><strong>Имя:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Телефон:</strong> ${user.phone || "не указан"}</p>
    `;

    document.getElementById("logout-btn").addEventListener("click", () => {
      Store.logout();
      window.location.href = "home.html";
    });

    const orders = Store.getOrders().filter((o) => o.userEmail === user.email);
    const list = document.getElementById("orders-list");
    const empty = document.getElementById("orders-empty");

    empty.hidden = orders.length > 0;

    orders.forEach((order) => {
      const row = document.createElement("article");
      row.className = "list-row list-row-plain";
      const items = order.items.map((i) => i.name).join(", ");
      row.innerHTML = `
        <div class="list-row-body">
          <h2>${order.id}</h2>
          <p>${new Date(order.createdAt).toLocaleString("ru-RU")}</p>
          <p>${items}</p>
          <p><strong>${Store.formatPrice(order.total)}</strong> · статус: ${order.status}</p>
        </div>
      `;
      list.appendChild(row);
    });
  }
}
