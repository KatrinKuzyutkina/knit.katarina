const form = document.getElementById("custom-order-form");
const status = document.getElementById("custom-status");
const authGate = document.getElementById("auth-gate");
const content = document.getElementById("order-content");
const loginBtn = document.getElementById("auth-gate-login");
const submitBtn = document.getElementById("order-submit-btn");
const orderTitle = document.querySelector(".order-intro h1");
const orderLead = document.querySelector(".order-lead");

const ideaSection = document.getElementById("idea-section");
const deadlineSection = document.getElementById("deadline-section");
const yarnSection = document.getElementById("yarn-section");
const paletteSection = document.getElementById("palette-section");
const submitWrap = document.getElementById("order-submit");
const deadlineDateWrap = document.getElementById("deadline-date-wrap");
const deadlineDate = document.getElementById("deadline-date");
const paletteGrid = document.getElementById("palette-grid");
const paletteNote = document.getElementById("palette-note");
const colorNumber = document.getElementById("color-number");
const colorNumberWrap = document.getElementById("color-number-wrap");
const flowerColors = document.getElementById("flower-colors");
const flowerColorsWrap = document.getElementById("flower-colors-wrap");
const photoInput = document.getElementById("order-photo");
const photoPreview = document.getElementById("photo-preview");
const photoPreviewImg = document.getElementById("photo-preview-img");
const photoClear = document.getElementById("photo-clear");
const descriptionField = document.getElementById("order-description");
const photoLabel = document.getElementById("order-photo-label");

const PLUSH_PALETTE_IMAGES = [
  "images/palette-plush/1.png",
  "images/palette-plush/2.png",
  "images/palette-plush/3.png",
  "images/palette-plush/4.png",
  "images/palette-plush/5.png",
];

const COTTON_PALETTE_IMAGES = [
  "images/palette-cotton/1.png",
  "images/palette-cotton/2.png",
  "images/palette-cotton/3.png",
  "images/palette-cotton/4.png",
  "images/palette-cotton/5.png",
  "images/palette-cotton/6.png",
];

let photoDataUrl = "";
let lastRenderedYarn = "";
let editingId = "";
let editingCreatedAt = "";
let editingStatus = "создана";

function getSelected(name) {
  const checked = form.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : "";
}

function setRadio(name, value) {
  const input = form.querySelector(`input[name="${name}"][value="${value}"]`);
  if (input) {
    input.checked = true;
  }
}

function renderPalette(yarn) {
  if (yarn === lastRenderedYarn && paletteGrid.innerHTML) {
    return;
  }
  lastRenderedYarn = yarn;
  const isBouquet = getSelected("type") === "букет цветов";

  if (yarn === "плюшевая") {
    paletteNote.textContent =
      "Палитра плюшевой пряжи Himalaya Dolphin Baby — выберите цвет и впишите его номер.";
    colorNumber.placeholder = "Например: 80301";
    paletteGrid.className = "palette-boards";
    paletteGrid.innerHTML = PLUSH_PALETTE_IMAGES.map(
      (src, index) => `
        <figure class="palette-board">
          <img src="${src}" alt="Палитра плюшевой пряжи Himalaya Dolphin Baby, лист ${index + 1}" loading="lazy" />
        </figure>
      `
    ).join("");
    return;
  }

  if (yarn === "полухлопковая") {
    paletteNote.textContent = isBouquet
      ? "Палитра полухлопковой пряжи YarnArt Jeans. Выберите цвета и пропишите для каждого цветка, какого цвета он будет."
      : "Палитра полухлопковой пряжи YarnArt Jeans — выберите цвет и впишите его номер.";
    colorNumber.placeholder = "Например: 62";
    paletteGrid.className = "palette-boards";
    paletteGrid.innerHTML = COTTON_PALETTE_IMAGES.map(
      (src, index) => `
        <figure class="palette-board">
          <img src="${src}" alt="Палитра полухлопковой пряжи YarnArt Jeans, лист ${index + 1}" loading="lazy" />
        </figure>
      `
    ).join("");
  }
}

function setPhotoPreview(dataUrl) {
  photoDataUrl = dataUrl || "";
  if (photoDataUrl) {
    photoPreviewImg.src = photoDataUrl;
    photoPreview.hidden = false;
    photoLabel.textContent = "Заменить фото";
  } else {
    photoPreview.hidden = true;
    photoPreviewImg.removeAttribute("src");
    photoLabel.textContent = "Прикрепить фото";
  }
}

function fillFormFromRequest(req) {
  editingId = req.id;
  editingCreatedAt = req.createdAt || new Date().toISOString();
  editingStatus = req.status || "создана";

  if (orderTitle) {
    orderTitle.textContent = "Редактирование заявки";
  }
  if (orderLead) {
    orderLead.textContent =
      "Измените нужные поля и сохраните заявку. Контакты по-прежнему берутся из кабинета.";
  }
  submitBtn.textContent = "Сохранить изменения";

  if (req.type) {
    setRadio("type", req.type);
  }
  descriptionField.value = req.description || "";
  setPhotoPreview(req.photo || "");

  if (req.deadlineMode) {
    setRadio("deadlineMode", req.deadlineMode);
  }
  if (req.deadlineMode === "date" && req.deadlineDate) {
    deadlineDate.value = req.deadlineDate;
  }

  if (req.type === "игрушка" && req.yarn) {
    setRadio("yarn", req.yarn);
    colorNumber.value = req.colorNumber || "";
  }

  if (req.type === "букет цветов") {
    flowerColors.value = req.flowerColors || req.colorNumber || "";
  }
}

function updateUI() {
  const type = getSelected("type");
  const deadlineMode = getSelected("deadlineMode");
  const yarn = getSelected("yarn");
  const isToy = type === "игрушка";
  const isBouquet = type === "букет цветов";
  const hasType = isToy || isBouquet;

  ideaSection.hidden = !hasType;
  deadlineSection.hidden = !hasType;
  yarnSection.hidden = !isToy;

  if (hasType) {
    descriptionField.placeholder = isToy
      ? "Какая игрушка нужна: размер, образ, детали…"
      : "Какой букет нужен: состав, размер, повод…";
  }

  const deadlineOk =
    deadlineMode === "ready" ||
    (deadlineMode === "date" && Boolean(deadlineDate.value));

  deadlineDateWrap.hidden = deadlineMode !== "date";
  deadlineDate.required = deadlineMode === "date";
  if (deadlineMode !== "date") {
    deadlineDate.value = "";
  }

  if (isToy) {
    colorNumberWrap.hidden = false;
    flowerColorsWrap.hidden = true;
    flowerColors.required = false;

    if (yarn) {
      paletteSection.hidden = false;
      colorNumber.required = true;
      renderPalette(yarn);
    } else {
      paletteSection.hidden = true;
      colorNumber.required = false;
      colorNumber.value = "";
      paletteGrid.innerHTML = "";
      lastRenderedYarn = "";
    }
  } else if (isBouquet) {
    form.querySelectorAll('input[name="yarn"]').forEach((r) => {
      r.checked = false;
    });
    colorNumberWrap.hidden = true;
    colorNumber.required = false;
    colorNumber.value = "";
    flowerColorsWrap.hidden = false;
    flowerColors.required = true;

    if (deadlineOk) {
      paletteSection.hidden = false;
      // Чтобы текст подсказки обновился при смене типа
      if (lastRenderedYarn === "полухлопковая") {
        lastRenderedYarn = "";
      }
      renderPalette("полухлопковая");
    } else {
      paletteSection.hidden = true;
      paletteGrid.innerHTML = "";
      lastRenderedYarn = "";
    }
  } else {
    paletteSection.hidden = true;
    colorNumberWrap.hidden = false;
    flowerColorsWrap.hidden = true;
    colorNumber.required = false;
    flowerColors.required = false;
    paletteGrid.innerHTML = "";
    lastRenderedYarn = "";
  }

  const yarnOk = isToy
    ? Boolean(yarn) && String(colorNumber.value || "").trim()
    : isBouquet
      ? String(flowerColors.value || "").trim()
      : false;
  const ideaOk =
    String(descriptionField.value || "").trim().length > 0 ||
    Boolean(photoDataUrl);

  const canSubmit = hasType && deadlineOk && yarnOk && ideaOk;
  submitWrap.hidden = !canSubmit;
}

function clearPhoto() {
  photoInput.value = "";
  setPhotoPreview("");
  updateUI();
}

photoInput.addEventListener("change", () => {
  const file = photoInput.files && photoInput.files[0];
  if (!file) {
    clearPhoto();
    return;
  }

  if (file.size > 2.5 * 1024 * 1024) {
    status.hidden = false;
    status.classList.add("error");
    status.textContent = "Фото слишком большое. Максимум около 2.5 МБ.";
    clearPhoto();
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    setPhotoPreview(String(reader.result || ""));
    status.hidden = true;
    updateUI();
  };
  reader.readAsDataURL(file);
});

photoClear.addEventListener("click", clearPhoto);

form.querySelectorAll('input[name="type"]').forEach((el) => {
  el.addEventListener("change", () => {
    status.hidden = true;
    updateUI();
  });
});
form.querySelectorAll('input[name="deadlineMode"]').forEach((el) => {
  el.addEventListener("change", () => {
    if (getSelected("deadlineMode") !== "date") {
      deadlineDate.value = "";
    }
    updateUI();
  });
});
form.querySelectorAll('input[name="yarn"]').forEach((el) => {
  el.addEventListener("change", () => {
    colorNumber.value = "";
    lastRenderedYarn = "";
    updateUI();
  });
});
deadlineDate.addEventListener("change", updateUI);
descriptionField.addEventListener("input", updateUI);
colorNumber.addEventListener("input", updateUI);
flowerColors.addEventListener("input", updateUI);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = Store.getUser();
  if (!user) {
    window.location.href =
      "login.html?next=" + encodeURIComponent("custom-order.html");
    return;
  }

  const data = new FormData(form);
  const type = String(data.get("type") || "");
  const yarn = String(data.get("yarn") || "");
  const deadlineMode = String(data.get("deadlineMode") || "");
  const description = String(data.get("description") || "").trim();
  const color = String(data.get("colorNumber") || "").trim();
  const flowers = String(data.get("flowerColors") || "").trim();

  if (!description && !photoDataUrl) {
    status.hidden = false;
    status.classList.add("error");
    status.textContent = "Добавьте описание или фото.";
    return;
  }

  if (deadlineMode === "date" && !deadlineDate.value) {
    status.hidden = false;
    status.classList.add("error");
    status.textContent = "Выберите дату в календаре.";
    return;
  }

  if (type === "игрушка") {
    if (!yarn) {
      status.hidden = false;
      status.classList.add("error");
      status.textContent = "Выберите тип пряжи.";
      return;
    }
    if (!color) {
      status.hidden = false;
      status.classList.add("error");
      status.textContent = "Укажите номер пряжи из палитры.";
      return;
    }
  }

  if (type === "букет цветов" && !flowers) {
    status.hidden = false;
    status.classList.add("error");
    status.textContent =
      "Укажите цвета для каждого цветка по номерам из палитры.";
    return;
  }

  const payload = {
    userEmail: user.email,
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    type,
    yarn:
      type === "игрушка"
        ? yarn
        : type === "букет цветов"
          ? "полухлопковая"
          : "",
    colorNumber: type === "игрушка" ? color : "",
    flowerColors: type === "букет цветов" ? flowers : "",
    description,
    photo: photoDataUrl || "",
    deadlineMode,
    deadlineDate: deadlineMode === "date" ? deadlineDate.value : "",
    status: editingStatus || "создана",
  };

  const saveResult = editingId
    ? Store.updateCustomRequest(editingId, {
        ...payload,
        createdAt: editingCreatedAt,
      })
    : Store.addCustomRequest({
        ...payload,
        id: "REQ-" + Date.now(),
        createdAt: new Date().toISOString(),
      });

  if (!saveResult.ok) {
    status.hidden = false;
    status.classList.add("error");
    status.textContent = saveResult.error || "Не удалось сохранить заявку";
    return;
  }

  if (editingId) {
    window.location.href = "account.html";
    return;
  }

  form.reset();
  editingId = "";
  editingCreatedAt = "";
  editingStatus = "создана";
  clearPhoto();
  updateUI();
  status.hidden = false;
  status.classList.remove("error");
  status.textContent = saveResult.warning
    ? saveResult.warning
    : "Заявка отправлена. Её можно посмотреть в личном кабинете.";
});

(async function initCustomOrder() {
  if (Store.refreshUser) {
    await Store.refreshUser();
  }

  const today = new Date().toISOString().slice(0, 10);
  deadlineDate.min = today;

  const params = new URLSearchParams(window.location.search);
  const editId = params.get("edit") || "";
  const nextUrl = editId
    ? `custom-order.html?edit=${encodeURIComponent(editId)}`
    : "custom-order.html";

  if (!Store.getUser()) {
    content.hidden = true;
    authGate.hidden = false;
    loginBtn.href = "login.html?next=" + encodeURIComponent(nextUrl);
    return;
  }

  authGate.hidden = true;
  content.hidden = false;

  if (editId) {
    const req = Store.getCustomRequest(editId);
    const userEmail = String(Store.getUser().email || "").toLowerCase();
    const ownerEmail = String(req?.userEmail || req?.email || "").toLowerCase();

    if (!req || ownerEmail !== userEmail) {
      status.hidden = false;
      status.classList.add("error");
      status.textContent = "Заявка не найдена или принадлежит другому пользователю.";
      updateUI();
      return;
    }

    fillFormFromRequest(req);
  }

  updateUI();
})();
