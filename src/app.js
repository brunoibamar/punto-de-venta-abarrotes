const seed = [
  { id: crypto.randomUUID(), name: 'Coca-Cola 600 ml', code: '7501055300078', category: 'Bebidas', price: 20, cost: 14, stock: 18, unit: 'pieza' },
  { id: crypto.randomUUID(), name: 'Sabritas clásicas', code: '7501011114600', category: 'Botanas', price: 18, cost: 12, stock: 12, unit: 'pieza' },
  { id: crypto.randomUUID(), name: 'Leche entera 1 L', code: '7501020542209', category: 'Cremería', price: 29, cost: 23, stock: 8, unit: 'pieza' },
  { id: crypto.randomUUID(), name: 'Queso Oaxaca', code: '', category: 'Cremería', price: 180, cost: 135, stock: 3.2, unit: 'kg' },
  { id: crypto.randomUUID(), name: 'Jamón de pierna', code: '', category: 'Cremería', price: 165, cost: 120, stock: 2.5, unit: 'kg' },
  { id: crypto.randomUUID(), name: 'Huevo blanco', code: '', category: 'Cremería', price: 48, cost: 38, stock: 10, unit: 'docena' },
  { id: crypto.randomUUID(), name: 'Agua natural 1 L', code: '7501086801046', category: 'Bebidas', price: 16, cost: 9, stock: 20, unit: 'pieza' },
  { id: crypto.randomUUID(), name: 'Galletas Marías', code: '7501000111309', category: 'Abarrotes', price: 17, cost: 11, stock: 14, unit: 'pieza' },
];
const today = new Date().toISOString().slice(0, 10);
const money = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n || 0);
let state = { products: seed, sales: [], cart: [], view: 'venta', query: '', category: 'Todos', folder: null };
let db;
const openDb = () => new Promise((resolve, reject) => {
  const request = indexedDB.open('tiendita-config', 1);
  request.onupgradeneeded = () => request.result.createObjectStore('settings');
  request.onsuccess = () => { db = request.result; resolve(db); };
  request.onerror = () => reject(request.error);
});
const getHandle = () => new Promise(resolve => {
  if (!db) return resolve(null);
  const request = db.transaction('settings').objectStore('settings').get('folder');
  request.onsuccess = () => resolve(request.result || null);
  request.onerror = () => resolve(null);
});
const putHandle = handle => new Promise((resolve, reject) => {
  const request = db.transaction('settings', 'readwrite').objectStore('settings').put(handle, 'folder');
  request.onsuccess = resolve; request.onerror = () => reject(request.error);
});
async function loadFile() {
  if (!state.folder) return false;
  try {
    if (await state.folder.queryPermission({ mode: 'readwrite' }) !== 'granted') return false;
    const file = await state.folder.getFileHandle('tiendita-datos.json');
    const data = JSON.parse(await (await file.getFile()).text());
    state.products = data.products || seed; state.sales = data.sales || [];
    return true;
  } catch { return false; }
}
async function persist() {
  if (!state.folder) return false;
  try {
    const permission = await state.folder.requestPermission({ mode: 'readwrite' });
    if (permission !== 'granted') throw new Error('Permiso de carpeta pendiente');
    const file = await state.folder.getFileHandle('tiendita-datos.json', { create: true });
    const writer = await file.createWritable();
    await writer.write(JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), products: state.products, sales: state.sales }, null, 2));
    await writer.close(); return true;
  } catch (error) { alert(`No se pudo guardar en la carpeta. La venta sigue en pantalla; intenta guardar de nuevo. ${error.message}`); return false; }
}
async function chooseFolder() {
  if (!window.showDirectoryPicker) return alert('Este navegador no permite elegir una carpeta. Abre la app con Chrome actualizado en Android.');
  try {
    state.folder = await window.showDirectoryPicker({ id: 'tiendita', mode: 'readwrite' });
    await putHandle(state.folder);
    const loaded = await loadFile();
    if (!loaded) await persist();
    render();
  } catch (error) { if (error.name !== 'AbortError') alert('No se pudo abrir la carpeta.'); }
}
const cats = () => ['Todos', ...new Set(state.products.map(p => p.category))];
const filtered = () => state.products.filter(p => (state.category === 'Todos' || p.category === state.category) && `${p.name} ${p.code}`.toLowerCase().includes(state.query.toLowerCase()));
const cartTotal = () => state.cart.reduce((sum, row) => sum + row.qty * row.price, 0);
function add(product, qty = 1) {
  const row = state.cart.find(item => item.id === product.id);
  if (row) row.qty = Math.round((row.qty + qty) * 1000) / 1000;
  else state.cart.push({ id: product.id, name: product.name, unit: product.unit, qty, price: product.price, cost: product.cost });
  render();
}
async function checkout() {
  if (!state.cart.length) return;
  if (!state.folder) return alert('Primero selecciona la carpeta donde guardarás los datos de la tienda.');
  const total = cartTotal();
  const paid = Number(prompt(`Total ${money(total)}\n¿Cuánto pagó el cliente?`, String(total)));
  if (!Number.isFinite(paid) || paid < total) return alert('El pago debe cubrir el total de la venta.');
  const sale = { id: crypto.randomUUID(), date: new Date().toISOString(), total, paid, change: paid - total, items: structuredClone(state.cart) };
  for (const item of sale.items) {
    const product = state.products.find(p => p.id === item.id);
    if (product) product.stock = Math.max(0, Math.round((product.stock - item.qty) * 1000) / 1000);
  }
  state.sales.push(sale);
  if (!await persist()) return;
  state.cart = []; render(); alert(`Venta guardada. Cambio: ${money(sale.change)}`);
}
function addProduct() {
  const name = prompt('Nombre del producto'); if (!name) return;
  const price = Number(prompt('Precio de venta ($)')); if (!(price > 0)) return;
  const cost = Number(prompt('Costo de compra ($)')); if (!(cost >= 0)) return;
  const unit = prompt('Unidad: pieza, kg o docena', 'pieza') || 'pieza';
  const code = prompt('Código de barras (opcional)', '') || '';
  state.products.push({ id: crypto.randomUUID(), name, code, category: 'Abarrotes', price, cost, stock: 0, unit });
  persist().then(render);
}
function layout() {
  const viewTitle = { venta: 'Punto de venta', inventario: 'Inventario', resumen: 'Resumen' }[state.view];
  return `<div class="shell">
    <aside class="rail"><div class="brand"><span class="brand-mark">L</span><span>la tiendita<small>punto de venta</small></span></div><nav>${nav('venta','▦','Vender')}${nav('inventario','▤','Inventario')}${nav('resumen','◷','Resumen')}</nav><div class="rail-foot"><span class="status-dot ${state.folder?'online':''}"></span>${state.folder?'Carpeta lista':'Falta elegir carpeta'}</div></aside>
    <main class="main"><header class="topbar"><div><div class="eyebrow">TU NEGOCIO, EN ORDEN</div><h1>${viewTitle}</h1></div><button class="folder-btn" data-action="folder"><span>▱</span> ${state.folder?'Carpeta conectada':'Elegir carpeta'}</button></header>
    ${state.view==='venta'?salesPage():state.view==='inventario'?inventoryPage():summaryPage()}</main>
    <nav class="mobile-nav">${nav('venta','▦','Vender')}${nav('inventario','▤','Stock')}${nav('resumen','◷','Resumen')}</nav>
  </div>`;
}
function nav(id, icon, label) { return `<button class="nav-item ${state.view===id?'active':''}" data-view="${id}"><span>${icon}</span><b>${label}</b></button>`; }
function salesPage() {
  return `<div class="page-grid"><section class="catalog"><div class="search-wrap"><span>⌕</span><input id="search" value="${escapeHtml(state.query)}" placeholder="Busca o escanea un producto" autocomplete="off"><kbd>ESCÁNER</kbd></div><div class="chips">${cats().map(c=>`<button class="chip ${state.category===c?'selected':''}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('')}</div><div class="product-grid">${filtered().map(p=>`<button class="product-card" data-add="${p.id}"><div class="product-icon ${p.category==='Cremería'?'dairy':''}">${p.category==='Cremería'?'🥛':p.category==='Bebidas'?'🥤':p.category==='Botanas'?'🥔':'🛒'}</div><div class="product-name">${escapeHtml(p.name)}</div><div class="product-meta">${p.unit==='kg'?'Se vende por kilo':`${p.stock} disponibles`}</div><strong>${money(p.price)}<small>${p.unit==='kg'?' / kg':''}</small></strong></button>`).join('')}</div></section>
    <aside class="ticket"><div class="ticket-head"><div><span class="eyebrow">VENTA ACTUAL</span><h2>Cuenta</h2></div><button class="text-button" data-action="clear">Vaciar</button></div>${state.cart.length?`<div class="ticket-items">${state.cart.map(row=>`<div class="ticket-row"><div><b>${escapeHtml(row.name)}</b><small>${money(row.price)}${row.unit==='kg'?' / kg':''}</small></div><div class="qty"><button data-qty="${row.id}" data-delta="-1">−</button><input data-inputqty="${row.id}" value="${row.qty}" aria-label="Cantidad"><button data-qty="${row.id}" data-delta="1">+</button></div><strong>${money(row.qty*row.price)}</strong></div>`).join('')}</div>`:`<div class="empty-ticket"><span>🧺</span><b>Tu cuenta está vacía</b><small>Toca un producto o escanéalo para comenzar.</small></div>`}<div class="ticket-bottom"><div class="total-line"><span>Total</span><strong>${money(cartTotal())}</strong></div><button class="charge-btn" data-action="charge" ${state.cart.length?'':'disabled'}>Cobrar <span>→</span></button><div class="secure-note">▣ Cada venta se guarda en tu carpeta</div></div></aside></div>`;
}
function inventoryPage() {
  return `<section class="inventory-panel"><div class="section-head"><div><span class="eyebrow">PRODUCTOS DE TU TIENDA</span><h2>Inventario</h2></div><button class="primary-btn" data-action="new-product">＋ Agregar producto</button></div><div class="table-wrap"><table><thead><tr><th>Producto</th><th>Código</th><th>Precio</th><th>Existencia</th><th>Unidad</th></tr></thead><tbody>${state.products.map(p=>`<tr><td><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.category)}</small></td><td>${escapeHtml(p.code||'—')}</td><td>${money(p.price)}</td><td><span class="stock ${p.stock<5?'low':''}">${p.stock}</span></td><td>${escapeHtml(p.unit)}</td></tr>`).join('')}</tbody></table></div></section>`;
}
function summaryPage() {
  const sales = state.sales.filter(s=>s.date.slice(0,10)===today);
  const revenue = sales.reduce((n,s)=>n+s.total,0);
  const profit = sales.reduce((n,s)=>n+s.items.reduce((m,i)=>m+(i.price-i.cost)*i.qty,0),0);
  return `<section class="summary"><span class="eyebrow">HOY · ${new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})}</span><h2>Así va tu tienda</h2><div class="stat-grid"><article class="stat-card"><span>Ventas del día</span><strong>${money(revenue)}</strong><small>${sales.length} ${sales.length===1?'venta':'ventas'}</small></article><article class="stat-card"><span>Utilidad bruta estimada</span><strong>${money(profit)}</strong><small>Venta menos costo de mercancía</small></article><article class="stat-card"><span>Productos registrados</span><strong>${state.products.length}</strong><small>${state.products.filter(p=>p.stock<5).length} con pocas existencias</small></article></div><div class="inventory-panel recent"><div class="section-head"><div><span class="eyebrow">REGISTRO</span><h2>Ventas recientes</h2></div></div>${sales.length?sales.slice().reverse().slice(0,8).map(s=>`<div class="recent-row"><span>${new Date(s.date).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})} · ${s.items.length} productos</span><b>${money(s.total)}</b></div>`).join(''):'<p class="muted">Todavía no hay ventas hoy.</p>'}</div></section>`;
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function render() { document.querySelector('#app').innerHTML=layout(); bind(); }
function bind() {
  document.querySelectorAll('[data-view]').forEach(el=>el.onclick=()=>{state.view=el.dataset.view;render();});
  document.querySelectorAll('[data-cat]').forEach(el=>el.onclick=()=>{state.category=el.dataset.cat;render();});
  document.querySelectorAll('[data-add]').forEach(el=>el.onclick=()=>{const p=state.products.find(p=>p.id===el.dataset.add);if(p.unit==='kg'){const grams=Number(prompt(`${p.name}\n¿Cuántos gramos?`, '250'));if(grams>0)add(p,grams/1000);}else add(p);});
  document.querySelectorAll('[data-qty]').forEach(el=>el.onclick=()=>{const row=state.cart.find(i=>i.id===el.dataset.qty);row.qty=Math.max(.001,Math.round((row.qty+Number(el.dataset.delta))*1000)/1000);render();});
  document.querySelectorAll('[data-inputqty]').forEach(el=>el.onchange=()=>{const row=state.cart.find(i=>i.id===el.dataset.inputqty);row.qty=Math.max(.001,Number(el.value)||1);render();});
  document.querySelector('#search')?.addEventListener('input',e=>{const cursor=e.target.selectionStart;state.query=e.target.value;const code=state.query.trim();const match=state.products.find(p=>p.code&&p.code===code);render();const input=document.querySelector('#search');input.focus();input.setSelectionRange(cursor,cursor);if(match){add(match);state.query='';render();}});
  document.querySelector('[data-action="folder"]')?.addEventListener('click',chooseFolder);
  document.querySelector('[data-action="charge"]')?.addEventListener('click',checkout);
  document.querySelector('[data-action="clear"]')?.addEventListener('click',()=>{state.cart=[];render();});
  document.querySelector('[data-action="new-product"]')?.addEventListener('click',addProduct);
}
async function start() {
  await openDb(); state.folder=await getHandle();
  if(state.folder && await loadFile()) { /* Existing store restored from its chosen folder. */ }
  else state.folder=null;
  render();
  if('serviceWorker' in navigator && location.protocol!=='file:') navigator.serviceWorker.register('/sw.js').catch(()=>{});
}
start();
