(function () {
  var KEY = "fitil-cart-v1";
  var PRODUCTS = [
    { id: "linen", name: "Лён и молоко", price: 1890, category: "soy", cat: "Соевая", weight: "220 г", burn: "40 часов", text: "Соевый воск и деревянный фитиль. Тихий запах чистого белья.", image: "https://images.unsplash.com/photo-1674812824344-ead17e5d1f65?auto=format&fit=crop&w=900&q=80", alt: "Свеча с деревянным фитилём в стеклянной пиале" },
    { id: "blue", name: "Синее стекло", price: 2400, category: "soy", cat: "Соевая", weight: "280 г", burn: "50 часов", text: "Банка цвета бутылочного стекла. Морская соль и хлопок.", image: "https://images.unsplash.com/photo-1727837878251-5d88738a0900?auto=format&fit=crop&w=900&q=80", alt: "Свеча в синей стеклянной банке с крышкой" },
    { id: "pillars", name: "Три столба", price: 1650, category: "plain", cat: "Без аромата", weight: "3 × 180 г", burn: "по 18 часов", text: "Белые столбы без отдушки — для стола, где уже есть еда.", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80", alt: "Три белые столбовые свечи на деревянном столе" },
    { id: "teas", name: "Чайные огни", price: 890, category: "plain", cat: "Без аромата", weight: "12 штук", burn: "по 4 часа", text: "Маленькие свечи в прозрачных стаканах для сервировки.", image: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=900&q=80", alt: "Чайные свечи в стеклянных подсвечниках" },
    { id: "hearth", name: "Вечер у камина", price: 2190, category: "aroma", cat: "Ароматическая", weight: "240 г", burn: "45 часов", text: "Дым, сухое дерево и немного апельсиновой цедры.", image: "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?auto=format&fit=crop&w=900&q=80", alt: "Горящие свечи на тёплом столе" },
    { id: "resin", name: "Ночная смола", price: 2490, category: "aroma", cat: "Ароматическая", weight: "260 г", burn: "48 часов", text: "Хвойная смола и тёмный мёд. Для комнаты больше 16 м².", image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=900&q=80", alt: "Много горящих свечей в тёмной комнате" },
    { id: "lavender", name: "Лавандовый сон", price: 1750, category: "aroma", cat: "Ароматическая", weight: "пара, 180 г", burn: "по 12 часов", text: "Две высокие свечи. Лаванда без аптечной резкости.", image: "https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=900&q=80", alt: "Розовая высокая свеча в металлическом подсвечнике" },
    { id: "cocoa", name: "Масло какао", price: 1590, category: "aroma", cat: "Ароматическая", weight: "120 г", burn: "25 часов", text: "Массажная свеча: воск тает в тёплое масло для кожи.", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80", alt: "Небольшие банки с массажными свечами и маслом" },
    { id: "amber", name: "Трио в янтаре", price: 5400, category: "gift", cat: "Набор", weight: "3 × 200 г", burn: "по 40 часов", text: "Три банки: лён, хвоя и горький апельсин. Крафтовая коробка.", image: "https://images.unsplash.com/photo-1643122966676-29e8597257f7?auto=format&fit=crop&w=900&q=80", alt: "Три янтарные банки со свечами и белыми этикетками" }
  ];

  var filter = "all";
  var sort = "featured";

  function money(value) {
    return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " ₽";
  }

  function findProduct(id) {
    return PRODUCTS.filter(function (item) { return item.id === id; })[0];
  }

  function loadCart() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw.filter(function (item) {
        return item && findProduct(item.id) && item.qty > 0;
      }).map(function (item) {
        return { id: item.id, qty: Math.min(9, Math.round(item.qty)) };
      });
    } catch (error) {
      return [];
    }
  }

  var cart = loadCart();

  function saveCart() {
    localStorage.setItem(KEY, JSON.stringify(cart));
    renderBadge();
    renderDrawer();
    renderCheckout();
    renderCatalog();
  }

  function qtyOf(id) {
    var found = cart.filter(function (item) { return item.id === id; })[0];
    return found ? found.qty : 0;
  }

  function setQty(id, qty) {
    cart = cart.filter(function (item) { return item.id !== id; });
    if (qty > 0) cart.push({ id: id, qty: Math.min(9, qty) });
    saveCart();
  }

  function goodsTotal() {
    return cart.reduce(function (sum, item) {
      return sum + findProduct(item.id).price * item.qty;
    }, 0);
  }

  function deliveryCost() {
    var chosen = document.querySelector('input[name="delivery"]:checked');
    if (!chosen || chosen.value === "pickup") return 0;
    return 390;
  }

  function renderBadge() {
    var count = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    var node = document.getElementById("cart-count");
    if (node) node.textContent = String(count);
  }

  function renderDrawer() {
    var body = document.getElementById("drawer-body");
    var sum = document.getElementById("drawer-sum");
    if (!body || !sum) return;
    body.innerHTML = "";
    if (!cart.length) {
      var empty = document.createElement("p");
      empty.className = "empty-note";
      empty.textContent = "Пока пусто. Свечи ждут в каталоге.";
      body.appendChild(empty);
    }
    cart.forEach(function (item) {
      var product = findProduct(item.id);
      var row = document.createElement("div");
      row.className = "line";
      var info = document.createElement("div");
      var title = document.createElement("h3");
      title.textContent = product.name;
      var controls = document.createElement("div");
      controls.className = "qty";
      var minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.setAttribute("aria-label", "Меньше");
      var value = document.createElement("span");
      value.textContent = String(item.qty);
      var plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.setAttribute("aria-label", "Больше");
      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove";
      remove.textContent = "Убрать";
      minus.addEventListener("click", function () { setQty(item.id, item.qty - 1); });
      plus.addEventListener("click", function () { setQty(item.id, item.qty + 1); });
      remove.addEventListener("click", function () { setQty(item.id, 0); });
      controls.appendChild(minus);
      controls.appendChild(value);
      controls.appendChild(plus);
      controls.appendChild(remove);
      info.appendChild(title);
      info.appendChild(controls);
      var price = document.createElement("strong");
      price.textContent = money(product.price * item.qty);
      row.appendChild(info);
      row.appendChild(price);
      body.appendChild(row);
    });
    sum.textContent = money(goodsTotal());
  }

  function sortedProducts() {
    var list = PRODUCTS.filter(function (item) {
      return filter === "all" || item.category === filter;
    });
    if (sort === "asc") list.sort(function (a, b) { return a.price - b.price; });
    if (sort === "desc") list.sort(function (a, b) { return b.price - a.price; });
    return list;
  }

  function renderCatalog() {
    var root = document.getElementById("catalog-grid");
    if (!root) return;
    var list = sortedProducts();
    var empty = document.getElementById("catalog-empty");
    root.innerHTML = "";
    if (empty) empty.hidden = list.length !== 0;
    list.forEach(function (product) {
      var card = document.createElement("article");
      card.className = "product";
      var image = document.createElement("img");
      image.src = product.image;
      image.alt = product.alt;
      var cat = document.createElement("p");
      cat.className = "cat";
      cat.textContent = product.cat;
      var title = document.createElement("h3");
      title.textContent = product.name;
      var meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = product.weight + " · горит " + product.burn;
      var text = document.createElement("p");
      text.className = "text";
      text.textContent = product.text;
      var row = document.createElement("div");
      row.className = "product-row";
      var price = document.createElement("span");
      price.className = "price";
      price.textContent = money(product.price);
      var button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-line";
      var owned = qtyOf(product.id);
      button.textContent = owned ? "Ещё одну" : "В корзину";
      button.addEventListener("click", function () {
        setQty(product.id, qtyOf(product.id) + 1);
        openDrawer();
      });
      row.appendChild(price);
      row.appendChild(button);
      card.appendChild(image);
      card.appendChild(cat);
      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(text);
      card.appendChild(row);
      root.appendChild(card);
    });
  }

  function renderCheckout() {
    var root = document.getElementById("checkout-lines");
    if (!root) return;
    var empty = document.getElementById("checkout-empty");
    var box = document.getElementById("delivery-box");
    var total = document.getElementById("checkout-total");
    var submit = document.getElementById("order-submit");
    root.innerHTML = "";
    if (!cart.length) {
      var successNode = document.getElementById("order-success");
      var showEmpty = !successNode || successNode.hidden;
      if (empty) empty.hidden = !showEmpty;
      if (box) box.hidden = true;
      if (total) total.textContent = money(0);
      if (submit) submit.disabled = true;
      return;
    }
    if (empty) empty.hidden = true;
    if (box) box.hidden = false;
    if (submit) submit.disabled = false;
    cart.forEach(function (item) {
      var product = findProduct(item.id);
      var row = document.createElement("div");
      row.className = "checkout-line";
      var image = document.createElement("img");
      image.src = product.image;
      image.alt = "";
      var info = document.createElement("div");
      var title = document.createElement("h3");
      title.textContent = product.name;
      var meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = item.qty + " × " + money(product.price);
      info.appendChild(title);
      info.appendChild(meta);
      var price = document.createElement("strong");
      price.textContent = money(product.price * item.qty);
      row.appendChild(image);
      row.appendChild(info);
      row.appendChild(price);
      root.appendChild(row);
    });
    if (total) total.textContent = money(goodsTotal() + deliveryCost());
  }

  function openDrawer() {
    document.getElementById("drawer").hidden = false;
    document.getElementById("drawer-back").hidden = false;
    document.body.classList.add("nav-lock");
    document.getElementById("close-cart").focus();
  }

  function closeDrawer() {
    document.getElementById("drawer").hidden = true;
    document.getElementById("drawer-back").hidden = true;
    document.body.classList.remove("nav-lock");
  }

  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  function closeNav() {
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-lock");
  }
  burger.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-lock", open);
  });
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.getElementById("open-cart").addEventListener("click", function () {
    closeNav();
    openDrawer();
  });
  document.getElementById("close-cart").addEventListener("click", closeDrawer);
  document.getElementById("drawer-back").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeDrawer();
  });

  document.documentElement.classList.add("js");
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    reveals.forEach(function (node) { io.observe(node); });
  } else {
    reveals.forEach(function (node) { node.classList.add("is-visible"); });
  }

  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      filter = button.getAttribute("data-filter");
      document.querySelectorAll("[data-filter]").forEach(function (item) {
        var on = item === button;
        item.classList.toggle("is-active", on);
        item.setAttribute("aria-pressed", on ? "true" : "false");
      });
      renderCatalog();
    });
  });
  var sortSelect = document.getElementById("sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      sort = sortSelect.value;
      renderCatalog();
    });
  }
  document.querySelectorAll('input[name="delivery"]').forEach(function (input) {
    input.addEventListener("change", renderCheckout);
  });

  function digits(value) { return value.replace(/\D/g, ""); }
  function validPhone(value) {
    var d = digits(value);
    if (d.length === 11) return d.charAt(0) === "7" || d.charAt(0) === "8";
    return d.length === 10;
  }
  function validName(value) {
    return /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\-\s]{1,}$/.test(value.trim());
  }
  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }
  function setError(id, message) {
    var error = document.getElementById(id + "-error");
    var field = document.getElementById(id);
    if (error) error.textContent = message;
    if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  var orderForm = document.getElementById("order-form");
  if (orderForm) {
    ["name", "phone", "email", "city", "address", "consent"].forEach(function (id) {
      var field = document.getElementById(id);
      field.addEventListener("input", function () { setError(id, ""); });
    });
    orderForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!cart.length) return;
      var name = document.getElementById("name").value;
      var phone = document.getElementById("phone").value;
      var email = document.getElementById("email").value;
      var city = document.getElementById("city").value.trim();
      var address = document.getElementById("address").value.trim();
      var courier = document.querySelector('input[name="delivery"]:checked').value === "courier";
      var consent = document.getElementById("consent").checked;
      var ok = true;
      if (!validName(name)) { setError("name", "Напишите имя."); ok = false; } else setError("name", "");
      if (!validPhone(phone)) { setError("phone", "Телефон: +7 или 8 и десять цифр."); ok = false; } else setError("phone", "");
      if (!validEmail(email)) { setError("email", "Почта должна содержать @ и домен."); ok = false; } else setError("email", "");
      if (city.length < 2) { setError("city", "Укажите город."); ok = false; } else setError("city", "");
      if (courier && address.length < 5) {
        setError("address", "Для курьера нужен адрес: улица и дом.");
        ok = false;
      } else setError("address", "");
      if (!consent) { setError("consent", "Отметьте, что заказ демонстрационный."); ok = false; } else setError("consent", "");
      if (!ok) return;
      var number = "Ф-" + String(Date.now()).slice(-6);
      var way = courier ? "курьером" : "самовывозом";
      var sum = goodsTotal() + deliveryCost();
      cart = [];
      saveCart();
      document.getElementById("order-fields").hidden = true;
      var success = document.getElementById("order-success");
      success.hidden = false;
      success.textContent = "Заказ " + number + " собран на экране: " + money(sum) + ", доставка " + way + ". Письмо на " + email.trim() + " не отправлено — это учебный магазин, корзина очищена.";
      success.focus();
    });
  }

  renderBadge();
  renderDrawer();
  renderCatalog();
  renderCheckout();
})();
