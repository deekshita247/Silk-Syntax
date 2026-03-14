// ============================================================
//  app.js  — Frontend Logic
//  This file powers everything: product rendering, cart,
//  search, sort, filters, checkout, and UI interactions.
// ============================================================


// ─────────────────────────────────────────
//  CART STATE
//  This object holds everything in the cart
// ─────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem("fif_cart")) || [];

function saveCart() {
  localStorage.setItem("fif_cart", JSON.stringify(cart));
}


// ─────────────────────────────────────────
//  RENDER PRODUCTS
//  Reads the products array and builds cards
// ─────────────────────────────────────────
function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  const template = document.getElementById("product-card-template");
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--color-text-muted);grid-column:1/-1;">No products found.</p>`;
    return;
  }

  list.forEach(product => {
    const clone = template.content.cloneNode(true);
    const article = clone.querySelector(".product");

    // Set product id
    article.dataset.productId = product.id;

    // Image
    const img = clone.querySelector(".product__image");
    img.src = product.image;
    img.alt = product.name;

    // Title & description
    clone.querySelector(".product__title").textContent = product.name;
    clone.querySelector(".product__description").textContent = product.description;

    // Price
    clone.querySelector(".product__price").textContent = `$${product.price.toFixed(2)}`;

    // Compare price (strikethrough)
    const compareEl = clone.querySelector(".product__price--compare");
    if (product.comparePrice) {
      compareEl.textContent = `$${product.comparePrice.toFixed(2)}`;
    } else {
      compareEl.style.display = "none";
    }

    // Stock
    const stockEl = clone.querySelector(".product__stock");
    if (product.stock === 0) {
      stockEl.textContent = "Out of stock";
      stockEl.style.color = "var(--color-accent)";
      clone.querySelector(".product__add").disabled = true;
      clone.querySelector(".product__add").textContent = "Unavailable";
    } else if (product.stock <= 5) {
      stockEl.textContent = `Only ${product.stock} left!`;
      stockEl.style.color = "#f97316";
    } else {
      stockEl.textContent = `In stock (${product.stock})`;
    }

    // Favourite button toggle
    const favBtn = clone.querySelector(".product__favorite");
    const savedFavs = JSON.parse(localStorage.getItem("fif_favs")) || [];
    if (savedFavs.includes(product.id)) {
      favBtn.textContent = "★";
      favBtn.setAttribute("aria-pressed", "true");
    }
    favBtn.addEventListener("click", () => toggleFavourite(product.id, favBtn));

    // Add to cart button
    const addBtn = clone.querySelector(".product__add");
    addBtn.addEventListener("click", () => {
      const qty = parseInt(clone.querySelector(".product__qty-input").value) || 1;
      addToCart(product, qty);
    });

    grid.appendChild(clone);
  });
}


// ─────────────────────────────────────────
//  FAVOURITES
// ─────────────────────────────────────────
function toggleFavourite(id, btn) {
  let favs = JSON.parse(localStorage.getItem("fif_favs")) || [];
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
    btn.textContent = "☆";
    btn.setAttribute("aria-pressed", "false");
  } else {
    favs.push(id);
    btn.textContent = "★";
    btn.setAttribute("aria-pressed", "true");
  }
  localStorage.setItem("fif_favs", JSON.stringify(favs));
}


// ─────────────────────────────────────────
//  CART LOGIC
// ─────────────────────────────────────────
function addToCart(product, qty) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock);
  } else {
    cart.push({ ...product, qty });
  }
  saveCart();
  renderCart();
  openCart();
  showToast(`"${product.name}" added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  if (item.qty > item.stock) item.qty = item.stock;
  saveCart();
  renderCart();
}

function renderCart() {
  const itemsList = document.getElementById("cart-items");
  const emptyMsg  = document.getElementById("cart-empty-msg");
  const subtotalEl = document.getElementById("cart-subtotal");
  const taxEl      = document.getElementById("cart-tax");
  const totalEl    = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const countEl    = document.querySelector(".header-cart__count");

  itemsList.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    checkoutBtn.disabled = true;
  } else {
    emptyMsg.style.display = "none";
    checkoutBtn.disabled = false;

    cart.forEach(item => {
      const li = document.createElement("li");
      li.className = "cart__item";
      li.innerHTML = `
        <span class="cart__item-title">${item.name}</span>
        <span style="font-size:0.8rem;font-weight:600;">$${(item.price * item.qty).toFixed(2)}</span>
        <span class="cart__item-meta">$${item.price.toFixed(2)} each</span>
        <div class="cart__item-actions">
          <button onclick="changeQty(${item.id}, -1)" style="background:rgba(255,255,255,0.08);border:none;color:var(--color-text);border-radius:4px;padding:2px 7px;cursor:pointer;">−</button>
          <span style="font-size:0.8rem;padding:0 4px;">${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)" style="background:rgba(255,255,255,0.08);border:none;color:var(--color-text);border-radius:4px;padding:2px 7px;cursor:pointer;">+</button>
          <button onclick="removeFromCart(${item.id})" style="background:rgba(249,115,115,0.15);border:none;color:var(--color-accent);border-radius:4px;padding:2px 7px;cursor:pointer;">✕</button>
        </div>
      `;
      itemsList.appendChild(li);
    });
  }

  // Totals
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax      = subtotal * 0.08;
  const total    = subtotal + tax;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent      = `$${tax.toFixed(2)}`;
  totalEl.textContent    = `$${total.toFixed(2)}`;

  // Header cart count
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  countEl.textContent = totalQty;
}


// ─────────────────────────────────────────
//  CART PANEL OPEN / CLOSE
// ─────────────────────────────────────────
function openCart() {
  document.getElementById("cart-panel").classList.remove("cart--hidden");
}

function closeCart() {
  document.getElementById("cart-panel").classList.add("cart--hidden");
}


// ─────────────────────────────────────────
//  SEARCH & SORT & FILTER
// ─────────────────────────────────────────
let activeCategory = "All";

function getFilteredProducts() {
  const query = document.getElementById("search-input").value.toLowerCase().trim();
  const sort  = document.getElementById("sort-select").value;

  let list = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch   = p.name.toLowerCase().includes(query) ||
                            p.description.toLowerCase().includes(query) ||
                            p.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (sort === "price-asc")  list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a, b) => b.price - a.price);

  return list;
}

function applyFilters() {
  renderProducts(getFilteredProducts());
}


// ─────────────────────────────────────────
//  CATEGORY FILTER BUTTONS
// ─────────────────────────────────────────
function buildCategoryButtons() {
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const container  = document.createElement("div");
  container.id = "category-filters";
  container.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 18px;
  `;

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = "btn btn--secondary";
    btn.style.cssText = `font-size:0.8rem;padding:5px 14px;`;
    if (cat === activeCategory) {
      btn.style.background = "linear-gradient(135deg,#4c8dff,#7f5dff)";
      btn.style.color = "#fff";
      btn.style.border = "none";
    }
    btn.addEventListener("click", () => {
      activeCategory = cat;
      buildCategoryButtons(); // re-render buttons to update active state
      applyFilters();
    });
    container.appendChild(btn);
  });

  // Replace old buttons if they exist
  const existing = document.getElementById("category-filters");
  const grid = document.getElementById("product-grid");
  if (existing) {
    existing.replaceWith(container);
  } else {
    grid.parentElement.insertBefore(container, grid);
  }
}


// ─────────────────────────────────────────
//  TOAST NOTIFICATION
// ─────────────────────────────────────────
function showToast(message) {
  const existing = document.getElementById("fif-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "fif-toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #4c8dff, #7f5dff);
    color: #fff;
    padding: 10px 22px;
    border-radius: 999px;
    font-size: 0.88rem;
    z-index: 999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    animation: fadeInUp 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}


// ─────────────────────────────────────────
//  CHECKOUT
// ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  // Save cart to localStorage so checkout page can read it
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) return;
    saveCart();
    window.location.href = "checkout.html";
  });


  // ── Cart open/close buttons ──
  document.querySelector("[data-open-cart]").addEventListener("click", openCart);
  document.querySelector("[data-close-cart]").addEventListener("click", closeCart);


  // ── Scroll to catalog ──
  document.querySelector("[data-scroll-target]").addEventListener("click", (e) => {
    const target = document.querySelector(e.currentTarget.dataset.scrollTarget);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });


  // ── Mobile nav toggle ──
  const navToggle = document.querySelector(".nav__toggle");
  const navList   = document.getElementById("nav-menu");
  navToggle.addEventListener("click", () => {
    const isOpen = navList.style.display === "flex";
    navList.style.display = isOpen ? "none" : "flex";
    navList.style.flexDirection = "column";
    navList.style.position = "absolute";
    navList.style.top = "60px";
    navList.style.right = "7vw";
    navList.style.background = "rgba(8,11,22,0.98)";
    navList.style.padding = "12px 20px";
    navList.style.borderRadius = "12px";
    navList.style.border = "1px solid rgba(255,255,255,0.08)";
    navToggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
  });


  // ── Search input ──
  document.getElementById("search-input").addEventListener("input", applyFilters);


  // ── Sort select ──
  document.getElementById("sort-select").addEventListener("change", applyFilters);


  // ── Fix footer year ──
  document.getElementById("footer-year").textContent = new Date().getFullYear();


  // ── Initial render ──
  buildCategoryButtons();
  renderProducts(products);
  renderCart();

  // Start cart hidden
  document.getElementById("cart-panel").classList.add("cart--hidden");
});


// ─────────────────────────────────────────
//  CSS ANIMATION FOR TOAST
// ─────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(style);