async function apiRequest(path, options = {}) {
  const response = await fetch(`api/${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = { ok: false, error: "Сервер не ответил. Запустите сайт через PHP." };
  }

  if (!response.ok && data && !data.error) {
    data.error = "Ошибка запроса";
  }

  return data;
}

const params = new URLSearchParams(window.location.search);
const next = params.get("next") || "account.html";

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const error = document.getElementById("login-error");
    const data = new FormData(loginForm);
    const result = await Store.login(data.get("email"), data.get("password"));

    if (!result.ok) {
      error.hidden = false;
      error.textContent = result.error || "Не удалось войти";
      return;
    }

    const user = Store.getUser();
    if (user && user.role === "admin") {
      window.location.href = next.includes("admin") ? next : "admin/index.html";
    } else {
      window.location.href = next.includes("admin") ? "account.html" : next;
    }
  });
}

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const error = document.getElementById("register-error");
    const data = new FormData(registerForm);
    const result = await Store.register({
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      password: data.get("password"),
    });

    if (!result.ok) {
      error.hidden = false;
      error.textContent = result.error || "Не удалось зарегистрироваться";
      return;
    }

    window.location.href = "account.html";
  });
}
