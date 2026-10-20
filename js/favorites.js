const grid = document.getElementById("favorites-grid");
const empty = document.getElementById("favorites-empty");
const authGate = document.getElementById("auth-gate");
const content = document.getElementById("favorites-content");
const loginBtn = document.getElementById("auth-gate-login");

function renderFavorites() {
  const items = Store.getFavorites()
    .map((id) => Store.getProduct(id))
    .filter(Boolean);

  empty.hidden = items.length > 0;
  grid.innerHTML = "";

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "product-card";
    const mediaContent = item.image
      ? `<img src="${item.image}" alt="${item.name}" loading="lazy" />`
      : "";
    article.innerHTML = `
      <a class="product-card-link" href="product.html?id=${item.id}">
        <div class="product-card-media${item.image ? " has-image" : ""}" style="--tone: ${item.tone}">
          ${mediaContent}
        </div>
        <div class="product-card-body">
          <h2 class="product-card-title">${item.name}</h2>
          <p class="product-card-meta">${item.category}</p>
          <p class="product-card-price">${Store.formatPrice(item.price)}</p>
        </div>
      </a>
      <button type="button" class="btn btn-ghost btn-small" data-remove="${item.id}">Убрать</button>
    `;
    grid.appendChild(article);
  });

  grid.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await Store.toggleFavorite(btn.dataset.remove);
      renderFavorites();
    });
  });
}

(async function initFavorites() {
  if (Store.refreshUser) {
    await Store.refreshUser();
  }

  if (!Store.getUser()) {
    content.hidden = true;
    authGate.hidden = false;
    loginBtn.href =
      "login.html?next=" + encodeURIComponent("favorites.html");
    return;
  }

  authGate.hidden = true;
  content.hidden = false;
  await Store.loadFavorites();
  renderFavorites();
})();
