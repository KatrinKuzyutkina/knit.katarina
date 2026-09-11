const form = document.getElementById("custom-order-form");
const status = document.getElementById("custom-status");
const user = Store.getUser();

if (user) {
  form.name.value = user.name || "";
  form.email.value = user.email || "";
  form.phone.value = user.phone || "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!Store.getUser()) {
    window.location.href =
      "login.html?next=" + encodeURIComponent("custom-order.html");
    return;
  }

  const data = new FormData(form);
  Store.addCustomRequest({
    id: "REQ-" + Date.now(),
    createdAt: new Date().toISOString(),
    userEmail: Store.getUser().email,
    name: data.get("name"),
    email: data.get("email"),
    phone: data.get("phone"),
    type: data.get("type"),
    materials: data.get("materials"),
    description: data.get("description"),
    status: "новая",
  });

  form.reset();
  if (Store.getUser()) {
    form.name.value = Store.getUser().name || "";
    form.email.value = Store.getUser().email || "";
    form.phone.value = Store.getUser().phone || "";
  }
  status.hidden = false;
  status.textContent = "Заявка отправлена. Мастер свяжется с вами.";
});
