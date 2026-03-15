// ============================================================
//  header.js — Fix-It Forward · Shared logic for all pages
//  Cart · Auth · Region · Dark Mode · Toast · Footer · Cookie
// ============================================================

// ── Region ────────────────────────────────────────────────────
const REGIONS = {
  AE:{ name:"UAE",          currency:"AED", symbol:"AED", rate:3.67 },
  US:{ name:"United States",currency:"USD", symbol:"$",   rate:1.00 },
  GB:{ name:"United Kingdom",currency:"GBP",symbol:"£",   rate:0.79 },
  IN:{ name:"India",        currency:"INR", symbol:"₹",   rate:83.5  },
};
let currentRegion = JSON.parse(localStorage.getItem("fif_region")) || REGIONS.AE;
function saveRegion(code){ currentRegion = REGIONS[code]||REGIONS.AE; localStorage.setItem("fif_region",JSON.stringify(currentRegion)); }
function formatPrice(usd){ return `${currentRegion.symbol} ${(usd*currentRegion.rate).toFixed(2)}`; }

// ── Dark mode ─────────────────────────────────────────────────
function initTheme(){
  const saved = localStorage.getItem("fif_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
}
function toggleTheme(){
  const cur = document.documentElement.getAttribute("data-theme")||"light";
  const next = cur==="dark"?"light":"dark";
  document.documentElement.setAttribute("data-theme",next);
  localStorage.setItem("fif_theme",next);
  const btn = document.getElementById("theme-toggle-btn");
  if(btn) btn.innerHTML = next==="dark" ? "☀️ <span>Light</span>" : "🌙 <span>Dark</span>";
}
initTheme();

// ── Cart ──────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem("fif_cart"))||[];
let promoApplied = false;
const FREE_SHIPPING_THRESHOLD = 75;

function saveCart(){ localStorage.setItem("fif_cart",JSON.stringify(cart)); }

function addToCart(product, qty, size){
  const key = size ? `${product.id}-${size}` : product.id;
  const existing = cart.find(i=> (size ? i.cartKey===key : i.id===product.id));
  if(existing){ existing.qty = Math.min(existing.qty+qty, product.stock); }
  else { cart.push({...product, qty, size:size||null, cartKey:key}); }
  saveCart(); renderCart(); openCart();
  showToast(`"${product.name}" added to bag!`);
  const cnt = document.querySelector(".header-cart__count");
  if(cnt){ cnt.classList.add("bump"); setTimeout(()=>cnt.classList.remove("bump"),400); }
}

function removeFromCart(key){
  cart = cart.filter(i=> (i.cartKey||i.id)!=key );
  saveCart(); renderCart();
}

function changeQty(key, delta){
  const item = cart.find(i=>(i.cartKey||i.id)==key);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0){ removeFromCart(key); return; }
  if(item.qty>item.stock) item.qty=item.stock;
  saveCart(); renderCart();
}

function renderCart(){
  const itemsList  = document.getElementById("cart-items");
  const emptyMsg   = document.getElementById("cart-empty-msg");
  const subtotalEl = document.getElementById("cart-subtotal");
  const discEl     = document.getElementById("cart-discount");
  const taxEl      = document.getElementById("cart-tax");
  const totalEl    = document.getElementById("cart-total");
  const checkBtn   = document.getElementById("checkout-btn");
  const countEl    = document.querySelector(".header-cart__count");
  const fillEl     = document.getElementById("shipping-fill");
  const barText    = document.getElementById("shipping-bar-text");
  if(!itemsList) return;

  itemsList.innerHTML = "";
  if(cart.length===0){
    emptyMsg.style.display="block";
    if(checkBtn) checkBtn.disabled=true;
  } else {
    emptyMsg.style.display="none";
    if(checkBtn) checkBtn.disabled=false;
    cart.forEach(item=>{
      const key = item.cartKey||item.id;
      const li = document.createElement("li");
      li.className="cart__item";
      li.innerHTML=`
        <span class="cart__item-title">${item.name}${item.size?` <em style="font-size:.7rem;color:var(--color-text-muted);">(${item.size})</em>`:""}</span>
        <span style="font-size:.85rem;font-weight:600;">${formatPrice(item.price*item.qty)}</span>
        <span class="cart__item-meta">${formatPrice(item.price)} each</span>
        <div class="cart__item-actions">
          <button class="qty-btn" onclick="changeQty('${key}',-1)">−</button>
          <span style="font-size:.85rem;padding:0 6px;">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${key}',1)">+</button>
          <button class="qty-btn remove-btn" onclick="removeFromCart('${key}')">✕</button>
        </div>`;
      itemsList.appendChild(li);
    });
  }

  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const discount = promoApplied ? subtotal*0.10 : 0;
  const afterDisc= subtotal-discount;
  const tax      = afterDisc*0.05;
  const total    = afterDisc+tax;

  if(subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if(discEl)     discEl.textContent     = `-${formatPrice(discount)}`;
  if(taxEl)      taxEl.textContent      = formatPrice(tax);
  if(totalEl)    totalEl.innerHTML      = `<strong>${formatPrice(total)}</strong>`;
  if(countEl)    countEl.textContent    = cart.reduce((s,i)=>s+i.qty,0);

  // Free shipping progress bar
  if(fillEl && barText){
    const pct = Math.min((subtotal/FREE_SHIPPING_THRESHOLD)*100, 100);
    fillEl.style.width = pct+"%";
    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    if(subtotal >= FREE_SHIPPING_THRESHOLD){
      barText.innerHTML = `🎉 You've unlocked <strong>Free Shipping!</strong>`;
    } else {
      barText.innerHTML = `You're <strong>${formatPrice(remaining)}</strong> away from free shipping 🚚`;
    }
  }
}

function openCart(){
  document.getElementById("cart-panel")?.classList.remove("cart--hidden");
  document.getElementById("cart-backdrop")?.classList.add("active");
  document.body.style.overflow="hidden";
}
function closeCart(){
  document.getElementById("cart-panel")?.classList.add("cart--hidden");
  document.getElementById("cart-backdrop")?.classList.remove("active");
  document.body.style.overflow="";
}

// ── Promo ─────────────────────────────────────────────────────
function applyPromo(){
  const code = document.getElementById("promo-input")?.value.trim().toUpperCase();
  const msg  = document.getElementById("promo-msg");
  if(code==="SILK-SYNTAX"){
    promoApplied=true;
    if(msg){ msg.textContent="✅ 10% discount applied!"; msg.style.color="#4a9e6b"; }
    renderCart();
  } else {
    if(msg){ msg.textContent="❌ Invalid code."; msg.style.color="#e05252"; }
  }
}

// ── Auth ──────────────────────────────────────────────────────
function getUser(){ return JSON.parse(localStorage.getItem("fif_user"))||null; }
function saveUser(u){ localStorage.setItem("fif_user",JSON.stringify(u)); }
function logoutUser(){ localStorage.removeItem("fif_user"); showToast("Logged out."); setTimeout(()=>location.reload(),800); }

function openAuthModal(view="login"){
  document.getElementById("auth-backdrop").style.display="block";
  document.getElementById("auth-modal").style.display="block";
  document.getElementById("auth-login-view").style.display    = view==="login"    ?"block":"none";
  document.getElementById("auth-register-view").style.display = view==="register" ?"block":"none";
  document.getElementById("auth-success-view").style.display  = "none";
  document.body.style.overflow="hidden";
}
function closeAuthModal(){
  document.getElementById("auth-backdrop").style.display="none";
  document.getElementById("auth-modal").style.display="none";
  document.body.style.overflow="";
}
function doRegister(){
  const name=document.getElementById("reg-name").value.trim();
  const email=document.getElementById("reg-email").value.trim();
  const pass=document.getElementById("reg-pass").value;
  if(!name||!email||pass.length<6){ showToast("Please fill all fields (password min 6 chars)","error"); return; }
  const users=JSON.parse(localStorage.getItem("fif_users")||"[]");
  if(users.find(u=>u.email===email)){ showToast("Email already registered.","error"); return; }
  const user={name,email,password:pass};
  users.push(user); localStorage.setItem("fif_users",JSON.stringify(users)); saveUser(user);
  document.getElementById("auth-register-view").style.display="none";
  document.getElementById("auth-success-view").style.display="block";
  document.getElementById("auth-success-title").textContent=`Welcome, ${name}!`;
  document.getElementById("auth-success-msg").textContent="Your account is ready. Happy shopping!";
}
function doLogin(){
  const email=document.getElementById("login-email").value.trim();
  const pass=document.getElementById("login-pass").value;
  const users=JSON.parse(localStorage.getItem("fif_users")||"[]");
  const user=users.find(u=>u.email===email&&u.password===pass);
  if(!user){ showToast("Incorrect email or password.","error"); return; }
  saveUser(user);
  document.getElementById("auth-login-view").style.display="none";
  document.getElementById("auth-success-view").style.display="block";
  document.getElementById("auth-success-title").textContent=`Welcome back, ${user.name}!`;
  document.getElementById("auth-success-msg").textContent="You are now signed in.";
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg, type="default"){
  document.getElementById("fif-toast")?.remove();
  const t=document.createElement("div"); t.id="fif-toast"; t.textContent=msg;
  const bg = type==="error"?"#c0392b":"var(--color-velvet)";
  t.style.cssText=`position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:${bg};color:#fff;padding:11px 24px;border-radius:999px;font-size:.85rem;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.25);animation:toastIn .3s ease;white-space:nowrap;font-family:var(--font-body);`;
  document.body.appendChild(t); setTimeout(()=>t.remove(),2800);
}

// ── Recently Viewed ───────────────────────────────────────────
function addRecentlyViewed(productId){
  let rv = JSON.parse(localStorage.getItem("fif_rv")||"[]");
  rv = rv.filter(id=>id!==productId);
  rv.unshift(productId);
  rv = rv.slice(0,10);
  localStorage.setItem("fif_rv",JSON.stringify(rv));
}
function renderRecentlyViewed(containerId, excludeId=null){
  const container = document.getElementById(containerId);
  if(!container) return;
  const rv = JSON.parse(localStorage.getItem("fif_rv")||"[]");
  const toShow = rv.filter(id=>id!==excludeId).slice(0,6);
  if(toShow.length===0){ container.parentElement?.style && (container.parentElement.style.display="none"); return; }
  toShow.forEach(id=>{
    const p = products.find(x=>x.id===id);
    if(!p) return;
    const a = document.createElement("a");
    a.href=`product.html?id=${p.id}`; a.className="rv-card";
    a.innerHTML=`<img src="${p.image}" alt="${p.name}" loading="lazy"><p>${p.name}</p><span>${formatPrice(p.price)}</span>`;
    container.appendChild(a);
  });
}

// ── Inject Header ─────────────────────────────────────────────
function injectHeader(activeCat=""){
  const user = getUser();
  const isDark = localStorage.getItem("fif_theme")==="dark";

  const html=`
  <div class="announcement-bar" id="announcement-bar">
    FREE SHIPPING ON ORDERS OVER ${currentRegion.symbol} ${(FREE_SHIPPING_THRESHOLD*currentRegion.rate).toFixed(0)}
    &nbsp;·&nbsp; USE CODE <strong>SILK-SYNTAX</strong> FOR 10% OFF
    <button onclick="document.getElementById('announcement-bar').style.display='none'" style="background:none;border:none;color:rgba(255,255,255,.6);cursor:pointer;margin-left:12px;font-size:1rem;line-height:1;">×</button>
  </div>
  <header class="site-header">
    <div class="header-top">
      <a href="index.html" class="logo">fix-it-<span>forward</span></a>
      <div class="header-search">
        <span class="header-search__icon">🔍</span>
        <input id="search-input" type="search" placeholder="Search products…" autocomplete="off" onkeydown="if(event.key==='Enter'&&this.value.trim())window.location.href='category.html?cat=All&q='+encodeURIComponent(this.value.trim())"/>
      </div>
      <div class="header-icons">
        <div class="region-selector">
          <button class="region-btn" id="region-btn">${currentRegion.name} · ${currentRegion.currency} ▾</button>
          <div class="region-dropdown" id="region-dropdown">
            ${Object.entries(REGIONS).map(([code,r])=>`<button class="region-option ${currentRegion.currency===r.currency?"active":""}" onclick="changeRegion('${code}')">${r.name} <span>${r.currency}</span></button>`).join("")}
          </div>
        </div>
        <div class="auth-area">
          ${user
            ?`<div class="user-menu-wrap"><button class="user-btn" id="user-menu-btn">${user.name} ▾</button>
               <div class="user-dropdown" id="user-dropdown">
                 <a href="wishlist.html">Wishlist</a>
                 <button onclick="logoutUser()">Logout</button>
               </div></div>`
            :`<button class="btn btn--secondary header-auth-btn" onclick="openAuthModal('login')" style="font-size:.75rem;padding:7px 12px;">Sign In</button>
              <button class="btn btn--primary header-auth-btn" onclick="openAuthModal('register')" style="font-size:.75rem;padding:7px 12px;">Register</button>`
          }
        </div>
        <button class="theme-toggle" id="theme-toggle-btn" onclick="toggleTheme()">
          ${isDark?"☀️ <span>Light</span>":"🌙 <span>Dark</span>"}
        </button>
        <button class="header-cart" data-open-cart="true">Bag <span class="header-cart__count">0</span></button>
      </div>
    </div>
    <nav class="nav">
      <button class="nav__toggle" aria-expanded="false" aria-controls="nav-menu">☰</button>
      <ul id="nav-menu" class="nav__list">
        <li><a href="index.html" ${activeCat===""?"class='active'":""}>Home</a></li>
        <li class="deals-link"><a href="deals.html" ${activeCat==="deals"?"class='active'":""}>Deals</a></li>
        <li><a href="category.html?cat=new" ${activeCat==="new"?"class='active'":""}>New In</a></li>
        <li><a href="category.html?cat=Electronics" ${activeCat==="Electronics"?"class='active'":""}>Electronics</a></li>
        <li><a href="category.html?cat=Womens" ${activeCat==="Womens"?"class='active'":""}>Women's</a></li><li><a href="category.html?cat=Mens" ${activeCat==="Mens"?"class='active'":""}>Men's</a></li><li><a href="category.html?cat=Kids" ${activeCat==="Kids"?"class='active'":""}>Kids</a></li>
        <li><a href="category.html?cat=Make Up" ${activeCat==="Make Up"?"class='active'":""}>Beauty</a></li>
        <li><a href="category.html?cat=Accessories" ${activeCat==="Accessories"?"class='active'":""}>Accessories</a></li>
        <li><a href="category.html?cat=Fitness" ${activeCat==="Fitness"?"class='active'":""}>Sports</a></li>
        <li><a href="category.html?cat=Kitchen" ${activeCat==="Kitchen"?"class='active'":""}>Kitchen</a></li>
        <li><a href="all-categories.html">View All</a></li>
      </ul>
    </nav>
  </header>
  <div class="cart-backdrop" id="cart-backdrop"></div>
  <aside id="cart-panel" class="cart cart--hidden">
    <header class="cart__header">
      <h2>My Bag</h2>
      <button class="cart__close" data-close-cart="true">×</button>
    </header>
    <div class="shipping-bar">
      <p class="shipping-bar__text" id="shipping-bar-text">Loading…</p>
      <div class="shipping-bar__track"><div class="shipping-bar__fill" id="shipping-fill" style="width:0%"></div></div>
    </div>
    <div class="cart__body">
      <ul class="cart__items" id="cart-items"></ul>
      <p class="cart__empty" id="cart-empty-msg">Your bag is empty. Start shopping!</p>
    </div>
    <footer class="cart__footer">
      <div class="promo-row">
        <input id="promo-input" type="text" placeholder="Promo code (SILK-SYNTAX)"/>
        <button onclick="applyPromo()" class="btn btn--secondary" style="font-size:.75rem;padding:7px 12px;">Apply</button>
      </div>
      <p id="promo-msg" style="font-size:.75rem;margin:4px 0 10px;"></p>
      <dl class="cart__summary">
        <div><dt>Subtotal</dt><dd id="cart-subtotal">${currentRegion.symbol} 0.00</dd></div>
        <div><dt>Discount</dt><dd id="cart-discount" style="color:#4a9e6b;">-${currentRegion.symbol} 0.00</dd></div>
        <div><dt>Tax (5%)</dt><dd id="cart-tax">${currentRegion.symbol} 0.00</dd></div>
        <div><dt><strong>Total</strong></dt><dd id="cart-total"><strong>${currentRegion.symbol} 0.00</strong></dd></div>
      </dl>
      <button class="btn btn--primary btn--full" id="checkout-btn" disabled>Proceed to Checkout →</button>
      <p class="cart__status" id="checkout-status"></p>
    </footer>
  </aside>
  <div class="modal-backdrop" id="auth-backdrop" style="display:none;" onclick="closeAuthModal()"></div>
  <div class="modal" id="auth-modal" style="display:none;">
    <button class="modal-close" onclick="closeAuthModal()">×</button>
    <div id="auth-login-view">
      <h2 class="modal-title">Welcome Back</h2>
      <p class="modal-sub">Sign in to your account</p>
      <div class="form-group"><label>Email</label><input id="login-email" type="email" placeholder="you@example.com"/></div>
      <div class="form-group"><label>Password</label><input id="login-pass" type="password" placeholder="••••••••"/></div>
      <button class="btn btn--primary btn--full" onclick="doLogin()" style="margin-top:8px;">Sign In</button>
      <p style="text-align:center;font-size:.82rem;margin-top:14px;color:var(--color-text-muted);">No account? <a href="#" onclick="openAuthModal('register')" style="color:var(--color-text);font-weight:600;text-decoration:underline;">Register free</a></p>
    </div>
    <div id="auth-register-view" style="display:none;">
      <h2 class="modal-title">Create Account</h2>
      <p class="modal-sub">Join Fix-It Forward Shop</p>
      <div class="form-group"><label>Full Name</label><input id="reg-name" type="text" placeholder="Jane Doe"/></div>
      <div class="form-group"><label>Email</label><input id="reg-email" type="email" placeholder="you@example.com"/></div>
      <div class="form-group"><label>Password</label><input id="reg-pass" type="password" placeholder="Min. 6 characters"/></div>
      <button class="btn btn--primary btn--full" onclick="doRegister()" style="margin-top:8px;">Create Account</button>
      <p style="text-align:center;font-size:.82rem;margin-top:14px;color:var(--color-text-muted);">Have an account? <a href="#" onclick="openAuthModal('login')" style="color:var(--color-text);font-weight:600;text-decoration:underline;">Sign in</a></p>
    </div>
    <div id="auth-success-view" style="display:none;text-align:center;padding:20px 0;">
      <div style="font-size:2.5rem;margin-bottom:12px;">🎉</div>
      <h2 class="modal-title" id="auth-success-title">Welcome!</h2>
      <p id="auth-success-msg" class="modal-sub"></p>
      <button class="btn btn--primary" onclick="closeAuthModal();location.reload();" style="margin-top:16px;">Continue</button>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("afterbegin", html);
  bindHeaderEvents();
}

function bindHeaderEvents(){
  document.querySelector("[data-open-cart]")?.addEventListener("click", openCart);
  document.querySelector("[data-close-cart]")?.addEventListener("click", closeCart);
  document.getElementById("cart-backdrop")?.addEventListener("click", closeCart);
  document.getElementById("checkout-btn")?.addEventListener("click",()=>{ saveCart(); window.location.href="checkout.html"; });
  const navToggle = document.querySelector(".nav__toggle");
  const navList   = document.getElementById("nav-menu");
  navToggle?.addEventListener("click",()=>{ navList.classList.toggle("open"); navToggle.setAttribute("aria-expanded",navList.classList.contains("open")); });
  document.getElementById("region-btn")?.addEventListener("click",e=>{ e.stopPropagation(); document.getElementById("region-dropdown").classList.toggle("open"); });
  document.getElementById("user-menu-btn")?.addEventListener("click",e=>{ e.stopPropagation(); document.getElementById("user-dropdown").classList.toggle("open"); });
  document.addEventListener("click",()=>{ document.getElementById("region-dropdown")?.classList.remove("open"); document.getElementById("user-dropdown")?.classList.remove("open"); });
  renderCart();
  initCookieBanner();
}

function changeRegion(code){ saveRegion(code); showToast(`Region: ${REGIONS[code].name} · ${REGIONS[code].currency}`); setTimeout(()=>location.reload(),900); }

// ── Footer ────────────────────────────────────────────────────
function injectFooter(){
  document.body.insertAdjacentHTML("beforeend",`
  <footer class="site-footer" id="footer">
    <div class="footer-grid">
      <div>
        <span class="footer-logo">fix-it-<span>forward</span></span>
        <p style="font-size:.82rem;color:rgba(255,255,255,.45);line-height:1.7;">Premium fashion & lifestyle.<br/>Curated for you.</p>
      </div>
      <div>
        <p class="footer-heading">Shop</p>
        <a href="category.html?cat=Womens" ${activeCat==="Womens"?"class='active'":""}>Women's</a></li><li><a href="category.html?cat=Mens" ${activeCat==="Mens"?"class='active'":""}>Men's</a></li><li><a href="category.html?cat=Kids" ${activeCat==="Kids"?"class='active'":""}>Kids</a>
        <a href="category.html?cat=Make Up">Beauty</a>
        <a href="category.html?cat=Electronics">Electronics</a>
        <a href="category.html?cat=Accessories">Accessories</a>
        <a href="deals.html">Deals </a>
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
  </footer>`);
  document.querySelectorAll(".footer-year").forEach(el=>el.textContent=new Date().getFullYear());
}

// ── Cookie banner ─────────────────────────────────────────────
function initCookieBanner(){
  if(localStorage.getItem("fif_cookie")) return;
  document.body.insertAdjacentHTML("beforeend",`
  <div class="cookie-banner" id="cookie-banner">
    <span>🍪 We use cookies to improve your experience. <a href="#" style="color:var(--color-text);text-decoration:underline;">Learn more</a></span>
    <div style="display:flex;gap:8px;">
      <button class="btn btn--secondary" style="font-size:.75rem;padding:6px 14px;" onclick="document.getElementById('cookie-banner').classList.add('hidden');localStorage.setItem('fif_cookie','declined')">Decline</button>
      <button class="btn btn--primary"   style="font-size:.75rem;padding:6px 14px;" onclick="document.getElementById('cookie-banner').classList.add('hidden');localStorage.setItem('fif_cookie','accepted')">Accept All</button>
    </div>
  </div>`);
}

// ── Shared CSS ────────────────────────────────────────────────
const _s=document.createElement("style");
_s.textContent=`
@keyframes toastIn{ from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
.region-selector{position:relative}
.region-btn{background:none;border:1px solid var(--color-border-subtle);border-radius:var(--radius-pill);padding:6px 12px;font-size:.72rem;cursor:pointer;color:var(--color-text);font-family:var(--font-body);white-space:nowrap;transition:border-color .18s}
.region-btn:hover{border-color:var(--color-champagne)}
.region-dropdown{display:none;position:absolute;right:0;top:calc(100% + 6px);background:var(--color-surface);border:1px solid var(--color-border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-soft);min-width:180px;z-index:200;overflow:hidden}
.region-dropdown.open{display:block}
.region-option{display:flex;justify-content:space-between;width:100%;padding:10px 16px;background:none;border:none;cursor:pointer;font-size:.82rem;font-family:var(--font-body);color:var(--color-text);transition:background .15s}
.region-option:hover{background:var(--color-marble)}
.region-option.active{font-weight:600}
.region-option span{color:var(--color-text-muted)}
.auth-area{display:flex;align-items:center;gap:6px}
.user-menu-wrap{position:relative}
.user-btn{background:none;border:1px solid var(--color-border-subtle);border-radius:var(--radius-pill);padding:6px 12px;font-size:.78rem;cursor:pointer;color:var(--color-text);font-family:var(--font-body);transition:border-color .18s}
.user-btn:hover{border-color:var(--color-champagne)}
.user-dropdown{display:none;position:absolute;right:0;top:calc(100%+6px);background:var(--color-surface);border:1px solid var(--color-border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-soft);min-width:160px;z-index:200;overflow:hidden}
.user-dropdown.open{display:block}
.user-dropdown a,.user-dropdown button{display:block;width:100%;padding:10px 16px;text-decoration:none;color:var(--color-text);font-size:.82rem;background:none;border:none;cursor:pointer;text-align:left;font-family:var(--font-body);transition:background .15s}
.user-dropdown a:hover,.user-dropdown button:hover{background:var(--color-marble)}
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:300;backdrop-filter:blur(3px)}
.modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--color-surface);border-radius:var(--radius-lg);padding:36px 32px;width:min(420px,92vw);z-index:301;box-shadow:0 24px 60px rgba(0,0,0,.18)}
.modal-close{position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--color-text-muted);transition:transform .18s}
.modal-close:hover{transform:rotate(90deg)}
.modal-title{font-family:var(--font-display);font-size:1.6rem;margin:0 0 4px;color:var(--color-text)}
.modal-sub{font-size:.85rem;color:var(--color-text-muted);margin:0 0 20px}
.form-group{display:flex;flex-direction:column;gap:5px;margin-bottom:14px}
.form-group label{font-size:.8rem;color:var(--color-text-muted)}
.form-group input{padding:10px 14px;border:1px solid var(--color-border-subtle);border-radius:var(--radius-md);font-family:var(--font-body);font-size:.88rem;color:var(--color-text);background:var(--color-marble);outline:none;transition:border-color .18s}
.form-group input:focus{border-color:var(--color-champagne)}
.header-auth-btn{white-space:nowrap}
@media(max-width:900px){.header-auth-btn{display:none}}
`;
document.head.appendChild(_s);
