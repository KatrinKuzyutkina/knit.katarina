const params = new URLSearchParams(window.location.search);
const next = params.get("next") || "account.html";

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(loginForm);
    const result = Store.login(data.get("email"), data.get("password"));
    const error = document.getElementById("login-error");
    if (!result.ok) {
      error.hidden = false;
      error.textContent = result.error;
      return;
    }
    const user = Store.getUser();
    if (user.role === "admin") {
      window.location.href = next.includes("admin") ? next : "admin/index.html";
    } else {
      window.location.href = next;
    }
  });
}

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(registerForm);
    const result = Store.register({
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      password: data.get("password"),
    });
    const error = document.getElementById("register-error");
    if (!result.ok) {
      error.hidden = false;
      error.textContent = result.error;
      return;
    }
    window.location.href = "account.html";
  });
}
