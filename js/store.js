const PRODUCTS = [
  {
    id: 1,
    name: "Корзина из джута",
    category: "интерьер",
    color: "бежевый",
    price: 4200,
    tone: "#d4b896",
    size: "Ø 28 × 22 см",
    description:
      "Плетёная корзина из натурального джута для хранения и декора. Единственный экземпляр ручной работы.",
  },
  {
    id: 2,
    name: "Ваза глиняная «Рассвет»",
    category: "интерьер",
    color: "терракот",
    price: 5800,
    tone: "#c47a52",
    size: "Высота 24 см",
    description:
      "Керамическая ваза с тёплым глиняным оттенком. Подходит для сухоцветов и живых букетов.",
  },
  {
    id: 3,
    name: "Шарф ручной вязки",
    category: "аксессуары",
    color: "пыльная роза",
    price: 3100,
    tone: "#c9929a",
    size: "180 × 30 см",
    description:
      "Мягкий шарф крупной вязки из смесовой пряжи. Тёплый акцент для повседневных образов.",
  },
  {
    id: 4,
    name: "Подсвечник керамический",
    category: "подарки",
    color: "кремовый",
    price: 2600,
    tone: "#efe0cc",
    size: "Высота 9 см",
    description:
      "Минималистичный подсвечник ручной формовки. Уютный подарок к любому поводу.",
  },
  {
    id: 5,
    name: "Плед крупной вязки",
    category: "интерьер",
    color: "серый",
    price: 8900,
    tone: "#a89b93",
    size: "140 × 180 см",
    description:
      "Плотный плед крупной вязки. Добавляет текстуру и тепло интерьеру.",
  },
  {
    id: 6,
    name: "Сумка макраме",
    category: "аксессуары",
    color: "бежевый",
    price: 4700,
    tone: "#c9a882",
    size: "32 × 28 см",
    description:
      "Лёгкая сумка в технике макраме. Уникальный аксессуар на каждый день.",
  },
  {
    id: 7,
    name: "Фигурка «Лиса»",
    category: "подарки",
    color: "терракот",
    price: 3500,
    tone: "#b86b45",
    size: "Высота 14 см",
    description:
      "Декоративная фигурка из керамики. Характерный подарок с настроением мастерской.",
  },
  {
    id: 8,
    name: "Подушка декоративная",
    category: "интерьер",
    color: "пыльная роза",
    price: 3900,
    tone: "#d4a8ad",
    size: "45 × 45 см",
    description:
      "Текстильная подушка с чехлом ручной работы. Мягкий цветовой акцент для дивана.",
  },
  {
    id: 9,
    name: "Брошь керамическая",
    category: "аксессуары",
    color: "кремовый",
    price: 1800,
    tone: "#e8d5bc",
    size: "Ø 4 см",
    description:
      "Небольшая керамическая брошь. Завершает образ тонкой деталью.",
  },
];

const Store = {
  formatPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  },

  getProduct(id) {
    return PRODUCTS.find((item) => item.id === Number(id)) || null;
  },

  getProducts() {
    return [...PRODUCTS];
  },

  _read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  _write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getUser() {
    return this._read("kk_user", null);
  },

  setUser(user) {
    this._write("kk_user", user);
  },

  logout() {
    localStorage.removeItem("kk_user");
  },

  getUsers() {
    return this._read("kk_users", [
      {
        email: "admin@knit.katarina",
        password: "admin",
        name: "Администратор",
        phone: "",
        role: "admin",
      },
    ]);
  },

  saveUsers(users) {
    this._write("kk_users", users);
  },

  register({ name, email, password, phone }) {
    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "Пользователь с таким email уже есть" };
    }
    const user = {
      name,
      email,
      password,
      phone: phone || "",
      role: "user",
    };
    users.push(user);
    this.saveUsers(users);
    this.setUser({ name: user.name, email: user.email, phone: user.phone, role: user.role });
    return { ok: true };
  },

  login(email, password) {
    const user = this.getUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: "Неверный email или пароль" };
    this.setUser({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    });
    return { ok: true, user: this.getUser() };
  },

  getFavorites() {
    return this._read("kk_favorites", []);
  },

  toggleFavorite(id) {
    const list = this.getFavorites();
    const num = Number(id);
    const next = list.includes(num) ? list.filter((x) => x !== num) : [...list, num];
    this._write("kk_favorites", next);
    return next;
  },

  isFavorite(id) {
    return this.getFavorites().includes(Number(id));
  },

  getCart() {
    return this._read("kk_cart", []);
  },

  addToCart(id) {
    const num = Number(id);
    const cart = this.getCart();
    if (!cart.includes(num)) {
      cart.push(num);
      this._write("kk_cart", cart);
    }
    return cart;
  },

  removeFromCart(id) {
    const next = this.getCart().filter((x) => x !== Number(id));
    this._write("kk_cart", next);
    return next;
  },

  clearCart() {
    this._write("kk_cart", []);
  },

  getOrders() {
    return this._read("kk_orders", []);
  },

  addOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    this._write("kk_orders", orders);
    return orders;
  },

  updateOrderStatus(id, status) {
    const orders = this.getOrders().map((o) =>
      o.id === id ? { ...o, status } : o
    );
    this._write("kk_orders", orders);
    return orders;
  },

  getCustomRequests() {
    return this._read("kk_custom_requests", []);
  },

  addCustomRequest(request) {
    const list = this.getCustomRequests();
    list.unshift(request);
    this._write("kk_custom_requests", list);
    return list;
  },

  updateCustomRequestStatus(id, status) {
    const list = this.getCustomRequests().map((r) =>
      r.id === id ? { ...r, status } : r
    );
    this._write("kk_custom_requests", list);
    return list;
  },

  getMessages() {
    return this._read("kk_messages", []);
  },

  addMessage(message) {
    const list = this.getMessages();
    list.unshift(message);
    this._write("kk_messages", list);
    return list;
  },

  requireAuth(redirectTo) {
    if (!this.getUser()) {
      window.location.href = `login.html?next=${encodeURIComponent(redirectTo || "account.html")}`;
      return false;
    }
    return true;
  },

  requireAdmin() {
    const user = this.getUser();
    if (!user || user.role !== "admin") {
      window.location.href = "../login.html?next=" + encodeURIComponent("admin/index.html");
      return false;
    }
    return true;
  },
};
