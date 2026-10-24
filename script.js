const PRODUCTS = [
{id:1,n:"Wireless Headphones",c:"Electronics",p:2999,o:4999,r:4.5,e:"🎧",d:"Over-ear Bluetooth headphones with deep bass and 30-hour battery life."},
{id:2,n:"Smart Watch",c:"Electronics",p:3499,o:5999,r:4.3,e:"⌚",d:"Fitness tracking, heart-rate monitor and call notifications on your wrist."},
{id:3,n:"Bluetooth Speaker",c:"Electronics",p:1799,o:2999,r:4.4,e:"🔊",d:"Portable, water-resistant speaker with room-filling sound."},
{id:4,n:"Mechanical Keyboard",c:"Electronics",p:2499,o:3999,r:4.6,e:"⌨️",d:"Tactile switches with RGB backlight for typing and gaming."},
{id:5,n:"Running Shoes",c:"Fashion",p:2199,o:3499,r:4.2,e:"👟",d:"Lightweight, breathable shoes with cushioned soles for daily runs."},
{id:6,n:"Denim Jacket",c:"Fashion",p:1899,o:2999,r:4.1,e:"🧥",d:"Classic slim-fit denim jacket that goes with everything."},
{id:7,n:"Sunglasses",c:"Fashion",p:799,o:1499,r:4.0,e:"🕶️",d:"UV400 polarized lenses in a sturdy frame."},
{id:8,n:"Travel Backpack",c:"Fashion",p:1299,o:1999,r:4.5,e:"🎒",d:"25L water-resistant backpack with a padded laptop sleeve."},
{id:9,n:"Coffee Maker",c:"Home",p:3299,o:4499,r:4.4,e:"☕",d:"Brew fresh filter coffee at home in under 10 minutes."},
{id:10,n:"LED Table Lamp",c:"Home",p:899,o:1299,r:4.2,e:"💡",d:"Dimmable desk lamp with three colour modes and USB charging."},
{id:11,n:"Cotton Bedsheet",c:"Home",p:1099,o:1799,r:4.3,e:"🛏️",d:"Soft 100% cotton double bedsheet with two pillow covers."},
{id:12,n:"Air Fryer",c:"Home",p:4599,o:6999,r:4.7,e:"🍟",d:"4L air fryer for crispy food with up to 90% less oil."},
{id:13,n:"Yoga Mat",c:"Sports",p:699,o:1199,r:4.4,e:"🧘",d:"6mm anti-slip mat with a carry strap."},
{id:14,n:"Cricket Bat",c:"Sports",p:2699,o:3799,r:4.5,e:"🏏",d:"Kashmir willow bat, well balanced for tennis and leather ball."},
{id:15,n:"Steel Water Bottle",c:"Sports",p:399,o:699,r:4.3,e:"🍶",d:"1L insulated bottle keeps drinks cold for 24 hours."},
{id:16,n:"Dumbbell Set",c:"Sports",p:1999,o:2999,r:4.6,e:"🏋️",d:"Adjustable 2×5 kg rubber-coated dumbbell set."}
];
/* ---------- helpers & state ---------- */
const page = document.body.dataset.page;
const $ = s => document.querySelector(s);
const fmt = n => '₹' + n.toLocaleString('en-IN');
const ld = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d } catch (e) { return d } };
const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let cart = ld('cart', {}), wish = ld('wish', []), user = ld('user', null), coupon = ld('coupon', 0), Q = 1;
const qs = new URLSearchParams(location.search);
const find = id => PRODUCTS.find(p => p.id == id);
const bg = p => `background:hsl(${p.id * 47 % 360} 75% 60%/.18)`;
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
const off = p => Math.round(100 - p.p / p.o * 100);
const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
const wrap = h => $('#app').innerHTML = `<div class="wrap">${h}</div>`;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(window.tt); window.tt = setTimeout(() => t.classList.remove('on'), 1500) }
function draw() { $('#hdr').innerHTML = hdr(); if (pages[page]) pages[page]() }

/* ---------- header / footer ---------- */
function hdr() {
  return `<div class="nav"><a class="logo" href="index.html">🛍️ Cartly</a>
  <nav><a href="index.html">Home</a><a href="products.html">Shop</a><a href="about.html">About</a><a href="contact.html">Contact</a></nav>
  <form class="sf" onsubmit="event.preventDefault();location.href='products.html?q='+encodeURIComponent(this.q.value)"><input name="q" placeholder="Search products…"></form>
  <div class="ac"><a href="wishlist.html">❤️<b>${wish.length}</b></a><a href="cart.html">🛒<b>${count()}</b></a>
  ${user ? `<a href="orders.html">📦 ${esc(user.name.split(' ')[0])}</a><a href="#" onclick="logout()">Logout</a>` : `<a href="login.html">Login</a>`}</div></div>`;
}
const ftr = () => `<div><b>Cartly</b><span>Your one-stop online store.</span></div>
  <div><b>Shop</b><a href="products.html?cat=Electronics">Electronics</a><a href="products.html?cat=Fashion">Fashion</a><a href="products.html?cat=Home">Home</a></div>
  <div><b>Help</b><a href="about.html">About us</a><a href="contact.html">Contact</a><a href="orders.html">My orders</a></div>
  <div class="mu">© 2026 Cartly · Demo store, no real payments.</div>`;

/* ---------- cart, wishlist, auth ---------- */
function add(id, n = 1) { cart[id] = (cart[id] || 0) + n; sv('cart', cart); $('#hdr').innerHTML = hdr(); toast('Added to cart') }
function chg(id, d) { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; sv('cart', cart); draw() }
function tw(id) { wish = wish.includes(id) ? wish.filter(x => x != id) : [...wish, id]; sv('wish', wish); draw() }
function totals() {
  let s = 0; for (const id in cart) s += find(id).p * cart[id];
  const d = Math.round(s * coupon), sh = s && s - d < 999 ? 49 : 0; return { s, d, sh, t: s - d + sh };
}
function applyCoupon() { if ($('#cpn').value.trim().toUpperCase() == 'SAVE10') { coupon = .1; toast('Coupon applied: 10% off') } else { coupon = 0; toast('Invalid coupon') } sv('coupon', coupon); draw() }
const sumHTML = T => `<div class="row"><span>Subtotal</span><span>${fmt(T.s)}</span></div>
  ${T.d ? `<div class="row" style="color:var(--ok)"><span>Coupon discount</span><span>−${fmt(T.d)}</span></div>` : ''}
  <div class="row"><span>Delivery</span><span>${T.sh ? fmt(T.sh) : 'FREE'}</span></div><div class="row t"><span>Total</span><span>${fmt(T.t)}</span></div>`;
function logout() { user = null; sv('user', null); location.href = 'index.html' }
function goNext() { const n = qs.get('next'); location.href = /^[\w-]+\.html$/.test(n || '') ? n : 'index.html' }
function doSignup(e) {
  e.preventDefault(); const f = e.target, users = ld('users', []), email = f.email.value.trim().toLowerCase();
  if (f.pw.value.length < 6) return $('#err').textContent = 'Password must be at least 6 characters.';
  if (users.some(u => u.email == email)) return $('#err').textContent = 'This email is already registered.';
  users.push({ name: f.nm.value.trim(), email, pw: f.pw.value }); sv('users', users);
  sv('user', { name: f.nm.value.trim(), email }); goNext();
}
function doLogin(e) {
  e.preventDefault(); const f = e.target, email = f.email.value.trim().toLowerCase();
  const u = ld('users', []).find(u => u.email == email && u.pw == f.pw.value);
  if (!u) return $('#err').textContent = 'Wrong email or password.';
  sv('user', { name: u.name, email }); goNext();
}

/* ---------- shared UI pieces ---------- */
const card = p => `<div class="card"><button class="heart" onclick="tw(${p.id})">${wish.includes(p.id) ? '❤️' : '🤍'}</button>
  <a class="img" href="product.html?id=${p.id}" style="${bg(p)}">${p.e}</a><div class="in"><span class="mu">${p.c}</span>
  <a href="product.html?id=${p.id}"><b>${p.n}</b></a><div class="rt">${stars(p.r)} ${p.r}</div>
  <div class="pr">${fmt(p.p)} <s>${fmt(p.o)}</s> <em>${off(p)}% off</em></div><button class="btn" onclick="add(${p.id})">Add to cart</button></div></div>`;
const authForm = (title, fields, fn, foot) => wrap(`<form class="form" onsubmit="${fn}(event)"><h1>${title}</h1>${fields}<div class="err" id="err"></div>
  <button class="btn">${title}</button><p class="mu">${foot}</p></form>`);

/* ---------- pages ---------- */
let F = { cat: qs.get('cat') || 'All', q: qs.get('q') || '', sort: 'pop', max: 10000 };
const pages = {
  home() {
    const cats = [['Electronics', '🎧'], ['Fashion', '👗'], ['Home', '🏠'], ['Sports', '🏏']];
    $('#app').innerHTML = `<section class="hero"><div><h1>Mega Sale: up to 50% off</h1><p>Free delivery above ₹999. Use code SAVE10 for 10% extra.</p>
      <a class="btn big" href="products.html">Shop now</a></div><div class="he">🛍️</div></section>
      <div class="wrap"><h2>Shop by category</h2><div class="cats">${cats.map(c => `<a href="products.html?cat=${c[0]}"><span>${c[1]}</span>${c[0]}</a>`).join('')}</div>
      <h2>Top rated products</h2><div class="grid">${[...PRODUCTS].sort((a, b) => b.r - a.r).slice(0, 8).map(card).join('')}</div>
      <div class="perks"><div>🚚 Free delivery above ₹999</div><div>↩️ 7-day easy returns</div><div>🔒 Secure checkout</div><div>🎧 24/7 support</div></div></div>`;
  },
  products() {
    wrap(`<h1>${F.q ? 'Results for "' + esc(F.q) + '"' : 'All Products'}</h1>
      <div class="bar">${['All', 'Electronics', 'Fashion', 'Home', 'Sports'].map(c => `<button class="chip ${c == F.cat ? 'on' : ''}" onclick="F.cat='${c}';draw()">${c}</button>`).join('')}</div>
      <div class="bar"><span class="mu">Max price: <b id="mx">${fmt(F.max)}</b></span>
      <input type="range" min="500" max="10000" step="500" value="${F.max}" oninput="F.max=+this.value;$('#mx').textContent=fmt(F.max);grid()">
      <select style="margin-left:auto" onchange="F.sort=this.value;grid()">${[['pop', 'Popular'], ['lo', 'Price: Low to High'], ['hi', 'Price: High to Low'], ['rt', 'Top Rated']].map(o => `<option value="${o[0]}" ${F.sort == o[0] ? 'selected' : ''}>${o[1]}</option>`).join('')}</select></div>
      <p class="mu" id="cnt"></p><div class="grid" id="g"></div>`);
    grid();
  },
  product() {
    const p = find(qs.get('id')); if (!p) return wrap('<p>Product not found. <a href="products.html">Back to shop</a></p>');
    Q = 1;
    wrap(`<p class="mu"><a href="products.html">Shop</a> › ${p.c} › ${p.n}</p><div class="pd"><div class="img" style="${bg(p)}">${p.e}</div>
      <div class="tx"><span class="tag">${p.c}</span><h1>${p.n}</h1><div class="rt">${stars(p.r)} ${p.r}</div><p class="mu">${p.d}</p>
      <div class="pr" style="font-size:26px">${fmt(p.p)} <s>${fmt(p.o)}</s> <em>${off(p)}% off</em></div>
      <div class="qty"><button onclick="Q=Math.max(1,Q-1);$('#q').textContent=Q">−</button><b id="q">1</b><button onclick="Q++;$('#q').textContent=Q">+</button></div>
      <button class="btn" onclick="add(${p.id},Q)">Add to cart</button>
      <button class="btn alt" onclick="tw(${p.id})">${wish.includes(p.id) ? '❤️ In wishlist' : '🤍 Add to wishlist'}</button></div></div>
      <h2>You may also like</h2><div class="grid">${PRODUCTS.filter(x => x.c == p.c && x.id != p.id).slice(0, 4).map(card).join('')}</div>`);
  },
  cart() {
    const ids = Object.keys(cart), T = totals();
    wrap(`<h1>Your Cart</h1>${ids.length ? `<div class="two"><div>${ids.map(id => { const p = find(id); return `<div class="ci"><div class="th" style="${bg(p)}">${p.e}</div>
      <div class="fl"><a href="product.html?id=${p.id}"><b>${p.n}</b></a><div class="mu">${fmt(p.p)}</div><div class="qty"><button onclick="chg(${id},-1)">−</button>${cart[id]}<button onclick="chg(${id},1)">+</button></div></div><b>${fmt(p.p * cart[id])}</b></div>` }).join('')}</div>
      <div class="box">${sumHTML(T)}<div class="cp"><input id="cpn" placeholder="Coupon (SAVE10)"><button class="btn alt" onclick="applyCoupon()">Apply</button></div>
      <a class="btn" href="checkout.html">Proceed to Checkout</a></div></div>` : '<p>Your cart is empty. <a href="products.html"><b>Start shopping</b></a></p>'}`);
  },
  checkout() {
    if (!user) { location.href = 'login.html?next=checkout.html'; return }
    if (!count()) return wrap('<p>Your cart is empty. <a href="products.html">Shop now</a></p>');
    wrap(`<h1>Checkout</h1><div class="two"><div class="box"><div class="fg"><input id="nm" class="w" placeholder="Full name" value="${esc(user.name)}">
      <input id="ph" type="tel" maxlength="10" placeholder="Phone (10 digits)"><input id="pin" maxlength="6" placeholder="PIN code">
      <textarea id="ad" class="w" rows="3" placeholder="Delivery address"></textarea><input id="city" class="w" placeholder="City">
      <select id="pay" class="w"><option>Cash on Delivery</option><option>UPI (demo)</option><option>Card (demo)</option></select></div><div class="err" id="err"></div></div>
      <div class="box"><b>Order summary</b>${sumHTML(totals())}<button class="btn" onclick="placeOrder()">Place Order</button></div></div>`);
  },
  wishlist() {
    wrap(`<h1>My Wishlist</h1>${wish.length ? `<div class="grid">${wish.map(find).filter(Boolean).map(card).join('')}</div>` : '<p>Nothing here yet. <a href="products.html"><b>Browse products</b></a></p>'}`);
  },
  orders() {
    if (!user) { location.href = 'login.html?next=orders.html'; return }
    const L = ld('orders', []).filter(o => o.email == user.email);
    wrap(`<h1>My Orders</h1>${L.length ? L.map(o => `<div class="order"><div class="row"><b>${o.id}</b><span class="tag">Confirmed</span></div>
      <p class="mu">${o.date} · ${o.pay} · ${esc(o.addr)}</p>${o.items.map(i => `<div class="row"><span>${i.e} ${i.n} × ${i.q}</span><span>${fmt(i.p * i.q)}</span></div>`).join('')}
      <div class="row t"><span>Total</span><span>${fmt(o.total)}</span></div></div>`).join('') : '<p>No orders yet. <a href="products.html"><b>Start shopping</b></a></p>'}`);
  },
  login() { authForm('Login', '<input name="email" type="email" placeholder="Email" required><input name="pw" type="password" placeholder="Password" required>', 'doLogin', 'New here? <a href="signup.html"><b>Create an account</b></a>') },
  signup() { authForm('Sign Up', '<input name="nm" placeholder="Full name" required><input name="email" type="email" placeholder="Email" required><input name="pw" type="password" placeholder="Password (min 6 characters)" required>', 'doSignup', 'Already registered? <a href="login.html"><b>Login</b></a>') },
  about() {
    wrap(`<h1>About Cartly</h1><div class="box"><p>Cartly is a demo online store built with plain HTML, CSS and JavaScript. It has product browsing, search, filters, wishlist, cart, coupons, user accounts, checkout and order history.</p>
      <p class="mu">Everything is stored in your browser (localStorage). No real payments or data leave your device.</p></div>
      <div class="perks"><div>🛒 16 products</div><div>👤 Accounts</div><div>📦 Order history</div><div>🌙 Dark mode</div></div>`);
  },
  contact() {
    wrap(`<form class="form" onsubmit="event.preventDefault();this.innerHTML='<h1>Thank you! ✅</h1><p>We received your message and will reply soon.</p>'"><h1>Contact Us</h1>
      <input placeholder="Your name" required><input type="email" placeholder="Email" required><textarea rows="4" placeholder="Message" required></textarea><button class="btn">Send message</button>
      <p class="mu">📧 support@cartly.example · 📞 +91 90000 00000</p></form>`);
  }
};
function grid() {
  let L = PRODUCTS.filter(p => (F.cat == 'All' || p.c == F.cat) && p.n.toLowerCase().includes(F.q.toLowerCase()) && p.p <= F.max);
  if (F.sort == 'lo') L.sort((a, b) => a.p - b.p); else if (F.sort == 'hi') L.sort((a, b) => b.p - a.p); else if (F.sort == 'rt') L.sort((a, b) => b.r - a.r);
  $('#cnt').textContent = L.length + ' products'; $('#g').innerHTML = L.length ? L.map(card).join('') : '<p class="mu">No products found.</p>';
}
function placeOrder() {
  const g = id => $('#' + id).value.trim();
  if (!g('nm') || g('ph').replace(/\D/g, '').length != 10 || g('pin').replace(/\D/g, '').length != 6 || g('ad').length < 8 || !g('city')) return $('#err').textContent = 'Please fill all fields correctly.';
  const T = totals(), o = { id: 'CT' + Math.floor(1e5 + Math.random() * 9e5), email: user.email, date: new Date().toLocaleDateString('en-IN'),
    items: Object.keys(cart).map(id => ({ n: find(id).n, e: find(id).e, q: cart[id], p: find(id).p })), total: T.t, pay: $('#pay').value, addr: g('ad') + ', ' + g('city') + ' - ' + g('pin') };
  const all = ld('orders', []); all.unshift(o); sv('orders', all); cart = {}; coupon = 0; sv('cart', cart); sv('coupon', 0);
  $('#hdr').innerHTML = hdr();
  wrap(`<div class="done"><div class="big">✅</div><h1>Thank you, ${esc(g('nm'))}!</h1><p class="mu">Order <b>${o.id}</b> is placed. Total: <b>${fmt(o.total)}</b> (${o.pay}).<br>Estimated delivery in 3-5 days.</p>
    <p style="margin-top:20px"><a class="btn" href="orders.html">View my orders</a> <a class="btn alt" href="products.html">Continue shopping</a></p></div>`);
}

/* ---------- start ---------- */
$('#ftr').innerHTML = ftr();
draw();