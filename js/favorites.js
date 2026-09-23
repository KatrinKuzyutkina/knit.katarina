const grid = document.getElementById("favorites-grid");
const empty = document.getElementById("favorites-empty");

function renderFavorites() {
  const items = Store.getFavorites()
    .map((id) => Store.getProduct(id))
    .filter(Boolean);

  empty.hidden = items.length > 0;
  grid.innerHTML = "";

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "product-card";
    article.innerHTML = `
      <a class="product-card-link" href="product.html?id=${item.id}">
        <div class="product-card-media" style="--tone: ${item.tone}" aria-hidden="true"></div>
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
    btn.addEventListener("click", () => {
      Store.toggleFavorite(btn.dataset.remove);
      renderFavorites();
    });
  });
}

renderFavorites();
