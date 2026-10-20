const grid = document.getElementById("product-grid");
const empty = document.getElementById("catalog-empty");
const countEl = document.getElementById("catalog-count");
const dropdowns = [...document.querySelectorAll(".filter-dropdown")];
const colorChecks = document.querySelectorAll(
  '.filter-dropdown[data-dropdown="color"] input[name="color"]'
);

const COLOR_LABELS = {
  розовый: "Розовый",
  оранжевый: "Оранжевый",
  бежевый: "Бежевый",
  бордовый: "Бордовый",
  белый: "Белый",
  зеленый: "Зелёный",
  красный: "Красный",
};

const filterState = {
  category: "all",
  sort: "default",
};

function getDropdown(name) {
  return dropdowns.find((el) => el.dataset.dropdown === name);
}

function getSelectedColors() {
  return [...colorChecks]
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function updateColorSummary() {
  const dropdown = getDropdown("color");
  if (!dropdown) return;
  const summary = dropdown.querySelector("[data-summary]");
  const selected = getSelectedColors();
  if (selected.length === 0) {
    summary.textContent = "Все цвета";
    return;
  }
  if (selected.length === 1) {
    summary.textContent = COLOR_LABELS[selected[0]] || selected[0];
    return;
  }
  summary.textContent = `Выбрано: ${selected.length}`;
}

function setDropdownOpen(dropdown, open) {
  const toggle = dropdown.querySelector(".filter-dropdown-toggle");
  const menu = dropdown.querySelector(".filter-dropdown-menu");
  dropdown.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  menu.hidden = !open;
}

function closeAllDropdowns(except) {
  dropdowns.forEach((dropdown) => {
    if (dropdown !== except) {
      setDropdownOpen(dropdown, false);
    }
  });
}

function setSingleValue(name, value, label) {
  filterState[name] = value;
  const dropdown = getDropdown(name);
  if (!dropdown) return;

  const summary = dropdown.querySelector("[data-summary]");
  summary.textContent = label;

  dropdown.querySelectorAll(".filter-option[data-value]").forEach((option) => {
    const selected = option.dataset.value === value;
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-selected", selected ? "true" : "false");
  });
}

function productColors(item) {
  if (Array.isArray(item.colors) && item.colors.length) {
    return item.colors;
  }
  return item.color ? [item.color] : [];
}

function getFilteredProducts() {
  const category = filterState.category;
  const selectedColors = getSelectedColors();
  const sort = filterState.sort;

  let list = Store.getProducts().filter((item) => {
    const cats = Array.isArray(item.categories)
      ? item.categories
      : [item.category];
    const byCategory = category === "all" || cats.includes(category);
    const itemColors = productColors(item);
    const byColor =
      selectedColors.length === 0 ||
      selectedColors.some((color) => itemColors.includes(color));
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
    list.length === 0
      ? "Ничего не найдено"
      : list.length === 1
        ? "1 изделие"
        : `Найдено: ${list.length}`;

  empty.hidden = list.length > 0;
  grid.innerHTML = "";
  updateColorSummary();

  list.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "product-card";
    article.style.setProperty("--delay", `${index * 50}ms`);
    const isFav = Store.isFavorite(item.id);
    const mediaContent = item.image
      ? `<img src="${item.image}" alt="${item.name}" loading="lazy" />`
      : "";
    article.innerHTML = `
      <a class="product-card-link" href="product.html?id=${item.id}">
        <div class="product-card-media${item.image ? " has-image" : ""}" style="--tone: ${item.tone}">
          ${mediaContent}
          <span class="product-card-badge">1 шт.</span>
        </div>
        <div class="product-card-body">
          <h2 class="product-card-title">${item.name}</h2>
          <div class="product-card-footer">
            <p class="product-card-price">${Store.formatPrice(item.price)}</p>
            <span class="product-card-more">Смотреть</span>
          </div>
        </div>
      </a>
      <button
        type="button"
        class="product-card-fav${isFav ? " is-active" : ""}"
        data-fav="${item.id}"
        aria-label="${isFav ? "Убрать из избранного" : "Добавить в избранное"}"
        title="Избранное"
      >♡</button>
    `;
    grid.appendChild(article);
  });

  grid.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!Store.getUser()) {
        if (typeof showNeedAuth === "function") {
          showNeedAuth(
            "Чтобы добавить игрушку в избранное, сначала войдите в аккаунт.",
            "catalog.html"
          );
        }
        return;
      }

      const result = await Store.toggleFavorite(btn.dataset.fav);
      if (!result.ok) {
        return;
      }
      btn.classList.toggle("is-active", result.isFavorite);
      btn.setAttribute(
        "aria-label",
        result.isFavorite ? "Убрать из избранного" : "Добавить в избранное"
      );
    });
  });
}

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector(".filter-dropdown-toggle");
  const menu = dropdown.querySelector(".filter-dropdown-menu");
  const name = dropdown.dataset.dropdown;

  toggle.addEventListener("click", () => {
    const willOpen = menu.hidden;
    closeAllDropdowns(dropdown);
    setDropdownOpen(dropdown, willOpen);
  });

  if (name === "color") {
    colorChecks.forEach((input) => {
      input.addEventListener("change", renderProducts);
    });
    return;
  }

  menu.querySelectorAll(".filter-option[data-value]").forEach((option) => {
    option.addEventListener("click", () => {
      setSingleValue(name, option.dataset.value, option.textContent.trim());
      setDropdownOpen(dropdown, false);
      renderProducts();
    });
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".filter-dropdown")) {
    closeAllDropdowns();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllDropdowns();
  }
});

(async function initCatalog() {
  // Сначала рисуем каталог, избранное подтягиваем в фоне — иначе API может подвесить страницу
  renderProducts();
  if (Store.getUser() && Store.loadFavorites) {
    try {
      await Store.loadFavorites();
      renderProducts();
    } catch {
      /* оставляем уже отрисованный каталог */
    }
  }
})();
