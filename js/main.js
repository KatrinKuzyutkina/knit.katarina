function initSiteNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav") || document.querySelector(".site-header .nav");
  if (!toggle || !nav) return;

  if (!nav.id) nav.id = "site-nav";
  toggle.setAttribute("aria-controls", nav.id);

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
  });
}

function updateAccountLinks(user) {
  const accountLinks = document.querySelectorAll(".header-account");
  accountLinks.forEach((accountLink) => {
    if (!user) return;
    accountLink.textContent = user.role === "admin" ? "Админ" : "Кабинет";
    if (user.role === "admin" && !accountLink.href.includes("admin")) {
      const inAdmin = window.location.pathname.includes("/admin/");
      accountLink.href = inAdmin ? "index.html" : "admin/index.html";
    }
  });
}

function renderHomeAnnouncements() {
  const announcementsRoot = document.getElementById("home-announcements");
  const announcementsList = document.getElementById("home-announcements-list");
  if (!announcementsRoot || !announcementsList || !Store.getAnnouncements) return;
  const items = Store.getAnnouncements().filter((item) => item.published !== false);
  if (!items.length) return;
  announcementsRoot.hidden = false;
  announcementsList.innerHTML = items
    .map(
      (item) => `
        <article class="home-announcement">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initSiteNav();

  if (typeof Store === "undefined") return;

  if (Store.ensureLocalAdmin) {
    Store.ensureLocalAdmin();
  }

  updateAccountLinks(Store.getUser());
  renderHomeAnnouncements();

  if (Store.refreshUser) {
    Store.refreshUser()
      .then((user) => updateAccountLinks(user || Store.getUser()))
      .catch(() => {});
  }
});

window.showNeedAuth = function showNeedAuth(message, nextPage) {
  let toast = document.getElementById("auth-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "auth-toast";
    toast.className = "auth-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  const next = nextPage || window.location.pathname.split("/").pop() || "home.html";
  toast.innerHTML = `
    <p>${message || "Сначала войдите в аккаунт."}</p>
    <a class="btn btn-primary btn-small" href="login.html?next=${encodeURIComponent(next)}">Войти</a>
  `;
  toast.hidden = false;
  toast.classList.add("is-visible");

  clearTimeout(showNeedAuth._timer);
  showNeedAuth._timer = setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.hidden = true;
  }, 5000);
};