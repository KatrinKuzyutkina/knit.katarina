const form = document.getElementById("custom-order-form");
const status = document.getElementById("custom-status");
const typeSelect = document.getElementById("product-type");
const toyOptions = document.getElementById("toy-options");
const examplesPlush = document.getElementById("yarn-examples-plush");
const examplesCotton = document.getElementById("yarn-examples-cotton");
const colorPalette = document.getElementById("color-palette");
const paletteGrid = document.getElementById("palette-grid");
const colorNumber = document.getElementById("color-number");

const PALETTES = {
  плюшевая: [
    { n: 1, tone: "#f2c4b0" },
    { n: 2, tone: "#e8a57a" },
    { n: 3, tone: "#c47a52" },
    { n: 4, tone: "#d4a8ad" },
    { n: 5, tone: "#efe0cc" },
  ],
  полухлопковая: [
    { n: 1, tone: "#d4b896" },
    { n: 2, tone: "#a89b93" },
    { n: 3, tone: "#c9929a" },
    { n: 4, tone: "#8a5e52" },
    { n: 5, tone: "#f5b491" },
  ],
};

const user = Store.getUser();
if (user) {
  form.name.value = user.name || "";
  form.email.value = user.email || "";
  form.phone.value = user.phone || "";
}

function getSelectedYarn() {
  const checked = form.querySelector('input[name="yarn"]:checked');
  return checked ? checked.value : "";
}

function renderPalette(yarn) {
  const colors = PALETTES[yarn] || [];
  paletteGrid.innerHTML = colors
    .map(
      (c) => `
      <figure class="order-photo palette-swatch" style="--tone:${c.tone}">
        <figcaption>Цвет № ${c.n}</figcaption>
      </figure>
    `
    )
    .join("");
}

function updateToyUI() {
  const isToy = typeSelect.value === "игрушка";
  toyOptions.hidden = !isToy;

  if (!isToy) {
    form.querySelectorAll('input[name="yarn"]').forEach((r) => {
      r.checked = false;
    });
    examplesPlush.hidden = true;
    examplesCotton.hidden = true;
    colorPalette.hidden = true;
    colorNumber.value = "";
    colorNumber.required = false;
    return;
  }

  const yarn = getSelectedYarn();
  examplesPlush.hidden = yarn !== "плюшевая";
  examplesCotton.hidden = yarn !== "полухлопковая";

  if (yarn) {
    colorPalette.hidden = false;
    colorNumber.required = true;
    renderPalette(yarn);
  } else {
    colorPalette.hidden = true;
    colorNumber.required = false;
    colorNumber.value = "";
    paletteGrid.innerHTML = "";
  }
}

typeSelect.addEventListener("change", updateToyUI);
form.querySelectorAll('input[name="yarn"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    colorNumber.value = "";
    updateToyUI();
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!Store.getUser()) {
    window.location.href =
      "login.html?next=" + encodeURIComponent("custom-order.html");
    return;
  }

  const data = new FormData(form);
  const type = data.get("type");
  const yarn = data.get("yarn") || "";

  if (type === "игрушка") {
    if (!yarn) {
      status.hidden = false;
      status.classList.add("error");
      status.textContent = "Выберите тип пряжи для игрушки.";
      return;
    }
    if (!String(data.get("colorNumber") || "").trim()) {
      status.hidden = false;
      status.classList.add("error");
      status.textContent = "Укажите номер цвета из палитры.";
      return;
    }
  }

  Store.addCustomRequest({
    id: "REQ-" + Date.now(),
    createdAt: new Date().toISOString(),
    userEmail: Store.getUser().email,
    name: data.get("name"),
    email: data.get("email"),
    phone: data.get("phone"),
    type,
    yarn: type === "игрушка" ? yarn : "",
    colorNumber: type === "игрушка" ? String(data.get("colorNumber")).trim() : "",
    description: data.get("description") || "",
    status: "новая",
  });

  form.reset();
  if (Store.getUser()) {
    form.name.value = Store.getUser().name || "";
    form.email.value = Store.getUser().email || "";
    form.phone.value = Store.getUser().phone || "";
  }
  updateToyUI();
  status.hidden = false;
  status.classList.remove("error");
  status.textContent = "Заявка отправлена. Мастер свяжется с вами.";
});

updateToyUI();
