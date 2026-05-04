// ============================================================
//  MENU DATA — Edit this to add your own foods & images!
//  For images: put your photo in the images/ folder and use:
//  image: 'images/yourfile.jpg'
//  For emoji fallback (no image): leave image as null
// ============================================================

const menuItems = [
  {
    id: 1,
    name: "Jollof Rice + Chicken",
    category: "Rice",
    price: 2500,
    description: "Smoky party jollof with grilled chicken",
    image: null, // Replace with: 'images/jollof.jpg'
    emoji: "🍛",
  },
  {
    id: 2,
    name: "Fried Rice + Turkey",
    category: "Rice",
    price: 2800,
    description: "Nigerian fried rice with grilled turkey",
    image: null,
    emoji: "🍚",
  },
  {
    id: 3,
    name: "Egusi Soup + Pounded Yam",
    category: "Soup",
    price: 3000,
    description: "Rich egusi with assorted meat",
    image: null,
    emoji: "🥘",
  },
  {
    id: 4,
    name: "Ofe Onugbu + Garri",
    category: "Soup",
    price: 2700,
    description: "Bitter leaf soup with eba",
    image: null,
    emoji: "🍲",
  },
  {
    id: 5,
    name: "Suya Platter",
    category: "Grills",
    price: 2000,
    description: "Spicy beef suya with onions",
    image: null,
    emoji: "🍢",
  },
  {
    id: 6,
    name: "Peppered Gizzard",
    category: "Grills",
    price: 1800,
    description: "Hot peppered gizzard snack",
    image: null,
    emoji: "🍗",
  },
  {
    id: 7,
    name: "Puff Puff",
    category: "Snacks",
    price: 500,
    description: "Classic Nigerian fried dough balls",
    image: null,
    emoji: "🧆",
  },
  {
    id: 8,
    name: "Meat Pie",
    category: "Snacks",
    price: 600,
    description: "Crispy pastry with minced meat filling",
    image: null,
    emoji: "🥧",
  },
  {
    id: 9,
    name: "Chapman",
    category: "Drinks",
    price: 800,
    description: "Classic Nigerian party drink",
    image: null,
    emoji: "🍹",
  },
  {
    id: 10,
    name: "Zobo Drink",
    category: "Drinks",
    price: 600,
    description: "Chilled hibiscus flower drink",
    image: null,
    emoji: "🍷",
  },
];

// ============================================================
//  APP STATE
// ============================================================

let activeCategory = "All";
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// ============================================================
//  RENDER MENU
// ============================================================

function renderMenu() {
  const query = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const grid = document.getElementById("menuGrid");
  const empty = document.getElementById("emptyMsg");
  const countEl = document.getElementById("menuCount");

  const filtered = menuItems.filter((item) => {
    const matchCat =
      activeCategory === "All" || item.category === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  countEl.textContent =
    filtered.length + " item" + (filtered.length !== 1 ? "s" : "");

  if (filtered.length === 0) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  grid.innerHTML = filtered
    .map(
      (item, i) => `
    <div class="food-card" style="animation-delay:${i * 0.05}s">
      <div class="food-card-img">
        ${
          item.image
            ? `<img src="${item.image}" alt="${item.name}" onerror="this.parentElement.innerHTML='${item.emoji}'">`
            : item.emoji
        }
      </div>
      <div class="food-card-body">
        <p class="food-card-cat">${item.category}</p>
        <p class="food-card-name">${item.name}</p>
        <p class="food-card-desc">${item.description}</p>
        <div class="food-card-footer">
          <span class="food-card-price">₦${item.price.toLocaleString()}</span>
          <button class="add-btn" onclick="addToCart(${item.id})" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

// ============================================================
//  CATEGORY FILTER
// ============================================================

function setCategory(cat, btn) {
  activeCategory = cat;
  document
    .querySelectorAll(".cat-pill")
    .forEach((p) => p.classList.remove("active"));
  btn.classList.add("active");
  renderMenu();
}

// ============================================================
//  CART LOGIC
// ============================================================

function addToCart(id) {
  const item = menuItems.find((m) => m.id === id);
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id,
      name: item.name,
      price: item.price,
      emoji: item.emoji,
      qty: 1,
    });
  }
  saveCart();
  updateCartUI();
  showToast(item.name + " added to cart!");
}

function changeQty(id, delta) {
  const existing = cart.find((c) => c.id === id);
  if (!existing) return;
  existing.qty += delta;
  if (existing.qty <= 0) cart = cart.filter((c) => c.id !== id);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  const total = cart.reduce((sum, c) => sum + c.qty, 0);
  const countEl = document.getElementById("cartCount");
  if (total > 0) {
    countEl.textContent = total;
    countEl.style.display = "flex";
  } else {
    countEl.style.display = "none";
  }
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const footer = document.getElementById("cartFooter");

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="cart-empty">Your cart is empty.<br>Add something delicious!</p>';
    footer.style.display = "none";
    return;
  }

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const total = subtotal + 500;

  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">₦${(item.price * item.qty).toLocaleString()}</p>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `,
    )
    .join("");

  document.getElementById("cartSubtotal").textContent =
    "₦" + subtotal.toLocaleString();
  document.getElementById("cartTotal").textContent =
    "₦" + total.toLocaleString();
  footer.style.display = "block";
}

function toggleCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  const isOpen = drawer.classList.contains("open");
  if (!isOpen) renderCartItems();
  drawer.classList.toggle("open", !isOpen);
  overlay.classList.toggle("open", !isOpen);
}

// ============================================================
//  CHECKOUT
// ============================================================

function checkout() {
  if (cart.length === 0) return;
  alert("Order placed! Thank you. We will deliver soon.");
  cart = [];
  saveCart();
  updateCartUI();
  renderCartItems();
  toggleCart();
}

// ============================================================
//  TOAST NOTIFICATION
// ============================================================

let toastTimer;
function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  clearTimeout(toastTimer);
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ============================================================
//  INIT
// ============================================================

renderMenu();
updateCartUI();
