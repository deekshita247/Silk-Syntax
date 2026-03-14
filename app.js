// ============================================================
//  app.js  —  Fix-It Forward Shop · Frontend Logic
// ============================================================

let cart = JSON.parse(localStorage.getItem("fif_cart")) || [];

function saveCart() {
  localStorage.setItem("fif_cart", JSON.stringify(cart));
}

// ─────────────────────────────────────────
//  RENDER PRODUCTS
// ─────────────────────────────────────────
function renderProducts(list) {
  const grid     = document.getElementById("product-grid");
  const template = document.getElementById("product-card-template");
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--color-text-muted);grid-column:1/-1;padding:40px 0;">No products found.</p>`;
    return;
  }

  list.forEach(product => {
    const clone   = template.content.cloneNode(true);
    const article = clone.querySelector(".product");

    article.dataset.productId = product.id;

    // Sale badge
    if (product.comparePrice) {
      const badge = document.createElement("span");
      badge.className = "product__badge";
      const pct = Math.round((1 - product.price / product.comparePrice) * 100);
      badge.textContent = `-${pct}%`;
      article.appendChild(badge);
    }

    // Image
    const img = clone.querySelector(".product__image");
    img.src   = product.image;
    img.alt   = product.name;

    // Text
    clone.querySelector(".product__title").textContent       = product.name;
    clone.querySelector(".product__description").textContent = product.description;
    clone.querySelector(".product__price").textContent       = `$${product.price.toFixed(2)}`;

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
      stockEl.style.color = "#e05252";
      clone.querySelector(".product__add").disabled     = true;
      clone.querySelector(".product__add").textContent  = "Unavailable";
    } else if (product.stock <= 5) {
      stockEl.textContent = `Only ${product.stock} left!`;
      stockEl.style.color = "#d97706";
    } else {
      stockEl.textContent = `In stock`;
    }

    // Favourite
    const favBtn   = clone.querySelector(".product__favorite");
    const savedFavs = JSON.parse(localStorage.getItem("fif_favs")) || [];
    if (savedFavs.includes(product.id)) {
      favBtn.textContent = "♥";
      favBtn.style.color = "#e05252";
      favBtn.setAttribute("aria-pressed", "true");
    }
    favBtn.addEventListener("click", () => toggleFavourite(product.id, favBtn));

    // Add to cart
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
    favs          = favs.filter(f => f !== id);
    btn.textContent = "♡";
    btn.style.color = "";
    btn.setAttribute("aria-pressed", "false");
  } else {
    favs.push(id);
    btn.textContent = "♥";
    btn.style.color = "#e05252";
    btn.setAttribute("aria-pressed", "true");
  }
  localStorage.setItem("fif_favs", JSON.stringify(favs));
}

// ─────────────────────────────────────────
//  CART
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
  showToast(`"${product.name}" added to bag!`);
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
  if (item.qty <= 0) { removeFromCart(id); return; }
  if (item.qty > item.stock) item.qty = item.stock;
  saveCart();
  renderCart();
}

function renderCart() {
  const itemsList   = document.getElementById("cart-items");
  const emptyMsg    = document.getElementById("cart-empty-msg");
  const subtotalEl  = document.getElementById("cart-subtotal");
  const taxEl       = document.getElementById("cart-tax");
  const totalEl     = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const countEl     = document.querySelector(".header-cart__count");

  itemsList.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.style.display  = "block";
    checkoutBtn.disabled    = true;
  } else {
    emptyMsg.style.display  = "none";
    checkoutBtn.disabled    = false;

    cart.forEach(item => {
      const li = document.createElement("li");
      li.className = "cart__item";
      li.innerHTML = `
        <span class="cart__item-title">${item.name}</span>
        <span style="font-size:0.85rem;font-weight:600;color:var(--color-velvet);">$${(item.price * item.qty).toFixed(2)}</span>
        <span class="cart__item-meta">$${item.price.toFixed(2)} each</span>
        <div class="cart__item-actions">
          <button onclick="changeQty(${item.id},-1)"
            style="background:var(--color-marble);border:1px solid var(--color-border-subtle);color:var(--color-text);border-radius:4px;padding:2px 8px;cursor:pointer;">−</button>
          <span style="font-size:0.85rem;padding:0 6px;min-width:20px;text-align:center;">${item.qty}</span>
          <button onclick="changeQty(${item.id},1)"
            style="background:var(--color-marble);border:1px solid var(--color-border-subtle);color:var(--color-text);border-radius:4px;padding:2px 8px;cursor:pointer;">+</button>
          <button onclick="removeFromCart(${item.id})"
            style="background:#fef2f2;border:1px solid #fecaca;color:#e05252;border-radius:4px;padding:2px 8px;cursor:pointer;margin-left:4px;">✕</button>
        </div>
      `;
      itemsList.appendChild(li);
    });
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = subtotal * 0.08;
  const total    = subtotal + tax;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent      = `$${tax.toFixed(2)}`;
  totalEl.innerHTML      = `<strong>$${total.toFixed(2)}</strong>`;
  countEl.textContent    = cart.reduce((s, i) => s + i.qty, 0);
}

// ─────────────────────────────────────────
//  CART OPEN / CLOSE
// ─────────────────────────────────────────
function openCart() {
  document.getElementById("cart-panel").classList.remove("cart--hidden");
  document.getElementById("cart-backdrop").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cart-panel").classList.add("cart--hidden");
  document.getElementById("cart-backdrop").classList.remove("active");
  document.body.style.overflow = "";
}

// ─────────────────────────────────────────
//  SEARCH · SORT · FILTER
// ─────────────────────────────────────────
let activeCategory = "All";

// Exposed globally so nav links can call it
window.setCategory = function(cat) {
  activeCategory = cat;
  buildCategoryButtons();
  applyFilters();
};

function getFilteredProducts() {
  const query = (document.getElementById("search-input")?.value || "").toLowerCase().trim();
  const sort  = document.getElementById("sort-select").value;

  let list = products.filter(p => {
    const matchesCat    = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(query) ||
                          p.description.toLowerCase().includes(query) ||
                          p.category.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  if (sort === "price-asc")  list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  return list;
}

function applyFilters() {
  renderProducts(getFilteredProducts());
}

// ─────────────────────────────────────────
//  CATEGORY BUTTONS
// ─────────────────────────────────────────
function buildCategoryButtons() {
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const container  = document.createElement("div");
  container.id     = "category-filters";

  categories.forEach(cat => {
    const btn       = document.createElement("button");
    btn.textContent = cat;
    const isActive  = cat === activeCategory;
    btn.className   = isActive ? "btn btn--primary" : "btn btn--secondary";
    btn.style.cssText = "font-size:0.75rem;padding:6px 16px;letter-spacing:0.05em;";
    btn.addEventListener("click", () => {
      activeCategory = cat;
      buildCategoryButtons();
      applyFilters();
    });
    container.appendChild(btn);
  });

  const existing = document.getElementById("category-filters");
  const grid     = document.getElementById("product-grid");
  if (existing) {
    existing.replaceWith(container);
  } else {
    grid.parentElement.insertBefore(container, grid);
  }
}

// ─────────────────────────────────────────
//  TOAST
// ─────────────────────────────────────────
function showToast(message) {
  const existing = document.getElementById("fif-toast");
  if (existing) existing.remove();
  const toast       = document.createElement("div");
  toast.id          = "fif-toast";
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed;bottom:32px;left:50%;transform:translateX(-50%);
    background:var(--color-velvet);color:#fff;
    padding:11px 24px;border-radius:999px;font-size:0.85rem;
    z-index:9999;box-shadow:0 8px 24px rgba(34,45,82,0.25);
    animation:toastIn 0.3s ease;white-space:nowrap;
    font-family:var(--font-body);letter-spacing:0.02em;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ─────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  // Checkout
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) return;
    saveCart();
    window.location.href = "checkout.html";
  });

  // Cart open/close
  document.querySelector("[data-open-cart]").addEventListener("click", openCart);
  document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
  document.getElementById("cart-backdrop").addEventListener("click", closeCart);

  // Scroll buttons
  document.querySelectorAll("[data-scroll-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.dataset.scrollTarget);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Mobile nav toggle
  const navToggle = document.querySelector(".nav__toggle");
  const navList   = document.getElementById("nav-menu");
  navToggle.addEventListener("click", () => {
    navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", navList.classList.contains("open"));
  });

  // Search (header)
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.addEventListener("input", applyFilters);

  // Search (mobile catalog)
  const searchMobile = document.getElementById("search-input-mobile");
  if (searchMobile) {
    searchMobile.addEventListener("input", () => {
      if (searchInput) searchInput.value = searchMobile.value;
      applyFilters();
    });
  }

  // Sort
  document.getElementById("sort-select").addEventListener("change", applyFilters);

  // Footer year
  document.getElementById("footer-year").textContent = new Date().getFullYear();

  // Initial render
  buildCategoryButtons();
  renderProducts(products);
  renderCart();
});

// Toast animation
const style       = document.createElement("style");
style.textContent = `
  @keyframes toastIn {
    from { opacity:0; transform:translateX(-50%) translateY(8px); }
    to   { opacity:1; transform:translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(style);

