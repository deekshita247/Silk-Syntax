// ============================================================
//  header.js  —  Shared header, cart, region & auth logic
//  Include this on EVERY page after products.js
// ============================================================

// ─── Currency / Region ───────────────────────────────────────
const REGIONS = {
  AE: { name: "UAE",          currency: "AED", symbol: "AED", rate: 3.67 },
  US: { name: "United States",currency: "USD", symbol: "$",   rate: 1.00 },
  GB: { name: "United Kingdom",currency:"GBP", symbol: "£",   rate: 0.79 },
  IN: { name: "India",        currency: "INR", symbol: "₹",   rate: 83.5  },
};

let currentRegion = JSON.parse(localStorage.getItem("fif_region")) || REGIONS.AE;

function saveRegion(code) {
  currentRegion = REGIONS[code] || REGIONS.AE;
  localStorage.setItem("fif_region", JSON.stringify(currentRegion));
}

function formatPrice(usdPrice) {
  const converted = (usdPrice * currentRegion.rate).toFixed(2);
  return `${currentRegion.symbol} ${converted}`;
}

// ─── Cart state ──────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem("fif_cart")) || [];

function saveCart() {
  localStorage.setItem("fif_cart", JSON.stringify(cart));
}

function addToCart(product, qty) {
  const existing = cart.find(i => i.id === product.id);
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
  cart = cart.filter(i => i.id !== id);
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
  if (!itemsList) return;

  itemsList.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    checkoutBtn.disabled   = true;
  } else {
    emptyMsg.style.display = "none";
    checkoutBtn.disabled   = false;
    cart.forEach(item => {
      const li = document.createElement("li");
      li.className = "cart__item";
      li.innerHTML = `
        <span class="cart__item-title">${item.name}</span>
        <span style="font-size:.85rem;font-weight:600;color:var(--color-velvet);">${formatPrice(item.price * item.qty)}</span>
        <span class="cart__item-meta">${formatPrice(item.price)} each</span>
        <div class="cart__item-actions">
          <button onclick="changeQty(${item.id},-1)" class="qty-btn">−</button>
          <span style="font-size:.85rem;padding:0 6px;">${item.qty}</span>
          <button onclick="changeQty(${item.id},1)"  class="qty-btn">+</button>
          <button onclick="removeFromCart(${item.id})" class="qty-btn remove-btn">✕</button>
        </div>`;
      itemsList.appendChild(li);
    });
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = subtotal * 0.08;
  const total    = subtotal + tax;

  subtotalEl.textContent = formatPrice(subtotal);
  taxEl.textContent      = formatPrice(tax);
  totalEl.innerHTML      = `<strong>${formatPrice(total)}</strong>`;
  if (countEl) countEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function openCart() {
  document.getElementById("cart-panel")?.classList.remove("cart--hidden");
  document.getElementById("cart-backdrop")?.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cart-panel")?.classList.add("cart--hidden");
  document.getElementById("cart-backdrop")?.classList.remove("active");
  document.body.style.overflow = "";
}

// ─── Auth ────────────────────────────────────────────────────
function getUser() {
  return JSON.parse(localStorage.getItem("fif_user")) || null;
}

function saveUser(user) {
  localStorage.setItem("fif_user", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("fif_user");
  showToast("Logged out successfully.");
  setTimeout(() => location.reload(), 800);
}

// ─── Toast ───────────────────────────────────────────────────
function showToast(message, type = "default") {
  const existing = document.getElementById("fif-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id    = "fif-toast";
  toast.textContent = message;
  const bg = type === "error" ? "#c0392b" : "var(--color-velvet)";
  toast.style.cssText = `
    position:fixed;bottom:32px;left:50%;transform:translateX(-50%);
    background:${bg};color:#fff;padding:11px 24px;border-radius:999px;
    font-size:.85rem;z-index:9999;box-shadow:0 8px 24px rgba(34,45,82,.3);
    animation:toastIn .3s ease;white-space:nowrap;font-family:var(--font-body);`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

// ─── Inject shared header HTML ───────────────────────────────
function injectHeader(activeCat = "") {
  const user = getUser();

  const headerHTML = `
  <div class="announcement-bar" id="announcement-bar">
    FREE SHIPPING ON ORDERS OVER ${currentRegion.symbol} ${(75 * currentRegion.rate).toFixed(0)}
    &nbsp;·&nbsp; USE CODE <strong>SILK-SYNTAX</strong> FOR 10% OFF
    <button onclick="document.getElementById('announcement-bar').style.display='none'"
      style="background:none;border:none;color:#fff;cursor:pointer;margin-left:12px;font-size:1rem;">×</button>
  </div>

  <header class="site-header">
    <div class="header-top">
      <a href="index.html" class="logo" aria-label="Fix It Forward Home">
        fix-it-<span>forward</span>
      </a>
      <div class="header-search">
        <span class="header-search__icon">🔍</span>
        <input id="search-input" type="search" placeholder="Search products, brands…" autocomplete="off"/>
      </div>
      <div class="header-icons">
        <div class="region-selector">
          <button class="region-btn" id="region-btn" title="Change region">
            ${currentRegion.name} · ${currentRegion.currency} ▾
          </button>
          <div class="region-dropdown" id="region-dropdown">
            ${Object.entries(REGIONS).map(([code, r]) => `
              <button class="region-option ${currentRegion.currency === r.currency ? 'active' : ''}"
                onclick="changeRegion('${code}')">
                ${r.name} <span>${r.currency}</span>
              </button>`).join("")}
          </div>
        </div>
        <div class="auth-area">
          ${user
            ? `<div class="user-menu-wrap">
                 <button class="user-btn" id="user-menu-btn">👤 ${user.name} ▾</button>
                 <div class="user-dropdown" id="user-dropdown">
                   <a href="wishlist.html">♡ Wishlist</a>
                   <a href="orders.html">📦 My Orders</a>
                   <button onclick="logoutUser()">🚪 Logout</button>
                 </div>
               </div>`
            : `<button class="btn btn--secondary header-auth-btn" onclick="openAuthModal('login')"
                 style="font-size:.78rem;padding:7px 14px;">Sign In</button>
               <button class="btn btn--primary header-auth-btn" onclick="openAuthModal('register')"
                 style="font-size:.78rem;padding:7px 14px;">Register</button>`
          }
        </div>
        <button class="header-cart" data-open-cart="true" aria-label="Open cart">
          🛒 Bag <span class="header-cart__count" aria-live="polite">0</span>
        </button>
      </div>
    </div>

    <nav class="nav" aria-label="Primary">
      <button class="nav__toggle" aria-expanded="false" aria-controls="nav-menu">☰</button>
      <ul id="nav-menu" class="nav__list">
        <li><a href="index.html" ${activeCat===''?'class="active"':''}>Home</a></li>
        <li><a href="category.html?cat=new" ${activeCat==='new'?'class="active"':''}>New In</a></li>
        <li><a href="category.html?cat=Electronics" ${activeCat==='Electronics'?'class="active"':''}>Electronics</a></li>
        <li><a href="category.html?cat=Clothes" ${activeCat==='Clothes'?'class="active"':''}>Clothing</a></li>
        <li><a href="category.html?cat=Make Up" ${activeCat==='Make Up'?'class="active"':''}>Beauty</a></li>
        <li><a href="category.html?cat=Accessories" ${activeCat==='Accessories'?'class="active"':''}>Accessories</a></li>
        <li><a href="category.html?cat=Fitness" ${activeCat==='Fitness'?'class="active"':''}>Sports</a></li>
        <li><a href="category.html?cat=Kitchen" ${activeCat==='Kitchen'?'class="active"':''}>Kitchen</a></li>
        <li><a href="all-categories.html">View All</a></li>
      </ul>
    </nav>
  </header>

  <!-- Cart backdrop -->
  <div class="cart-backdrop" id="cart-backdrop"></div>

  <!-- Cart panel -->
  <aside id="cart-panel" class="cart cart--hidden" aria-label="Shopping cart">
    <header class="cart__header">
      <h2>🛒 My Bag</h2>
      <button class="cart__close" data-close-cart="true" aria-label="Close cart">×</button>
    </header>
    <div class="cart__body">
      <ul class="cart__items" id="cart-items"></ul>
      <p class="cart__empty" id="cart-empty-msg">Your bag is empty. Start shopping!</p>
    </div>
    <footer class="cart__footer">
      <div class="promo-row">
        <input id="promo-input" type="text" placeholder="Promo code (SILK-SYNTAX)" />
        <button onclick="applyPromo()" class="btn btn--secondary" style="font-size:.78rem;padding:7px 12px;">Apply</button>
      </div>
      <p id="promo-msg" style="font-size:.75rem;margin:4px 0 8px;"></p>
      <dl class="cart__summary">
        <div><dt>Subtotal</dt><dd id="cart-subtotal">${currentRegion.symbol} 0.00</dd></div>
        <div><dt>Discount</dt><dd id="cart-discount" style="color:#4a9e6b;">-${currentRegion.symbol} 0.00</dd></div>
        <div><dt>Tax (5%)</dt><dd id="cart-tax">${currentRegion.symbol} 0.00</dd></div>
        <div><dt><strong>Total</strong></dt><dd id="cart-total"><strong>${currentRegion.symbol} 0.00</strong></dd></div>
      </dl>
      <button class="btn btn--primary btn--full" id="checkout-btn" disabled>Proceed to Checkout →</button>
      <p class="cart__status" id="checkout-status" aria-live="polite"></p>
    </footer>
  </aside>

  <!-- Auth Modal -->
  <div class="modal-backdrop" id="auth-backdrop" style="display:none;" onclick="closeAuthModal()"></div>
  <div class="modal" id="auth-modal" style="display:none;">
    <button class="modal-close" onclick="closeAuthModal()">×</button>
    <div id="auth-login-view">
      <h2 class="modal-title">Welcome Back</h2>
      <p class="modal-sub">Sign in to your account</p>
      <div class="form-group">
        <label>Email</label>
        <input id="login-email" type="email" placeholder="you@example.com"/>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input id="login-pass" type="password" placeholder="••••••••"/>
      </div>
      <button class="btn btn--primary btn--full" onclick="doLogin()" style="margin-top:8px;">Sign In</button>
      <p style="text-align:center;font-size:.82rem;margin-top:14px;color:var(--color-text-muted);">
        No account? <a href="#" onclick="openAuthModal('register')" style="color:var(--color-velvet);font-weight:600;">Register free</a>
      </p>
    </div>
    <div id="auth-register-view" style="display:none;">
      <h2 class="modal-title">Create Account</h2>
      <p class="modal-sub">Join Fix-It Forward Shop</p>
      <div class="form-group">
        <label>Full Name</label>
        <input id="reg-name" type="text" placeholder="Jane Doe"/>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input id="reg-email" type="email" placeholder="you@example.com"/>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input id="reg-pass" type="password" placeholder="Min. 6 characters"/>
      </div>
      <button class="btn btn--primary btn--full" onclick="doRegister()" style="margin-top:8px;">Create Account</button>
      <p style="text-align:center;font-size:.82rem;margin-top:14px;color:var(--color-text-muted);">
        Have an account? <a href="#" onclick="openAuthModal('login')" style="color:var(--color-velvet);font-weight:600;">Sign in</a>
      </p>
    </div>
    <div id="auth-success-view" style="display:none;text-align:center;padding:20px 0;">
      <div style="font-size:2.5rem;margin-bottom:12px;">🎉</div>
      <h2 class="modal-title" id="auth-success-title">Welcome!</h2>
      <p id="auth-success-msg" class="modal-sub"></p>
      <button class="btn btn--primary" onclick="closeAuthModal()" style="margin-top:16px;">Start Shopping</button>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("afterbegin", headerHTML);
  bindHeaderEvents();
}

// ─── Inject shared footer ─────────────────────────────────────
function injectFooter() {
  const footerHTML = `
  <footer id="footer" class="site-footer">
    <div class="footer-grid">
      <div>
        <p class="footer-logo">fix-it-<span>forward</span></p>
        <p style="font-size:.82rem;color:rgba(255,255,255,.5);line-height:1.6;">
          Premium fashion & lifestyle. Curated for you.
        </p>
      </div>
      <div>
        <p class="footer-heading">Shop</p>
        <a href="category.html?cat=Clothes">Clothing</a>
        <a href="category.html?cat=Make Up">Beauty</a>
        <a href="category.html?cat=Electronics">Electronics</a>
        <a href="category.html?cat=Accessories">Accessories</a>
      </div>
      <div>
        <p class="footer-heading">Help</p>
        <a href="#">Shipping Info</a>
        <a href="#">Returns</a>
        <a href="#">Size Guide</a>
        <a href="#">Contact Us</a>
      </div>
      <div>
        <p class="footer-heading">Follow Us</p>
        <a href="#">Instagram</a>
        <a href="#">TikTok</a>
        <a href="#">Pinterest</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© <span class="footer-year"></span> Fix-It Forward Shop. All rights reserved.</p>
      <p class="site-footer__note">Demo store — Built for the Fix-It Forward challenge 🚀</p>
    </div>
  </footer>`;
  document.body.insertAdjacentHTML("beforeend", footerHTML);
  document.querySelectorAll(".footer-year").forEach(el => el.textContent = new Date().getFullYear());
}

// ─── Bind all header events ───────────────────────────────────
function bindHeaderEvents() {
  // Cart
  document.querySelector("[data-open-cart]")?.addEventListener("click", openCart);
  document.querySelector("[data-close-cart]")?.addEventListener("click", closeCart);
  document.getElementById("cart-backdrop")?.addEventListener("click", closeCart);
  document.getElementById("checkout-btn")?.addEventListener("click", () => {
    saveCart();
    window.location.href = "checkout.html";
  });

  // Mobile nav
  const navToggle = document.querySelector(".nav__toggle");
  const navList   = document.getElementById("nav-menu");
  navToggle?.addEventListener("click", () => {
    navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", navList.classList.contains("open"));
  });

  // Region dropdown
  document.getElementById("region-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("region-dropdown").classList.toggle("open");
  });
  document.addEventListener("click", () => {
    document.getElementById("region-dropdown")?.classList.remove("open");
    document.getElementById("user-dropdown")?.classList.remove("open");
  });

  // User dropdown
  document.getElementById("user-menu-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("user-dropdown").classList.toggle("open");
  });

  // Scroll-target buttons
  document.querySelectorAll("[data-scroll-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(btn.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth" });
    });
  });

  renderCart();
}

// ─── Region change ────────────────────────────────────────────
function changeRegion(code) {
  saveRegion(code);
  document.getElementById("region-dropdown")?.classList.remove("open");
  showToast(`Region changed to ${REGIONS[code].name} · ${REGIONS[code].currency}`);
  setTimeout(() => location.reload(), 800);
}

// ─── Promo code ───────────────────────────────────────────────
let promoApplied = false;

function applyPromo() {
  const code    = document.getElementById("promo-input")?.value.trim().toUpperCase();
  const msgEl   = document.getElementById("promo-msg");
  if (code === "SILK-SYNTAX") {
    promoApplied = true;
    msgEl.textContent = "✅ 10% discount applied!";
    msgEl.style.color = "#4a9e6b";
    renderCartWithPromo();
  } else {
    msgEl.textContent = "❌ Invalid promo code.";
    msgEl.style.color = "#e05252";
  }
}

function renderCartWithPromo() {
  const subtotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount   = promoApplied ? subtotal * 0.10 : 0;
  const afterDisc  = subtotal - discount;
  const tax        = afterDisc * 0.05;
  const total      = afterDisc + tax;
  const discEl     = document.getElementById("cart-discount");
  if (discEl) discEl.textContent = `-${formatPrice(discount)}`;
  document.getElementById("cart-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("cart-tax").textContent      = formatPrice(tax);
  document.getElementById("cart-total").innerHTML      = `<strong>${formatPrice(total)}</strong>`;
}

// ─── Auth modal ───────────────────────────────────────────────
function openAuthModal(view = "login") {
  document.getElementById("auth-backdrop").style.display = "block";
  document.getElementById("auth-modal").style.display    = "block";
  document.getElementById("auth-login-view").style.display    = view === "login"    ? "block" : "none";
  document.getElementById("auth-register-view").style.display = view === "register" ? "block" : "none";
  document.getElementById("auth-success-view").style.display  = "none";
  document.body.style.overflow = "hidden";
}

function closeAuthModal() {
  document.getElementById("auth-backdrop").style.display = "none";
  document.getElementById("auth-modal").style.display    = "none";
  document.body.style.overflow = "";
}

function doRegister() {
  const name  = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass  = document.getElementById("reg-pass").value;
  if (!name || !email || pass.length < 6) {
    showToast("Please fill in all fields (password min 6 chars)", "error"); return;
  }
  const users = JSON.parse(localStorage.getItem("fif_users") || "[]");
  if (users.find(u => u.email === email)) {
    showToast("Email already registered. Please sign in.", "error"); return;
  }
  const user = { name, email, password: pass };
  users.push(user);
  localStorage.setItem("fif_users", JSON.stringify(users));
  saveUser(user);
  document.getElementById("auth-register-view").style.display = "none";
  document.getElementById("auth-success-view").style.display  = "block";
  document.getElementById("auth-success-title").textContent   = `Welcome, ${name}!`;
  document.getElementById("auth-success-msg").textContent     = "Your account has been created. Happy shopping!";
}

function doLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pass  = document.getElementById("login-pass").value;
  const users = JSON.parse(localStorage.getItem("fif_users") || "[]");
  const user  = users.find(u => u.email === email && u.password === pass);
  if (!user) { showToast("Incorrect email or password.", "error"); return; }
  saveUser(user);
  document.getElementById("auth-login-view").style.display   = "none";
  document.getElementById("auth-success-view").style.display = "block";
  document.getElementById("auth-success-title").textContent  = `Welcome back, ${user.name}!`;
  document.getElementById("auth-success-msg").textContent    = "You are now signed in.";
}

// ─── Shared CSS injected once ─────────────────────────────────
const sharedStyle = document.createElement("style");
sharedStyle.textContent = `
  @keyframes toastIn {
    from { opacity:0; transform:translateX(-50%) translateY(8px); }
    to   { opacity:1; transform:translateX(-50%) translateY(0); }
  }

  /* qty buttons in cart */
  .qty-btn {
    background:var(--color-marble);border:1px solid var(--color-border-subtle);
    color:var(--color-text);border-radius:4px;padding:2px 8px;cursor:pointer;font-size:.82rem;
  }
  .remove-btn { background:#fef2f2;border-color:#fecaca;color:#e05252;margin-left:4px; }

  /* Region selector */
  .region-selector { position:relative; }
  .region-btn {
    background:none;border:1px solid var(--color-border-subtle);border-radius:var(--radius-pill);
    padding:6px 12px;font-size:.75rem;cursor:pointer;color:var(--color-text);
    font-family:var(--font-body);white-space:nowrap;
  }
  .region-dropdown {
    display:none;position:absolute;right:0;top:calc(100% + 6px);
    background:var(--color-surface);border:1px solid var(--color-border-subtle);
    border-radius:var(--radius-md);box-shadow:var(--shadow-soft);min-width:180px;z-index:200;
    overflow:hidden;
  }
  .region-dropdown.open { display:block; }
  .region-option {
    display:flex;justify-content:space-between;width:100%;padding:10px 16px;
    background:none;border:none;cursor:pointer;font-size:.82rem;font-family:var(--font-body);
    color:var(--color-text);transition:background .15s;
  }
  .region-option:hover { background:var(--color-marble); }
  .region-option.active { font-weight:600;color:var(--color-velvet); }
  .region-option span { color:var(--color-text-muted); }

  /* User menu */
  .auth-area { display:flex;align-items:center;gap:6px; }
  .user-menu-wrap { position:relative; }
  .user-btn {
    background:none;border:1px solid var(--color-border-subtle);border-radius:var(--radius-pill);
    padding:6px 12px;font-size:.78rem;cursor:pointer;color:var(--color-text);font-family:var(--font-body);
  }
  .user-dropdown {
    display:none;position:absolute;right:0;top:calc(100% + 6px);
    background:var(--color-surface);border:1px solid var(--color-border-subtle);
    border-radius:var(--radius-md);box-shadow:var(--shadow-soft);min-width:160px;z-index:200;overflow:hidden;
  }
  .user-dropdown.open { display:block; }
  .user-dropdown a, .user-dropdown button {
    display:block;width:100%;padding:10px 16px;text-decoration:none;
    color:var(--color-text);font-size:.82rem;background:none;border:none;
    cursor:pointer;text-align:left;font-family:var(--font-body);transition:background .15s;
  }
  .user-dropdown a:hover, .user-dropdown button:hover { background:var(--color-marble); }

  /* Auth modal */
  .modal-backdrop {
    position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:300;backdrop-filter:blur(3px);
  }
  .modal {
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    background:var(--color-surface);border-radius:var(--radius-lg);padding:36px 32px;
    width:min(420px,92vw);z-index:301;box-shadow:0 24px 60px rgba(0,0,0,.18);
  }
  .modal-close {
    position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.4rem;
    cursor:pointer;color:var(--color-text-muted);line-height:1;
  }
  .modal-title { font-family:var(--font-display);font-size:1.6rem;margin:0 0 4px;color:var(--color-velvet); }
  .modal-sub   { font-size:.85rem;color:var(--color-text-muted);margin:0 0 20px; }
  .form-group  { display:flex;flex-direction:column;gap:5px;margin-bottom:14px; }
  .form-group label { font-size:.8rem;color:var(--color-text-muted); }
  .form-group input {
    padding:10px 14px;border:1px solid var(--color-border-subtle);border-radius:var(--radius-md);
    font-family:var(--font-body);font-size:.88rem;color:var(--color-text);
    background:var(--color-marble);outline:none;transition:border-color .2s;
  }
  .form-group input:focus { border-color:var(--color-champagne); }

  /* Promo row */
  .promo-row { display:flex;gap:8px;margin-bottom:6px; }
  .promo-row input {
    flex:1;padding:8px 12px;border:1px solid var(--color-border-subtle);
    border-radius:var(--radius-pill);font-family:var(--font-body);font-size:.8rem;
    background:var(--color-marble);color:var(--color-text);outline:none;
  }

  /* Footer grid */
  .footer-grid {
    display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:32px;
    padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:20px;
  }
  .footer-logo {
    font-family:var(--font-display);font-size:1.3rem;color:#fff;
    font-weight:700;margin:0 0 10px;
  }
  .footer-logo span { color:var(--color-champagne); }
  .footer-heading { font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin:0 0 12px; }
  .site-footer a {
    display:block;color:rgba(255,255,255,.6);text-decoration:none;font-size:.82rem;
    margin-bottom:7px;transition:color .2s;
  }
  .site-footer a:hover { color:#fff; }
  .footer-bottom { font-size:.78rem;color:rgba(255,255,255,.4); }
  .footer-bottom p { margin:0 0 4px; }

  /* header-auth-btn gap */
  .header-auth-btn { white-space:nowrap; }

  @media(max-width:900px) {
    .footer-grid { grid-template-columns:1fr 1fr; }
    .header-auth-btn { display:none; }
  }
  @media(max-width:600px) {
    .footer-grid { grid-template-columns:1fr; }
    .region-btn span { display:none; }
  }
`;
document.head.appendChild(sharedStyle);