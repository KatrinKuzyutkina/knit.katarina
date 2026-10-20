const PRODUCTS = [
  {
    id: 10,
    name: "Зайка в комбинезоне",
    category: "Зайки",
    categories: ["Зайки", "Игрушки"],
    color: "розовый",
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
    categories: ["Зайки", "Игрушки"],
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
    categories: ["Зайки", "Игрушки"],
    color: "розовый",
    price: 1800,
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
    categories: ["Зайки", "Игрушки"],
    color: "бордовый",
    price: 1800,
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
    categories: ["Мишки", "Игрушки"],
    color: "оранжевый",
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
    categories: ["Зайки", "Игрушки"],
    color: "розовый",
    price: 1800,
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
    categories: ["Новый год", "Игрушки"],
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
    categories: ["Новый год", "Игрушки"],
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
    categories: ["Новый год", "Игрушки"],
    color: "белый",
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
    categories: ["Новый год", "Мишки", "Игрушки"],
    color: "зеленый",
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
    categories: ["Новый год", "Зайки", "Игрушки"],
    color: "красный",
    price: 1700,
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
    categories: ["Игрушки"],
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

  async _fetchJson(path, options = {}, timeoutMs = 2500) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(this._apiUrl(path), {
        ...options,
        credentials: options.credentials || "include",
        signal: controller.signal,
      });
      const text = await response.text();
      try {
        return { okHttp: response.ok, status: response.status, data: JSON.parse(text) };
      } catch {
        return null;
      }
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  },

  getUser() {
    return this._read("kk_user", null);
  },

  setUser(user) {
    this._write("kk_user", user);
  },

  logout() {
    // Избранное пользователя в localStorage не трогаем — оно привязано к user.id
    // и подтянется / синхронизируется при следующем входе.
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
      await this.loadFavorites();
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
        const local = this._loginLocal(email, password);
        if (local.ok) {
          return local;
        }
        return { ok: false, error: data.error || "Неверный email или пароль" };
      }
      this.setUser(data.user);
      await this.loadFavorites();
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

  ensureLocalAdmin() {
    const users = this._getLocalUsers();
    const email = "admin@knit.katarina";
    const existing = users.find((u) => u.email.toLowerCase() === email);
    if (!existing) {
      users.push({
        id: 1,
        name: "Катерина",
        email,
        password: "Admin123!",
        phone: "",
        role: "admin",
      });
      this._saveLocalUsers(users);
      return;
    }
    if (existing.role !== "admin") {
      existing.role = "admin";
      this._saveLocalUsers(users);
    }
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
    this.ensureLocalAdmin();
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

  async updateProfile({ name, email, phone, password }) {
    try {
      const response = await fetch(this._apiUrl("profile.php"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password: password || "" }),
      });
      const data = await response.json();
      if (!data.ok) {
        return { ok: false, error: data.error || "Не удалось сохранить" };
      }
      this.setUser(data.user);
      return { ok: true, user: data.user };
    } catch {
      return this._updateProfileLocal({ name, email, phone, password });
    }
  },

  _updateProfileLocal({ name, email, phone, password }) {
    const current = this.getUser();
    if (!current) {
      return { ok: false, error: "Нужно войти в аккаунт" };
    }

    const users = this._getLocalUsers();
    const emailNorm = String(email).toLowerCase();
    if (
      users.some(
        (u) => u.email.toLowerCase() === emailNorm && u.id !== current.id
      )
    ) {
      return { ok: false, error: "Этот email уже занят" };
    }

    const nextUsers = users.map((u) => {
      if (u.id !== current.id && u.email !== current.email) return u;
      return {
        ...u,
        name,
        email: emailNorm,
        phone: phone || "",
        password: password ? password : u.password,
      };
    });
    this._saveLocalUsers(nextUsers);

    const updated = {
      id: current.id,
      name,
      email: emailNorm,
      phone: phone || "",
      role: current.role,
    };
    this.setUser(updated);
    return { ok: true, user: updated };
  },

  async refreshUser() {
    try {
      const result = await this._fetchJson("me.php");
      if (!result || !result.data) {
        return this.getUser();
      }
      const data = result.data;
      if (data.ok && data.user) {
        this.setUser(data.user);
        await this.loadFavorites();
        return data.user;
      }
      if (result.status === 401 || data.ok === false) {
        this.logoutLocal();
        return null;
      }
      return this.getUser();
    } catch {
      return this.getUser();
    }
  },

  logoutLocal() {
    localStorage.removeItem("kk_user");
  },

  _favoritesKey(user = null) {
    const current = user || this.getUser();
    return current ? `kk_favorites_${current.id}` : "kk_favorites_guest";
  },

  getFavorites() {
    if (!this.getUser()) {
      return [];
    }
    return this._read(this._favoritesKey(), []);
  },

  _setFavorites(list) {
    if (!this.getUser()) {
      return;
    }
    this._write(
      this._favoritesKey(),
      [...new Set(list.map(Number).filter((id) => id > 0))]
    );
  },

  _toggleFavoritesLocal(id) {
    const num = Number(id);
    const list = this.getFavorites();
    const isFavorite = !list.includes(num);
    const next = isFavorite
      ? [...list, num]
      : list.filter((x) => x !== num);
    this._setFavorites(next);
    return { ok: true, isFavorite, favorites: next };
  },

  async loadFavorites() {
    const user = this.getUser();
    if (!user) {
      return [];
    }

    // Старый общий ключ (до привязки к аккаунту) — переносим в ключ пользователя
    const legacy = this._read("kk_favorites", []);
    let local = this._read(this._favoritesKey(user), []);
    if (legacy.length && !local.length) {
      local = legacy.map(Number).filter((id) => id > 0);
      this._setFavorites(local);
      localStorage.removeItem("kk_favorites");
    } else if (legacy.length) {
      localStorage.removeItem("kk_favorites");
    }

    try {
      const result = await this._fetchJson("favorites.php");
      const data = result && result.data;

      if (!data || !data.ok || !Array.isArray(data.favorites)) {
        this._setFavorites(local);
        return this.getFavorites();
      }

      const remote = data.favorites.map(Number).filter((id) => id > 0);

      // Если в БД пусто, а локально есть — восстанавливаем на сервере
      if (remote.length === 0 && local.length > 0) {
        const syncResult = await this._fetchJson("favorites.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sync",
            product_ids: local,
          }),
        });
        const syncData = syncResult && syncResult.data;
        if (syncData && syncData.ok && Array.isArray(syncData.favorites)) {
          this._setFavorites(syncData.favorites);
          return this.getFavorites();
        }
        this._setFavorites(local);
        return this.getFavorites();
      }

      // Объединяем: сервер — источник истины, плюс локальные, которых ещё нет в БД
      const merged = [...new Set([...remote, ...local])];
      if (merged.length > remote.length) {
        const syncResult = await this._fetchJson("favorites.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sync",
            product_ids: merged,
          }),
        });
        const syncData = syncResult && syncResult.data;
        if (syncData && syncData.ok && Array.isArray(syncData.favorites)) {
          this._setFavorites(syncData.favorites);
          return this.getFavorites();
        }
      }

      this._setFavorites(remote);
      return this.getFavorites();
    } catch {
      this._setFavorites(local);
      return this.getFavorites();
    }
  },

  async toggleFavorite(id) {
    const num = Number(id);
    if (!this.getUser()) {
      return { ok: false, isFavorite: false, favorites: [], error: "auth" };
    }

    try {
      const response = await fetch(this._apiUrl("favorites.php"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: num }),
      });
      const data = await response.json();

      if (!data.ok) {
        // Сессия/API недоступны — сохраняем локально, чтобы не потерять
        return this._toggleFavoritesLocal(num);
      }

      const favorites = Array.isArray(data.favorites)
        ? data.favorites.map(Number)
        : this.getFavorites();
      this._setFavorites(favorites);

      return {
        ok: true,
        isFavorite: Boolean(data.isFavorite),
        favorites: this.getFavorites(),
      };
    } catch {
      return this._toggleFavoritesLocal(num);
    }
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

  getCustomRequest(id) {
    return this.getCustomRequests().find((r) => r.id === id) || null;
  },

  addCustomRequest(request) {
    const list = this.getCustomRequests();
    list.unshift(request);
    try {
      this._write("kk_custom_requests", list);
      return { ok: true, list };
    } catch (error) {
      // Фото может не влезть в localStorage — сохраняем заявку без фото
      if (request.photo) {
        const withoutPhoto = [{ ...request, photo: "" }, ...this.getCustomRequests()];
        try {
          this._write("kk_custom_requests", withoutPhoto);
          return {
            ok: true,
            list: withoutPhoto,
            warning: "Заявка сохранена, но фото не удалось прикрепить (слишком большое).",
          };
        } catch {
          return { ok: false, error: "Не удалось сохранить заявку" };
        }
      }
      return { ok: false, error: "Не удалось сохранить заявку" };
    }
  },

  updateCustomRequest(id, patch) {
    const list = this.getCustomRequests();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) {
      return { ok: false, error: "Заявка не найдена" };
    }

    const next = [...list];
    next[index] = { ...next[index], ...patch, id, updatedAt: new Date().toISOString() };

    try {
      this._write("kk_custom_requests", next);
      return { ok: true, list: next, request: next[index] };
    } catch {
      if (patch.photo) {
        next[index] = { ...next[index], photo: list[index].photo || "" };
        try {
          this._write("kk_custom_requests", next);
          return {
            ok: true,
            list: next,
            request: next[index],
            warning: "Изменения сохранены, но новое фото не удалось прикрепить.",
          };
        } catch {
          return { ok: false, error: "Не удалось сохранить изменения" };
        }
      }
      return { ok: false, error: "Не удалось сохранить изменения" };
    }
  },

  deleteCustomRequest(id) {
    const next = this.getCustomRequests().filter((r) => r.id !== id);
    this._write("kk_custom_requests", next);
    return { ok: true, list: next };
  },

  updateCustomRequestStatus(id, status) {
    return this.updateCustomRequest(id, { status });
  },

  addCustomRequestChatMessage(requestId, { from, text, photo }) {
    const request = this.getCustomRequest(requestId);
    if (!request) {
      return { ok: false, error: "Заявка не найдена" };
    }

    const message = {
      id: "CHAT-" + Date.now(),
      from: from === "admin" ? "admin" : "client",
      text: String(text || "").trim(),
      photo: photo || "",
      createdAt: new Date().toISOString(),
    };

    if (!message.text && !message.photo) {
      return { ok: false, error: "Напишите сообщение или прикрепите фото" };
    }

    const chat = Array.isArray(request.chat) ? [...request.chat, message] : [message];
    return this.updateCustomRequest(requestId, { chat });
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

  getReviews() {
    const stored = this._read("kk_reviews", null);
    if (Array.isArray(stored)) {
      return stored;
    }
    // Стартовые отзывы, чтобы страница не была пустой без сервера
    return [
      {
        id: "REV-seed-1",
        userId: 0,
        authorName: "Анна",
        rating: 5,
        item: "Зайка в комбинезоне",
        text: "Заказывала зайку в подарок дочке — очень мягкая и аккуратная, каждая петелька на месте. Дочка с ней не расстаётся!",
        createdAt: "2026-09-18T10:30:00.000Z",
      },
      {
        id: "REV-seed-2",
        userId: 0,
        authorName: "Мария",
        rating: 5,
        item: "Вязаный букет",
        text: "Букет выглядит как настоящий, только не завянет. Очень нежные цвета, упаковали красиво — можно сразу дарить.",
        createdAt: "2026-09-26T14:15:00.000Z",
      },
      {
        id: "REV-seed-3",
        userId: 0,
        authorName: "Ольга",
        rating: 4,
        item: "Мишка",
        text: "Мишка получился с характером, как на фото. Ждала чуть дольше, чем планировала, но результат того стоил.",
        createdAt: "2026-10-05T09:00:00.000Z",
      },
    ];
  },

  async loadReviews() {
    const local = this.getReviews();
    const deletedIds = new Set(
      (this._read("kk_reviews_deleted", []) || []).map(String)
    );
    const result = await this._fetchJson("reviews.php");
    const data = result && result.data;
    if (data && data.ok && Array.isArray(data.reviews)) {
      // Сервер — источник истины; локальные отзывы без пары на сервере не теряем,
      // а удалённые локально (без сервера) обратно не воскрешаем
      const remote = data.reviews.filter((r) => !deletedIds.has(String(r.id)));
      const remoteIds = new Set(remote.map((r) => String(r.id)));
      const localOnly = local.filter(
        (r) =>
          !remoteIds.has(String(r.id)) &&
          !deletedIds.has(String(r.id)) &&
          !String(r.id).startsWith("REV-seed-")
      );
      const merged = [...localOnly, ...remote];
      this._write("kk_reviews", merged);
      return merged;
    }
    return local.filter((r) => !deletedIds.has(String(r.id)));
  },

  async addReview({ rating, item, text, photos }) {
    const user = this.getUser();
    if (!user) {
      return { ok: false, error: "Чтобы оставить отзыв, войдите в аккаунт" };
    }

    const cleanRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const cleanText = String(text || "").trim();
    if (cleanText.length < 3) {
      return { ok: false, error: "Напишите текст отзыва" };
    }
    const cleanPhotos = (Array.isArray(photos) ? photos : [])
      .filter((p) => typeof p === "string" && p.startsWith("data:image/"))
      .slice(0, 4);

    // Сначала пробуем сервер; если PHP/MySQL недоступны — сохраняем локально
    const result = await this._fetchJson("reviews.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: cleanRating,
        item: String(item || "").trim(),
        text: cleanText,
        photos: cleanPhotos,
      }),
    });
    const data = result && result.data;

    if (data && data.ok && Array.isArray(data.reviews)) {
      this._write("kk_reviews", data.reviews);
      return { ok: true, reviews: data.reviews };
    }
    if (result && result.status === 401) {
      return { ok: false, error: "Чтобы оставить отзыв, войдите в аккаунт" };
    }

    const review = {
      id: "REV-" + Date.now(),
      userId: user.id,
      authorName: user.name || "Покупатель",
      rating: cleanRating,
      item: String(item || "").trim(),
      text: cleanText,
      photos: cleanPhotos,
      createdAt: new Date().toISOString(),
    };
    try {
      const next = [review, ...this.getReviews()];
      this._write("kk_reviews", next);
      return { ok: true, reviews: next, review };
    } catch {
      // localStorage мог переполниться из-за фото — пробуем без них
      const withoutPhotos = { ...review, photos: [] };
      const next = [withoutPhotos, ...this.getReviews()];
      this._write("kk_reviews", next);
      return {
        ok: true,
        reviews: next,
        review: withoutPhotos,
        warning: "Отзыв сохранён, но фото не поместились в локальное хранилище.",
      };
    }
  },

  async deleteReview(id) {
    const user = this.getUser();
    if (!user) {
      return { ok: false, error: "Чтобы удалить отзыв, войдите в аккаунт" };
    }

    const review = this.getReviews().find((r) => String(r.id) === String(id));
    if (!review) {
      return { ok: false, error: "Отзыв не найден" };
    }
    if (Number(review.userId) !== Number(user.id)) {
      return { ok: false, error: "Можно удалить только свой отзыв" };
    }

    // Запоминаем удаление, чтобы отзыв не вернулся при следующей загрузке с сервера
    const deleted = this._read("kk_reviews_deleted", []) || [];
    if (!deleted.map(String).includes(String(id))) {
      this._write("kk_reviews_deleted", [...deleted, id]);
    }

    const result = await this._fetchJson("reviews.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    const data = result && result.data;

    if (data && data.ok && Array.isArray(data.reviews)) {
      const deletedIds = new Set(
        (this._read("kk_reviews_deleted", []) || []).map(String)
      );
      const reviews = data.reviews.filter((r) => !deletedIds.has(String(r.id)));
      this._write("kk_reviews", reviews);
      return { ok: true, reviews };
    }
    if (result && (result.status === 401 || result.status === 403)) {
      // Сервер запретил — откатываем локальное удаление
      this._write(
        "kk_reviews_deleted",
        (this._read("kk_reviews_deleted", []) || []).filter(
          (x) => String(x) !== String(id)
        )
      );
      return {
        ok: false,
        error: (data && data.error) || "Можно удалить только свой отзыв",
      };
    }

    // Сервер недоступен — удаляем локально
    const next = this.getReviews().filter((r) => String(r.id) !== String(id));
    this._write("kk_reviews", next);
    return { ok: true, reviews: next };
  },

  getAnnouncements() {
    return this._read("kk_announcements", []);
  },

  addAnnouncement(item) {
    const list = this.getAnnouncements();
    const next = {
      id: "INFO-" + Date.now(),
      title: item.title,
      text: item.text,
      createdAt: new Date().toISOString(),
      published: true,
    };
    list.unshift(next);
    this._write("kk_announcements", list);
    return next;
  },

  deleteAnnouncement(id) {
    const next = this.getAnnouncements().filter((item) => item.id !== id);
    this._write("kk_announcements", next);
    return next;
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
