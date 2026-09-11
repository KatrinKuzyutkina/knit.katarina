const params = new URLSearchParams(window.location.search);
const product = Store.getProduct(params.get("id"));
const root = document.getElementById("product-page");

if (!product) {
  root.innerHTML = `
    <div class="page-head">
      <h1>Товар не найден</h1>
      <p><a class="text-link" href="catalog.html">← Вернуться в каталог</a></p>
    </div>
  `;
} else {
  document.title = `${product.name} — knit.katarina`;
  const fav = Store.isFavorite(product.id);

  root.innerHTML = `
    <a class="text-link back-link" href="catalog.html">← В каталог</a>
    <div class="product-layout">
      <div class="product-media" style="--tone: ${product.tone}" aria-hidden="true"></div>
      <div class="product-info">
        <p class="product-meta">${product.category} · ${product.color}</p>
        <h1>${product.name}</h1>
        <p class="product-price">${Store.formatPrice(product.price)}</p>
        <p class="product-desc">${product.description}</p>
        <p class="product-size"><strong>Размер:</strong> ${product.size}</p>
        <p class="product-unique">Единственный экземпляр</p>
        <div class="product-actions">
          <button type="button" class="btn btn-primary" id="add-cart">В корзину</button>
          <button type="button" class="btn btn-ghost" id="toggle-fav">${fav ? "В избранном" : "В избранное"}</button>
        </div>
        <p class="form-status" id="product-status" hidden></p>
      </div>
    </div>
  `;

  document.getElementById("add-cart").addEventListener("click", () => {
    Store.addToCart(product.id);
    const status = document.getElementById("product-status");
    status.hidden = false;
    status.textContent = "Товар добавлен в корзину";
  });

  document.getElementById("toggle-fav").addEventListener("click", (e) => {
    Store.toggleFavorite(product.id);
    const isFav = Store.isFavorite(product.id);
    e.currentTarget.textContent = isFav ? "В избранном" : "В избранное";
  });
}
