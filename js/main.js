document.addEventListener("DOMContentLoaded", () => {
  const user = Store.getUser();
  const accountLink = document.querySelector(".header-account");
  if (accountLink && user) {
    accountLink.textContent = user.role === "admin" ? "Админ" : "Кабинет";
    if (user.role === "admin" && !accountLink.href.includes("admin")) {
      const inAdmin = window.location.pathname.includes("/admin/");
      accountLink.href = inAdmin ? "index.html" : "admin/index.html";
    }
  }
});
