(async function initProduct() {
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
    return;
  }

  if (Store.getUser() && Store.loadFavorites) {
    await Store.loadFavorites();
  }

  document.title = `${product.name} — knit.katarina`;
  const fav = Store.isFavorite(product.id);
  const gallery = product.images && product.images.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const mediaHtml = gallery.length
    ? `
      <div class="product-gallery">
        <div class="product-media has-image">
          <img id="product-main-image" src="${gallery[0]}" alt="${product.name}" />
        </div>
        ${
          gallery.length > 1
            ? `<div class="product-thumbs">
                ${gallery
                  .map(
                    (src, i) => `
                  <button type="button" class="product-thumb${i === 0 ? " is-active" : ""}" data-src="${src}" aria-label="Фото ${i + 1}">
                    <img src="${src}" alt="" />
                  </button>`
                  )
                  .join("")}
              </div>`
            : ""
        }
      </div>
    `
    : `<div class="product-media" style="--tone: ${product.tone}" aria-hidden="true"></div>`;

  root.innerHTML = `
    <a class="text-link back-link" href="catalog.html">← В каталог</a>
    <div class="product-layout">
      ${mediaHtml}
      <div class="product-info">
        <p class="product-meta">${product.category}</p>
        <h1>${product.name}</h1>
        <p class="product-price">${Store.formatPrice(product.price)}</p>
        <p class="product-desc">${product.description}</p>
        <p class="product-size"><strong>Размер:</strong> ${product.size}</p>
        <p class="product-unique">Ручная работа · ${product.yarn || "плюшевая"} пряжа</p>
        <div class="product-actions">
          <button type="button" class="btn btn-primary" id="add-cart">В корзину</button>
          <button type="button" class="btn btn-ghost" id="toggle-fav">${fav ? "В избранном" : "В избранное"}</button>
        </div>
        <p class="form-status" id="product-status" hidden></p>
      </div>
    </div>
  `;

  document.getElementById("add-cart").addEventListener("click", () => {
    if (!Store.getUser()) {
      if (typeof showNeedAuth === "function") {
        showNeedAuth(
          "Чтобы добавить товар в корзину, сначала войдите в аккаунт.",
          "product.html?id=" + product.id
        );
      }
      return;
    }

    Store.addToCart(product.id);
    const status = document.getElementById("product-status");
    status.hidden = false;
    status.classList.remove("error");
    status.textContent = "Товар добавлен в корзину";
  });

  document.getElementById("toggle-fav").addEventListener("click", async (e) => {
    if (!Store.getUser()) {
      if (typeof showNeedAuth === "function") {
        showNeedAuth(
          "Чтобы добавить игрушку в избранное, сначала войдите в аккаунт.",
          "product.html?id=" + product.id
        );
      }
      return;
    }

    const result = await Store.toggleFavorite(product.id);
    if (!result.ok) {
      return;
    }
    e.currentTarget.textContent = result.isFavorite
      ? "В избранном"
      : "В избранное";
  });

  const mainImage = document.getElementById("product-main-image");
  document.querySelectorAll(".product-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      if (!mainImage) return;
      mainImage.src = thumb.dataset.src;
      document.querySelectorAll(".product-thumb").forEach((t) => t.classList.remove("is-active"));
      thumb.classList.add("is-active");
    });
  });
})();
