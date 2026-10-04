/* ============================================
   NEXSTORE - E-Commerce JavaScript
   CodeAlpha Internship - Task 1
   ============================================ */

// ===== DATA =====
const PRODUCTS = [
  { id:1, name:"Sony WH-1000XM5 Headphones", category:"audio", price:299, originalPrice:399, discount:25, rating:4.9, reviews:2847, emoji:"🎧", badge:"hot", desc:"Industry-leading noise cancellation with exceptional audio quality. 30-hour battery life, multipoint connection, and premium comfort.", features:["ANC","30hr Battery","Multipoint","Hi-Res Audio"], isNew:false },
  { id:2, name:"Apple Watch Series 9", category:"wearables", price:399, originalPrice:429, discount:7, rating:4.8, reviews:5321, emoji:"⌚", badge:"new", desc:"The most advanced Apple Watch yet. Track fitness, monitor health metrics, and stay connected — all from your wrist.", features:["ECG","Blood O2","GPS","Always-On Display"], isNew:true },
  { id:3, name:"MacBook Air M3", category:"laptops", price:1099, originalPrice:1299, discount:15, rating:4.9, reviews:3102, emoji:"💻", badge:"sale", desc:"Supercharged by M3. Strikingly thin and light, with up to 18 hours of battery and incredible performance.", features:["M3 Chip","18hr Battery","Retina Display","8GB RAM"], isNew:false },
  { id:4, name:"iPhone 15 Pro Max", category:"phones", price:1199, originalPrice:1199, discount:0, rating:4.8, reviews:9241, emoji:"📱", badge:"new", desc:"Titanium. So strong. So light. So Pro. With the powerful A17 Pro chip and a revolutionary camera system.", features:["A17 Pro","48MP Camera","USB-C","ProMotion"], isNew:true },
  { id:5, name:"PlayStation 5 Pro", category:"gaming", price:699, originalPrice:799, discount:12, rating:4.9, reviews:4512, emoji:"🎮", badge:"hot", desc:"Play your games in stunning 8K. Experience lightning-fast loading with the ultra-high-speed SSD.", features:["8K Gaming","120fps","DualSense","Ray Tracing"], isNew:false },
  { id:6, name:"Samsung Galaxy Buds 3 Pro", category:"audio", price:229, originalPrice:279, discount:18, rating:4.7, reviews:1893, emoji:"🎵", badge:"sale", desc:"Intelligent ANC and high-quality audio in a sleek, compact design. Hi-Fi audio with 360° audio support.", features:["ANC","Hi-Fi Sound","6hr Battery","IPX7"], isNew:false },
  { id:7, name:"Garmin Fenix 7 Pro", category:"wearables", price:649, originalPrice:749, discount:13, rating:4.8, reviews:987, emoji:"🏃", badge:"", desc:"Premium multisport GPS smartwatch built for adventure. Solar charging, advanced health monitoring, and topographic maps.", features:["Solar Charging","GPS","Heart Rate","18-day Battery"], isNew:false },
  { id:8, name:"ASUS ROG Zephyrus G16", category:"laptops", price:1499, originalPrice:1799, discount:17, rating:4.7, reviews:1244, emoji:"🖥️", badge:"sale", desc:"The ultimate gaming laptop with AMD Ryzen 9 and NVIDIA RTX 4080. Mini LED display with 240Hz refresh rate.", features:["RTX 4080","240Hz","Mini LED","DDR5"], isNew:false },
  { id:9, name:"Google Pixel 9 Pro", category:"phones", price:999, originalPrice:1099, discount:9, rating:4.7, reviews:2167, emoji:"📷", badge:"new", desc:"AI-powered photography and Google's most powerful chip. Temperature sensor, 7 years of updates.", features:["Tensor G4","AI Camera","7yr Updates","Titanium"], isNew:true },
  { id:10, name:"Xbox Series X Bundle", category:"gaming", price:549, originalPrice:599, discount:8, rating:4.8, reviews:3389, emoji:"🕹️", badge:"", desc:"The most powerful Xbox ever. True 4K gaming, 120 FPS, DirectX 12 Ultimate, and 1TB NVMe SSD.", features:["4K 120fps","1TB SSD","Game Pass","Quick Resume"], isNew:false },
  { id:11, name:"JBL Xtreme 4 Speaker", category:"audio", price:379, originalPrice:449, discount:16, rating:4.6, reviews:743, emoji:"🔊", badge:"", desc:"Powerful portable Bluetooth speaker with JBL Pro Sound. IP67 waterproof, 24-hour battery, and built-in powerbank.", features:["IP67","24hr Battery","Powerbank","BT 5.3"], isNew:false },
  { id:12, name:"Samsung Galaxy Watch 7", category:"wearables", price:299, originalPrice:349, discount:14, rating:4.6, reviews:1567, emoji:"🕐", badge:"new", desc:"AI-powered health insights, ultra-precise dual frequency GPS, and advanced wellness features.", features:["AI Health","Dual GPS","Sleep Tracking","40hr Battery"], isNew:true },
];

const CATEGORIES = [
  { name:"Audio", filter:"audio", icon:"🎧", count:3 },
  { name:"Wearables", filter:"wearables", icon:"⌚", count:3 },
  { name:"Laptops", filter:"laptops", icon:"💻", count:2 },
  { name:"Phones", filter:"phones", icon:"📱", count:2 },
  { name:"Gaming", filter:"gaming", icon:"🎮", count:2 },
  { name:"Accessories", filter:"all", icon:"🔌", count:12 },
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('nexstore_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('nexstore_wishlist') || '[]');
let currentFilter = 'all';
let currentSort = 'default';
let displayedCount = 8;
let currentUser = JSON.parse(localStorage.getItem('nexstore_user') || 'null');
let countdown_target = Date.now() + (8 * 3600 + 45 * 60 + 30) * 1000;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderParticles();
  renderCategories();
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  startCountdown();
  initNavbar();
  initEvents();
  updateUserBtn();
});

// ===== PARTICLES =====
function renderParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;animation-duration:${6+Math.random()*10}s;animation-delay:${-Math.random()*15}s;opacity:${Math.random()*0.6};width:${1+Math.random()*3}px;height:${1+Math.random()*3}px;background:${Math.random()>0.5?'#7c3aed':'#06b6d4'};`;
    container.appendChild(p);
  }
}

// ===== CATEGORIES =====
function renderCategories() {
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = CATEGORIES.map(c => `
    <div class="category-card" onclick="filterByCategory('${c.filter}')" tabindex="0" role="button" aria-label="${c.name}">
      <span class="category-icon">${c.icon}</span>
      <div class="category-name">${c.name}</div>
      <div class="category-count">${c.count} products</div>
    </div>
  `).join('');
}

function filterByCategory(filter) {
  currentFilter = filter;
  document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.toggle('active', t.dataset.filter === filter));
    displayedCount = 8;
    renderProducts();
  }, 400);
}

// ===== PRODUCTS =====
function getFilteredSorted() {
  let list = currentFilter === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === currentFilter);
  switch (currentSort) {
    case 'price-asc': list.sort((a,b) => a.price - b.price); break;
    case 'price-desc': list.sort((a,b) => b.price - a.price); break;
    case 'rating': list.sort((a,b) => b.rating - a.rating); break;
    case 'newest': list.sort((a,b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
  }
  const search = document.getElementById('search-input').value.toLowerCase().trim();
  if (search) list = list.filter(p => p.name.toLowerCase().includes(search) || p.category.includes(search));
  return list;
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const list = getFilteredSorted();
  const toShow = list.slice(0, displayedCount);

  if (toShow.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)"><div style="font-size:48px;margin-bottom:16px">🔍</div><p>No products found. Try a different search.</p></div>`;
    document.getElementById('load-more-btn').style.display = 'none';
    return;
  }

  grid.innerHTML = toShow.map(p => productCard(p)).join('');
  document.getElementById('load-more-btn').style.display = list.length > displayedCount ? 'inline-flex' : 'none';

  // Staggered animation
  grid.querySelectorAll('.product-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 50);
  });
}

function productCard(p) {
  const inWishlist = wishlist.includes(p.id);
  const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');
  return `
  <div class="product-card" id="product-card-${p.id}">
    <div class="product-img-wrapper">
      <div class="product-img">${p.emoji}</div>
      <div class="product-badges">
        ${p.badge === 'sale' ? '<span class="badge-tag badge-sale">Sale</span>' : ''}
        ${p.badge === 'new' ? '<span class="badge-tag badge-new">New</span>' : ''}
        ${p.badge === 'hot' ? '<span class="badge-tag badge-hot">Hot</span>' : ''}
      </div>
      <div class="product-actions">
        <button class="action-btn ${inWishlist?'wishlisted':''}" onclick="toggleWishlist(event,${p.id})" id="wish-btn-${p.id}" title="${inWishlist?'Remove from Wishlist':'Add to Wishlist'}">${inWishlist?'❤️':'🤍'}</button>
        <button class="action-btn" onclick="openProductModal(${p.id})" id="quick-view-${p.id}" title="Quick View">👁️</button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-category">${p.category}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating">
        <span class="stars">${stars}</span>
        <span class="rating-count">(${p.reviews.toLocaleString()})</span>
      </div>
      <div class="product-price">
        <span class="price-current">$${p.price.toLocaleString()}</span>
        ${p.originalPrice > p.price ? `<span class="price-original">$${p.originalPrice.toLocaleString()}</span><span class="price-discount">-${p.discount}%</span>` : ''}
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${p.id})" id="cart-add-${p.id}">🛒 Add to Cart</button>
    </div>
  </div>`;
}

// ===== PRODUCT MODAL =====
function openProductModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');
  const inWishlist = wishlist.includes(p.id);
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-img-side">${p.emoji}</div>
    <div class="modal-info-side">
      <div class="modal-category">${p.category}</div>
      <div class="modal-name">${p.name}</div>
      <div class="modal-rating">
        <span class="stars">${stars}</span>
        <span style="color:var(--text-muted);font-size:13px;">${p.rating} · (${p.reviews.toLocaleString()} reviews)</span>
      </div>
      <div class="modal-desc">${p.desc}</div>
      <div class="modal-features">${p.features.map(f=>`<span class="feature-tag">${f}</span>`).join('')}</div>
      <div class="modal-price-row">
        <span class="modal-price">$${p.price.toLocaleString()}</span>
        ${p.originalPrice > p.price ? `<span class="modal-original">$${p.originalPrice.toLocaleString()}</span><span class="modal-discount">-${p.discount}% OFF</span>` : ''}
      </div>
      <div class="modal-qty">
        <label>Qty:</label>
        <div class="qty-control">
          <button class="qty-btn" id="qty-dec" onclick="changeQty(-1)">−</button>
          <input class="qty-input" id="modal-qty-input" type="number" value="1" min="1" max="10" />
          <button class="qty-btn" id="qty-inc" onclick="changeQty(1)">+</button>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary full-width" id="modal-add-cart" onclick="addToCartFromModal(${p.id})">🛒 Add to Cart</button>
        <button class="btn btn-ghost full-width ${inWishlist?'':'outline'}" id="modal-wishlist-btn" onclick="toggleWishlist(event,${p.id});this.textContent=wishlist.includes(${p.id})?'❤️ Remove from Wishlist':'🤍 Add to Wishlist';">${inWishlist?'❤️ Remove from Wishlist':'🤍 Add to Wishlist'}</button>
      </div>
    </div>
  `;
  document.getElementById('product-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function changeQty(delta) {
  const inp = document.getElementById('modal-qty-input');
  let val = parseInt(inp.value) + delta;
  inp.value = Math.min(10, Math.max(1, val));
}

function addToCartFromModal(id) {
  const qty = parseInt(document.getElementById('modal-qty-input').value) || 1;
  for (let i = 0; i < qty; i++) addToCart(id, true);
  closeModal('product-modal');
  showToast('success', '🛒 Added to Cart!', `${qty}x item added to your cart`);
}

// ===== CART =====
function addToCart(id, silent = false) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty = Math.min(existing.qty + 1, 10);
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  updateCartUI();
  if (!silent) showToast('success', '🛒 Added to Cart!', `${p.name} added successfully`);
  animateCartBtn();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty = Math.max(1, Math.min(10, item.qty + delta));
  saveCart();
  updateCartUI();
  renderCartItems();
}

function saveCart() { localStorage.setItem('nexstore_cart', JSON.stringify(cart)); }

function updateCartUI() {
  const total = cart.reduce((sum, c) => sum + c.qty, 0);
  document.getElementById('cart-count').textContent = total;
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById(''cart-items'');
  const footer = document.getElementById(''cart-footer'');
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty" id="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <a href="#products" class="btn btn-primary" id="continue-shopping" onclick="closeCart()">Start Shopping</a>
      </div>`;
    if (footer) footer.style.display = ''none'';
    return;
  }
  if (footer) footer.style.display = ''flex'';
  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return '';
    const lineTotal = p.price * item.qty;
    subtotal += lineTotal;
    return `
    <div class="cart-item" id="cart-item-${p.id}">
      <div class="cart-item-emoji">${p.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-price">$${lineTotal.toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="ci-qty-btn" onclick="updateCartQty(${p.id},-1)" id="ci-dec-${p.id}">−</button>
          <span class="ci-qty-val">${item.qty}</span>
          <button class="ci-qty-btn" onclick="updateCartQty(${p.id},1)" id="ci-inc-${p.id}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${p.id})" id="ci-rem-${p.id}" title="Remove">✕</button>
    </div>`;
  }).join('');
  document.getElementById('cart-subtotal').textContent = `$${subtotal.toLocaleString()}`;
  document.getElementById('cart-total').textContent = `$${subtotal.toLocaleString()}`;
}

function animateCartBtn() {
  const btn = document.getElementById('cart-btn');
  btn.style.transform = 'scale(1.3)';
  btn.style.background = 'rgba(124,58,237,0.3)';
  setTimeout(() => { btn.style.transform = ''; btn.style.background = ''; }, 350);
}

// ===== WISHLIST =====
function toggleWishlist(e, id) {
  e.stopPropagation();
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('info', '🤍 Removed', `${p.name} removed from wishlist`);
  } else {
    wishlist.push(id);
    showToast('success', '❤️ Wishlisted!', `${p.name} added to wishlist`);
  }
  localStorage.setItem('nexstore_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  renderProducts();
}

function updateWishlistUI() {
  document.getElementById('wishlist-count').textContent = wishlist.length;
}

// ===== OPEN/CLOSE MODALS =====
function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}

// ===== CHECKOUT =====
function openCheckout() {
  closeCart();
  const summaryEl = document.getElementById('order-summary-mini');
  let html = '';
  let total = 0;
  cart.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return;
    const lineTotal = p.price * item.qty;
    total += lineTotal;
    html += `<p><span>${p.emoji} ${p.name} x${item.qty}</span><span>$${lineTotal.toLocaleString()}</span></p>`;
  });
  html += `<div class="total-line"><span>Total</span><span>$${total.toLocaleString()}</span></div>`;
  summaryEl.innerHTML = html;
  openModal('checkout-modal');
}

function placeOrder() {
  const orderId = 'NX-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  document.getElementById('order-id-display').textContent = orderId;
  document.getElementById('checkout-step-1').classList.add('hidden');
  document.getElementById('checkout-step-2').classList.remove('hidden');
  cart = [];
  saveCart();
  updateCartUI();
  showToast('success', '🎉 Order Placed!', `Order ${orderId} confirmed`);
}

// ===== COUNTDOWN =====
function startCountdown() {
  const target = countdown_target;
  function tick() {
    const diff = Math.max(0, target - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('hours').textContent = String(h).padStart(2,'0');
    document.getElementById('minutes').textContent = String(m).padStart(2,'0');
    document.getElementById('seconds').textContent = String(s).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}

// ===== TOAST =====
function showToast(type, title, msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><div class="toast-body"><div class="toast-title">${title}</div>${msg?`<div class="toast-msg">${msg}</div>`:''}</div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

// ===== AUTH =====
function updateUserBtn() {
  const btn = document.getElementById('login-btn');
  if (currentUser) {
    btn.title = `Logged in as ${currentUser.name}`;
    btn.style.border = '2px solid var(--primary-light)';
  } else {
    btn.title = 'Login';
    btn.style.border = '';
  }
}

// ===== NAVBAR =====
function initNavbar() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    const sections = ['home','categories','deals','products','contact'];
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 100) current = id;
    });
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  });
}

// ===== EVENTS =====
function initEvents() {
  // Hamburger
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
  });

  // Cart open/close
  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);

  // Checkout
  document.getElementById('checkout-btn').addEventListener('click', openCheckout);
  document.getElementById('continue-shop-btn').addEventListener('click', closeCart);
  document.getElementById('checkout-modal-close').addEventListener('click', () => closeModal('checkout-modal'));
  document.getElementById('checkout-form').addEventListener('submit', e => { e.preventDefault(); placeOrder(); });
  document.getElementById('continue-after-order').addEventListener('click', () => {
    closeModal('checkout-modal');
    document.getElementById('checkout-step-1').classList.remove('hidden');
    document.getElementById('checkout-step-2').classList.add('hidden');
  });

  // Product modal close
  document.getElementById('modal-close').addEventListener('click', () => closeModal('product-modal'));
  document.getElementById('product-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal('product-modal'); });

  // Login modal
  document.getElementById('login-btn').addEventListener('click', () => openModal('login-modal'));
  document.getElementById('auth-modal-close').addEventListener('click', () => closeModal('login-modal'));
  document.getElementById('login-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal('login-modal'); });
  document.getElementById('login-tab-btn').addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('signup-tab-btn').addEventListener('click', () => switchAuthTab('signup'));
  document.getElementById('switch-to-signup').addEventListener('click', () => switchAuthTab('signup'));
  document.getElementById('switch-to-login').addEventListener('click', () => switchAuthTab('login'));

  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    currentUser = { name: email.split('@')[0], email };
    localStorage.setItem('nexstore_user', JSON.stringify(currentUser));
    updateUserBtn();
    closeModal('login-modal');
    showToast('success', '👋 Welcome Back!', `Hello, ${currentUser.name}!`);
  });

  document.getElementById('signup-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const pw = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    if (pw !== confirm) { showToast('error', '❌ Error', 'Passwords do not match'); return; }
    currentUser = { name, email };
    localStorage.setItem('nexstore_user', JSON.stringify(currentUser));
    updateUserBtn();
    closeModal('login-modal');
    showToast('success', '🎉 Account Created!', `Welcome, ${name}!`);
  });

  // Wishlist btn
  document.getElementById('wishlist-btn').addEventListener('click', () => {
    if (wishlist.length === 0) { showToast('info', '🤍 Wishlist Empty', 'Add products to your wishlist'); return; }
    currentFilter = 'all';
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    showToast('info', '❤️ Your Wishlist', `You have ${wishlist.length} item(s) wishlisted`);
  });

  // Filters
  document.getElementById('filter-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    displayedCount = 8;
    renderProducts();
  });

  document.getElementById('sort-select').addEventListener('change', e => {
    currentSort = e.target.value;
    renderProducts();
  });

  document.getElementById('search-input').addEventListener('input', () => {
    displayedCount = 8;
    renderProducts();
  });

  document.getElementById('search-btn').addEventListener('click', () => {
    displayedCount = 8;
    renderProducts();
  });

  document.getElementById('load-more-btn').addEventListener('click', () => {
    displayedCount += 4;
    renderProducts();
  });

  // Newsletter
  document.getElementById('newsletter-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    showToast('success', '📧 Subscribed!', `${email} has been subscribed`);
    document.getElementById('newsletter-email').value = '';
  });

  // Card number formatting
  document.getElementById('card-number').addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g,'').substr(0,16);
    e.target.value = v.replace(/(.{4})/g,'$1 ').trim();
  });
  document.getElementById('card-expiry').addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g,'').substr(0,4);
    if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2);
    e.target.value = v;
  });

  // Continue shopping in cart empty
  document.getElementById('continue-shopping').addEventListener('click', closeCart);

  // Close checkout modal clicking outside
  document.getElementById('checkout-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal('checkout-modal'); });

  // Keyboard close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('product-modal');
      closeModal('login-modal');
      closeModal('checkout-modal');
      closeCart();
    }
  });
}

function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('login-tab-btn').classList.toggle('active', isLogin);
  document.getElementById('signup-tab-btn').classList.toggle('active', !isLogin);
  document.getElementById('login-form').classList.toggle('hidden', !isLogin);
  document.getElementById('signup-form').classList.toggle('hidden', isLogin);
}

