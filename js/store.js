const PRODUCTS = [
  {
    id: 10,
    name: "Зайка в комбинезоне",
    category: "Зайки",
    color: "пыльная роза",
    price: 1700,
    tone: "#d4a8ad",
    size: "Рост 28 см",
    image: "images/bunny-overalls-1.jpg",
    images: [
      "images/bunny-overalls-1.jpg",
      "images/bunny-overalls-2.png",
      "images/bunny-overalls-3.jpg",
    ],
    description:
      "Мягкая плюшевая зайка ручной работы в уютном комбинезоне. Доступна в двух вариантах: в берете или с повязкой. Отличный подарок ребёнку или украшение для уютного интерьера — каждый зайка создаётся вручную и с вниманием к деталям.",
  },
  {
    id: 13,
    name: "Зайка Ромео",
    category: "Зайки",
    color: "бежевый",
    price: 1300,
    tone: "#d4b896",
    size: "Рост 20 см",
    yarn: "полухлопковая",
    image: "images/bunny-romeo.jpg",
    images: ["images/bunny-romeo.jpg"],
    description:
      "Милый вязаный зайка Ромео ручной работы — в шортиках на лямках и белых башмачках. Тёплый подарок с характером, связанный с вниманием к деталям.",
  },
  {
    id: 5,
    name: "Зайка в платье",
    category: "Зайки",
    color: "пыльная роза",
    price: 1700,
    tone: "#d4a8ad",
    size: "Рост 28 см",
    image: "images/bunny-dress-1.jpg",
    images: [
      "images/bunny-dress-1.jpg",
      "images/bunny-dress-2.png",
    ],
    description:
      "Мягкая плюшевая зайка ручной работы в нарядном платье. Платье связано крючком — с лёгкой юбкой и оборками. Отличный подарок ребёнку или украшение для уютного интерьера — каждый зайка создаётся вручную и с вниманием к деталям.",
  },
  {
    id: 16,
    name: "Зайка в платье",
    category: "Зайки",
    color: "кремовый",
    price: 1700,
    tone: "#e8a0a0",
    size: "Рост 27 см",
    image: "images/bunny-dress-knit.jpg",
    images: ["images/bunny-dress-knit.jpg"],
    description:
      "Мягкая плюшевая зайка ручной работы в нарядном платье. Платье связано спицами — с белыми сердечками, повязкой и башмачками в тон. Отличный подарок ребёнку или украшение для уютного интерьера — каждый зайка создаётся вручную и с вниманием к деталям.",
  },
  {
    id: 17,
    name: "Мишка",
    category: "Мишки",
    color: "кремовый",
    price: 1700,
    tone: "#efe0cc",
    size: "Рост 30 см",
    image: "images/bear.jpg",
    images: ["images/bear.jpg"],
    description:
      "Мягкий вязаный мишка ручной работы — уютный и очень тактильный. Благодаря шарнирам медвежонок может двигать всеми лапками, садиться и обнимать вас по-настоящему. Доступен в двух вариантах — в комбинезоне или в платье.",
  },
  {
    id: 18,
    name: "Зайка в платье",
    category: "Зайки",
    color: "пыльная роза",
    price: 1700,
    tone: "#d4a8ad",
    size: "Рост 27 см",
    image: "images/bunny-dress-crochet-2.png",
    images: ["images/bunny-dress-crochet-2.png"],
    description:
      "Мягкая плюшевая зайка ручной работы в нарядном платье. Платье связано крючком — с оборками, повязкой и башмачками в тон. Отличный подарок ребёнку или украшение для уютного интерьера — каждый зайка создаётся вручную и с вниманием к деталям.",
  },
  {
    id: 19,
    name: "Оленёнок Ру",
    category: "Новый год",
    color: "бежевый",
    price: 1400,
    tone: "#c9a882",
    size: "Рост 19 см",
    yarn: "полухлопковая",
    image: "images/reindeer-ru.jpg",
    images: ["images/reindeer-ru.jpg"],
    description:
      "Милый вязаный оленёнок Ру — праздничный герой с рожками и полосатым нарядом. Тёплый новогодний подарок, созданный вручную с вниманием к деталям.",
  },
  {
    id: 20,
    name: "Новогодняя игрушка",
    category: "Новый год",
    color: "бежевый",
    price: 1000,
    tone: "#d4b896",
    size: "12 см",
    yarn: "полухлопковая",
    image: "images/newyear-ornament.jpg",
    images: ["images/newyear-ornament.jpg"],
    description:
      "Вязаная игрушка на ёлку ручной работы — уютный праздничный акцент для новогоднего декора.",
  },
  {
    id: 11,
    name: "Снеговик Юкии",
    category: "Новый год",
    color: "кремовый",
    price: 2000,
    tone: "#f0ebe3",
    size: "Рост 18 см",
    yarn: "полухлопковая",
    image: "images/snowman-yukii.jpg",
    images: ["images/snowman-yukii.jpg"],
    description:
      "Милый и добрый зимний друг, связанный вручную.",
  },
  {
    id: 14,
    name: "Новогодний мишка",
    category: "Новый год",
    color: "кремовый",
    price: 1400,
    tone: "#efe0cc",
    size: "Рост 25 см",
    image: "images/newyear-bear.jpg",
    images: ["images/newyear-bear.jpg"],
    description:
      "Милый, плюшевый и такой добрый — создан для зимних вечеров и праздничного настроения.",
  },
  {
    id: 15,
    name: "Зайка в новогоднем костюме",
    category: "Новый год",
    color: "пыльная роза",
    price: 1500,
    tone: "#e8a0a0",
    size: "Рост 27 см",
    image: "images/bunny-newyear.jpg",
    images: ["images/bunny-newyear.jpg"],
    description:
      "Мягкая, тёплая и такая уютная — она будто создана, чтобы дарить атмосферу праздника! Зайка станет отличным подарком для близких, порадует малышей и украсит интерьер в зимние дни.",
  },
  {
    id: 12,
    name: "Жираф",
    category: "Игрушки",
    color: "бежевый",
    price: 2500,
    tone: "#d4b896",
    size: "Рост 21 см (без рожек и ушек)",
    yarn: "полухлопковая",
    image: "images/giraffe-1.jpg",
    images: [
      "images/giraffe-1.jpg",
      "images/giraffe-2.jpg",
    ],
    description:
      "Милый вязаный жираф ручной работы. Тельце можно сделать с пятнышками или без.",
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

  _apiUrl(path) {
    const inAdmin = window.location.pathname.includes("/admin/");
    return `${inAdmin ? "../" : ""}api/${path}`;
  },

  getUser() {
    return this._read("kk_user", null);
  },

  setUser(user) {
    this._write("kk_user", user);
  },

  logout() {
    localStorage.removeItem("kk_user");
    return fetch(this._apiUrl("logout.php"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    }).catch(() => null);
  },

  async register({ name, email, password, phone }) {
    try {
      const response = await fetch(this._apiUrl("register.php"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await response.json();
      if (!data.ok) {
        return { ok: false, error: data.error || "Не удалось зарегистрироваться" };
      }
      this.setUser(data.user);
      return { ok: true, user: data.user };
    } catch {
      // Если PHP-сервер не запущен — сохраняем аккаунт локально, форма на сайте всё равно работает
      return this._registerLocal({ name, email, password, phone });
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(this._apiUrl("login.php"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!data.ok) {
        return { ok: false, error: data.error || "Неверный email или пароль" };
      }
      this.setUser(data.user);
      return { ok: true, user: data.user };
    } catch {
      return this._loginLocal(email, password);
    }
  },

  _getLocalUsers() {
    return this._read("kk_users", []);
  },

  _saveLocalUsers(users) {
    this._write("kk_users", users);
  },

  _registerLocal({ name, email, password, phone }) {
    const users = this._getLocalUsers();
    if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
      return { ok: false, error: "Пользователь с таким email уже есть" };
    }
    const user = {
      id: Date.now(),
      name,
      email: String(email).toLowerCase(),
      password,
      phone: phone || "",
      role: "user",
    };
    users.push(user);
    this._saveLocalUsers(users);
    this.setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    return { ok: true, user: this.getUser() };
  },

  _loginLocal(email, password) {
    const user = this._getLocalUsers().find(
      (u) =>
        u.email.toLowerCase() === String(email).toLowerCase() &&
        u.password === password
    );
    if (!user) {
      return { ok: false, error: "Неверный email или пароль" };
    }
    this.setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    });
    return { ok: true, user: this.getUser() };
  },

  async refreshUser() {
    try {
      const response = await fetch(this._apiUrl("me.php"), { credentials: "include" });
      const data = await response.json();
      if (data.ok && data.user) {
        this.setUser(data.user);
        return data.user;
      }
      this.logoutLocal();
      return null;
    } catch {
      return this.getUser();
    }
  },

  logoutLocal() {
    localStorage.removeItem("kk_user");
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
