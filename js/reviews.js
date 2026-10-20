const reviewsList = document.getElementById("reviews-list");
const reviewsEmpty = document.getElementById("reviews-empty");
const reviewsSummary = document.getElementById("reviews-summary");
const reviewsStatus = document.getElementById("reviews-status");
const reviewForm = document.getElementById("review-form");
const reviewGate = document.getElementById("review-gate");
const reviewStatus = document.getElementById("review-status");
const photoInput = document.getElementById("review-photos");
const photoPreview = document.getElementById("review-photo-preview");
const photoHint = document.getElementById("review-photo-hint");
const photoCount = document.getElementById("review-file-count");

const MAX_REVIEW_PHOTOS = 4;
let selectedPhotos = [];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function starsText(rating) {
  const value = Math.max(1, Math.min(5, Number(rating) || 5));
  return "★".repeat(value) + "☆".repeat(5 - value);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function reviewPhotos(review) {
  if (Array.isArray(review.photos)) {
    return review.photos.filter((p) => typeof p === "string" && p);
  }
  return review.photo ? [review.photo] : [];
}

function renderReviews(list) {
  const reviews = Array.isArray(list) ? list : [];
  const user = typeof Store !== "undefined" ? Store.getUser() : null;

  reviewsSummary.textContent = reviews.length
    ? `Всего отзывов: ${reviews.length} · средняя оценка ${(
        reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length
      ).toFixed(1)} из 5`
    : "";

  reviewsEmpty.hidden = reviews.length > 0;
  reviewsList.innerHTML = reviews
    .map((review) => {
      const name = review.authorName || "Покупатель";
      const initial = escapeHtml(name.trim().charAt(0).toUpperCase() || "К");
      const photos = reviewPhotos(review);
      const isOwn = user && Number(review.userId) === Number(user.id);
      return `
        <article class="review-card">
          <header class="review-card-head">
            <span class="review-avatar" aria-hidden="true">${initial}</span>
            <div class="review-card-meta">
              <strong>${escapeHtml(name)}</strong>
              <span>${escapeHtml(formatDate(review.createdAt))}</span>
            </div>
            <span class="review-stars" aria-label="Оценка ${Number(review.rating) || 5} из 5">${starsText(review.rating)}</span>
          </header>
          ${
            review.item
              ? `<p class="review-item">Заказ: ${escapeHtml(review.item)}</p>`
              : ""
          }
          <p class="review-text">${escapeHtml(review.text)}</p>
          ${
            photos.length
              ? `<div class="review-photos">${photos
                  .map(
                    (src, photoIndex) =>
                      `<img src="${escapeHtml(src)}" alt="Фото к отзыву, нажмите чтобы увеличить" loading="lazy" data-review-photo="${photoIndex}" title="Нажмите, чтобы увеличить" />`
                  )
                  .join("")}</div>`
              : ""
          }
          ${
            isOwn
              ? `<div class="review-actions">
                   <button type="button" class="btn btn-ghost btn-small review-delete" data-delete-review="${escapeHtml(review.id)}">Удалить мой отзыв</button>
                 </div>`
              : ""
          }
        </article>
      `;
    })
    .join("");
}

function updateFormVisibility() {
  const user = typeof Store !== "undefined" ? Store.getUser() : null;
  reviewForm.hidden = !user;
  reviewGate.hidden = Boolean(user);
}

function showStatus(message, isError) {
  reviewStatus.hidden = false;
  reviewStatus.textContent = message;
  reviewStatus.classList.toggle("error", Boolean(isError));
}

function showListStatus(message, isError) {
  reviewsStatus.hidden = false;
  reviewsStatus.textContent = message;
  reviewsStatus.classList.toggle("error", Boolean(isError));
}

/* --- Фото к отзыву: сжимаем, чтобы не переполнить хранилище --- */

function processPhotoFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxSide = 1000;
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height || 1));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Не удалось прочитать фото"));
    };
    img.src = url;
  });
}

function renderPhotoPreview() {
  if (photoCount) {
    photoCount.hidden = selectedPhotos.length === 0;
    photoCount.textContent = selectedPhotos.length
      ? `Выбрано: ${selectedPhotos.length}`
      : "";
  }
  photoPreview.hidden = selectedPhotos.length === 0;
  photoPreview.innerHTML = selectedPhotos
    .map(
      (src, index) => `
        <span class="review-photo-thumb">
          <img src="${src}" alt="Выбранное фото ${index + 1}" />
          <button type="button" data-remove-photo="${index}" aria-label="Убрать фото ${index + 1}">×</button>
        </span>
      `
    )
    .join("");
}

photoPreview.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-remove-photo]");
  if (!btn) return;
  selectedPhotos.splice(Number(btn.dataset.removePhoto), 1);
  renderPhotoPreview();
});

photoInput.addEventListener("change", async () => {
  const files = [...(photoInput.files || [])];
  photoInput.value = "";
  if (!files.length) return;

  const notes = [];
  for (const file of files) {
    if (selectedPhotos.length >= MAX_REVIEW_PHOTOS) {
      notes.push(`Можно прикрепить не больше ${MAX_REVIEW_PHOTOS} фото.`);
      break;
    }
    if (!file.type.startsWith("image/")) {
      notes.push(`«${file.name}» — не картинка, пропущено.`);
      continue;
    }
    if (file.size > 8 * 1024 * 1024) {
      notes.push(`«${file.name}» слишком большое (больше 8 МБ), пропущено.`);
      continue;
    }
    try {
      selectedPhotos.push(await processPhotoFile(file));
    } catch {
      notes.push(`Не удалось загрузить «${file.name}».`);
    }
  }

  renderPhotoPreview();
  photoHint.hidden = notes.length === 0;
  photoHint.textContent = notes.join(" ");
});

/* --- Открытие фото опубликованного отзыва --- */

const lightbox = document.getElementById("photo-lightbox");
const lightboxImg = document.getElementById("photo-lightbox-img");
const lightboxCounter = document.getElementById("photo-lightbox-counter");
const lightboxPrev = document.getElementById("photo-lightbox-prev");
const lightboxNext = document.getElementById("photo-lightbox-next");
const lightboxClose = document.getElementById("photo-lightbox-close");

let lightboxPhotos = [];
let lightboxIndex = 0;

function showLightboxPhoto() {
  lightboxImg.src = lightboxPhotos[lightboxIndex] || "";
  lightboxCounter.textContent =
    lightboxPhotos.length > 1
      ? `${lightboxIndex + 1} из ${lightboxPhotos.length}`
      : "";
  const hasMany = lightboxPhotos.length > 1;
  lightboxPrev.hidden = !hasMany;
  lightboxNext.hidden = !hasMany;
}

function openLightbox(photos, index) {
  lightboxPhotos = photos;
  lightboxIndex = index;
  showLightboxPhoto();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = "";
  lightboxPhotos = [];
  document.body.style.overflow = "";
}

function stepLightbox(step) {
  if (lightboxPhotos.length < 2) return;
  lightboxIndex =
    (lightboxIndex + step + lightboxPhotos.length) % lightboxPhotos.length;
  showLightboxPhoto();
}

reviewsList.addEventListener("click", (event) => {
  const img = event.target.closest("[data-review-photo]");
  if (!img) return;
  const container = img.closest(".review-photos");
  const photos = container
    ? [...container.querySelectorAll("[data-review-photo]")].map((el) => el.src)
    : [img.src];
  openLightbox(photos, Number(img.dataset.reviewPhoto) || 0);
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => stepLightbox(-1));
lightboxNext.addEventListener("click", () => stepLightbox(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") stepLightbox(-1);
  if (event.key === "ArrowRight") stepLightbox(1);
});

/* --- Удаление только своего отзыва --- */

reviewsList.addEventListener("click", async (event) => {
  const btn = event.target.closest("[data-delete-review]");
  if (!btn) return;

  if (!window.confirm("Удалить ваш отзыв?")) return;

  btn.disabled = true;
  const result = await Store.deleteReview(btn.dataset.deleteReview);
  if (!result.ok) {
    showListStatus(result.error || "Не удалось удалить отзыв", true);
    btn.disabled = false;
    return;
  }
  renderReviews(result.reviews || Store.getReviews());
  showListStatus("Ваш отзыв удалён.", false);
});

/* --- Отправка отзыва --- */

reviewForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!Store.getUser()) {
    updateFormVisibility();
    if (typeof showNeedAuth === "function") {
      showNeedAuth("Чтобы оставить отзыв, сначала войдите в аккаунт.", "reviews.html");
    }
    return;
  }

  const data = new FormData(reviewForm);
  const result = await Store.addReview({
    rating: data.get("rating"),
    item: data.get("item"),
    text: data.get("text"),
    photos: selectedPhotos,
  });

  if (!result.ok) {
    showStatus(result.error || "Не удалось отправить отзыв", true);
    updateFormVisibility();
    return;
  }

  reviewForm.reset();
  const five = document.getElementById("star5");
  if (five) five.checked = true;
  selectedPhotos = [];
  renderPhotoPreview();
  photoHint.hidden = true;
  renderReviews(result.reviews || Store.getReviews());
  showStatus(result.warning || "Спасибо! Ваш отзыв опубликован.", false);
});

(async function initReviews() {
  // Сначала показываем то, что есть локально — читать могут и гости
  renderReviews(Store.getReviews());
  updateFormVisibility();

  try {
    const reviews = await Store.loadReviews();
    renderReviews(reviews);
  } catch {
    /* остаёмся на локальном списке */
  }

  if (Store.refreshUser) {
    Store.refreshUser()
      .then(() => {
        updateFormVisibility();
        renderReviews(Store.getReviews());
      })
      .catch(() => {});
  }
})();
