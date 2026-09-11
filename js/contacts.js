const form = document.getElementById("contact-form");
const status = document.getElementById("contact-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  Store.addMessage({
    id: "MSG-" + Date.now(),
    createdAt: new Date().toISOString(),
    name: data.get("name"),
    email: data.get("email"),
    message: data.get("message"),
  });
  form.reset();
  status.hidden = false;
  status.textContent = "Сообщение отправлено. Мы скоро ответим.";
});
