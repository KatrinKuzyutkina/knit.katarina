const grid = document.getElementById("product-grid");
const empty = document.getElementById("catalog-empty");
const countEl = document.getElementById("catalog-count");
const categorySelect = document.getElementById("filter-category");
const colorSelect = document.getElementById("filter-color");
const sortSelect = document.getElementById("filter-sort");

function getFilteredProducts() {
  const category = categorySelect.value;
  const color = colorSelect.value;
  const sort = sortSelect.value;

  let list = Store.getProducts().filter((item) => {
    const byCategory = category === "all" || item.category === category;
    const byColor = color === "all" || item.color === color;
    return byCategory && byColor;
  });

  if (sort === "price-asc") {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    list = [...list].sort((a, b) => b.price - a.price);
  }

  return list;
}

function renderProducts() {
  const list = getFilteredProducts();

  countEl.textContent =
    list.length === 0 ? "Ничего не найдено" : `Найдено: ${list.length}`;

  empty.hidden = list.length > 0;
  grid.innerHTML = "";

  list.forEach((item) => {
    const article = document.createElement("article");
    article.className = "product-card";
    article.innerHTML = `
      <a class="product-card-link" href="product.html?id=${item.id}">
        <div class="product-card-media" style="--tone: ${item.tone}" aria-hidden="true"></div>
        <div class="product-card-body">
          <h2 class="product-card-title">${item.name}</h2>
          <p class="product-card-meta">${item.category} · ${item.color}</p>
          <p class="product-card-price">${Store.formatPrice(item.price)}</p>
        </div>
      </a>
    `;
    grid.appendChild(article);
  });
}

[categorySelect, colorSelect, sortSelect].forEach((el) => {
  el.addEventListener("change", renderProducts);
});

renderProducts();
