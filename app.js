// ============================================================
//  app.js  —  Fix-It Forward · Homepage product logic
//  header.js handles: cart, auth, region, toast, footer
// ============================================================

let activeCategory = "All";

window.setCategory = function(cat) {
  activeCategory = cat;
  buildCategoryButtons();
  applyFilters();
};

// ─── Render products ─────────────────────────────────────────
function renderProducts(list) {
  const grid     = document.getElementById("product-grid");
  const template = document.getElementById("product-card-template");
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--color-text-muted);grid-column:1/-1;padding:40px 0;text-align:center;">
      No products found.</p>`;
    return;
  }

  list.forEach(product => {
    const clone   = template.content.cloneNode(true);
    const article = clone.querySelector(".product");
    article.dataset.productId = product.id;

    if (product.comparePrice) {
      const badge = document.createElement("span");
      badge.className   = "product__badge";
      badge.textContent = `-${Math.round((1 - product.price / product.comparePrice) * 100)}%`;
      article.appendChild(badge);
    }

    clone.querySelector(".product__image").src               = product.image;
    clone.querySelector(".product__image").alt               = product.name;
    clone.querySelector(".product__title").textContent       = product.name;
    clone.querySelector(".product__description").textContent = product.description;
    clone.querySelector(".product__price").textContent       = formatPrice(product.price);

    const compareEl = clone.querySelector(".product__price--compare");
    if (product.comparePrice) {
      compareEl.textContent = formatPrice(product.comparePrice);
    } else {
      compareEl.style.display = "none";
    }

    const stockEl = clone.querySelector(".product__stock");
    if (product.stock === 0) {
      stockEl.textContent = "Out of stock";
      stockEl.style.color = "#e05252";
      clone.querySelector(".product__add").disabled    = true;
      clone.querySelector(".product__add").textContent = "Unavailable";
    } else if (product.stock <= 5) {
      stockEl.textContent = `Only ${product.stock} left!`;
      stockEl.style.color = "#d97706";
    } else {
      stockEl.textContent = "In stock";
    }

    // Favourites
    const favBtn    = clone.querySelector(".product__favorite");
    const savedFavs = JSON.parse(localStorage.getItem("fif_favs") || "[]");
    if (savedFavs.includes(product.id)) {
      favBtn.textContent = "♥";
      favBtn.style.color = "#e05252";
      favBtn.setAttribute("aria-pressed", "true");
    }
    favBtn.addEventListener("click", () => {
      let favs = JSON.parse(localStorage.getItem("fif_favs") || "[]");
      if (favs.includes(product.id)) {
        favs = favs.filter(f => f !== product.id);
        favBtn.textContent = "♡"; favBtn.style.color = "";
        favBtn.setAttribute("aria-pressed", "false");
      } else {
        favs.push(product.id);
        favBtn.textContent = "♥"; favBtn.style.color = "#e05252";
        favBtn.setAttribute("aria-pressed", "true");
      }
      localStorage.setItem("fif_favs", JSON.stringify(favs));
    });

    // Add to cart
    clone.querySelector(".product__add").addEventListener("click", () => {
      const qty = parseInt(clone.querySelector(".product__qty-input").value) || 1;
      addToCart(product, qty);
    });

    grid.appendChild(clone);
  });
}

// ─── Filter / sort ────────────────────────────────────────────
function getFiltered() {
  const query = (document.getElementById("search-input")?.value ||
                 document.getElementById("search-input-mobile")?.value || "").toLowerCase().trim();
  const sort  = document.getElementById("sort-select").value;

  let list = products.filter(p => {
    const matchCat    = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query) ||
                        p.category.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  if (sort === "price-asc")  list.sort((a,b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a,b) => b.price - a.price);
  return list;
}

function applyFilters() { renderProducts(getFiltered()); }

// ─── Category pills ───────────────────────────────────────────
function buildCategoryButtons() {
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const container  = document.createElement("div");
  container.id     = "category-filters";

  categories.forEach(cat => {
    const btn       = document.createElement("button");
    btn.textContent = cat;
    btn.className   = cat === activeCategory ? "btn btn--primary" : "btn btn--secondary";
    btn.style.cssText = "font-size:.72rem;padding:6px 16px;";
    btn.addEventListener("click", () => {
      activeCategory = cat;
      buildCategoryButtons();
      applyFilters();
    });
    container.appendChild(btn);
  });

  const existing = document.getElementById("category-filters");
  const grid     = document.getElementById("product-grid");
  existing ? existing.replaceWith(container)
           : grid.parentElement.insertBefore(container, grid);
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Search sync
  const si  = document.getElementById("search-input");
  const sim = document.getElementById("search-input-mobile");
  si?.addEventListener("input",  applyFilters);
  sim?.addEventListener("input", () => { if(si) si.value = sim.value; applyFilters(); });

  // Sort
  document.getElementById("sort-select")?.addEventListener("change", applyFilters);

  // Checkout btn
  document.getElementById("checkout-btn")?.addEventListener("click", () => {
    saveCart();
    window.location.href = "checkout.html";
  });

  buildCategoryButtons();
  renderProducts(products);
});