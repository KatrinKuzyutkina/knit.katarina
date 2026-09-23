const grid = document.getElementById("product-grid");
const empty = document.getElementById("catalog-empty");
const countEl = document.getElementById("catalog-count");
const categorySelect = document.getElementById("filter-category");
const colorSelect = document.getElementById("filter-color");
const sortSelect = document.getElementById("filter-sort");
const chips = document.querySelectorAll(".catalog-chip");

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

function syncChips() {
  chips.forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.category === categorySelect.value);
  });
}

function renderProducts() {
  const list = getFilteredProducts();

  countEl.textContent =
    list.length === 0
      ? "Ничего не найдено"
      : list.length === 1
        ? "1 изделие"
        : `Найдено: ${list.length}`;

  empty.hidden = list.length > 0;
  grid.innerHTML = "";
  syncChips();

  list.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "product-card";
    article.style.setProperty("--delay", `${index * 50}ms`);
    const mediaContent = item.image
      ? `<img src="${item.image}" alt="${item.name}" loading="lazy" />`
      : "";
    article.innerHTML = `
      <a class="product-card-link" href="product.html?id=${item.id}">
        <div class="product-card-media${item.image ? " has-image" : ""}" style="--tone: ${item.tone}">
          ${mediaContent}
          <span class="product-card-badge">1 шт.</span>
          <span class="product-card-category">${item.category}</span>
        </div>
        <div class="product-card-body">
          <h2 class="product-card-title">${item.name}</h2>
          <div class="product-card-footer">
            <p class="product-card-price">${Store.formatPrice(item.price)}</p>
            <span class="product-card-more">Смотреть</span>
          </div>
        </div>
      </a>
    `;
    grid.appendChild(article);
  });
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    categorySelect.value = chip.dataset.category;
    renderProducts();
  });
});

[categorySelect, colorSelect, sortSelect].forEach((el) => {
  el.addEventListener("change", renderProducts);
});

renderProducts();
