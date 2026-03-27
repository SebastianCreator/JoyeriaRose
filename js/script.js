// Datos de productos - más modernos
const products = [
    { id: 1, name: 'Anillo Oro 18K', price: 30000, image: 'Img/anillo.jpg'},
    { id: 2, name: 'Collar Perlas', price: 25000, image: 'Img/collar.jpg' },
    { id: 3, name: 'Aretes Diamante', price: 30000, image: 'Img/aretes.jpg' },
    { id: 4, name: 'Pulsera Plata', price: 80000, image: 'Img/pulsera.jpg' },
    { id: 5, name: 'Cadena Oro Blanco', price: 20000, image: 'Img/cadena.jpg' },
    { id: 6, name: 'Pendientes Esmeralda', price: 18000, image: 'Img/pendientes.jpg' }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const WHATSAPP_PHONE = '573206094126'; // Cambia aquí

// DOM Elements
const cartBtn = document.querySelector('.cart-btn');
const cartSection = document.querySelector('.cart-section');
const orderSection = document.querySelector('.order-section');
const productGrid = document.querySelector('.product-grid');
const cartItemsEl = document.querySelector('#cartItems');
const totalEl = document.querySelector('#total');
const orderForm = document.querySelector('#orderForm');

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    setupEventListeners();
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.product-card, .cart-section, .order-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price}</div>
                <button class="add-btn" data-id="${product.id}">Agregar</button>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    // Universal click handler
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-btn')) addToCart(parseInt(e.target.dataset.id));
        if (e.target.classList.contains('remove-item')) removeFromCart(parseInt(e.target.dataset.id));
        if (e.target.classList.contains('cart-btn') || e.target.closest('.cart-section')) toggleCart();
    });

    document.getElementById('clearCart').addEventListener('click', clearCart);
    orderForm.addEventListener('submit', sendWhatsApp);
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(i => i.id === id);
    
    if (item) item.quantity++;
    else cart.push({...product, quantity: 1});
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    // Modern toast
    showToast(`${product.name} agregado!`);
}

function removeFromCart(id) {
    const index = cart.findIndex(i => i.id === id);
    if (index !== -1) {
        if (cart[index].quantity > 1) cart[index].quantity--;
        else cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

function renderCart() {
    if (cart.length === 0) {
        cartSection.classList.add('hidden');
        orderSection.classList.add('hidden');
        cartBtn.textContent = '🛒 0';
        return;
    }
    
    cartSection.classList.remove('hidden');
    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong> <span>x${item.quantity}</span>
            </div>
            <div>
                <span>$${(item.price * item.quantity).toFixed(0)}</span>
                <button class="remove-item" data-id="${item.id}" title="Eliminar">❌</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalEl.textContent = `$${total.toFixed(0)}`;
    cartBtn.textContent = `🛒 ${cart.reduce((sum, item) => sum + item.quantity, 0)}`;
    
    orderSection.classList.toggle('hidden', total === 0);
}

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
    orderForm.reset();
}

function toggleCart() {
    cartSection.classList.toggle('hidden');
}

function sendWhatsApp(e) {
    e.preventDefault();
    
    const formData = new FormData(orderForm);
    const data = Object.fromEntries(formData);
    
    if (!data.name || !data.phone || !data.address) {
        showToast('Completa todos los campos', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const items = cart.map(item => `${item.name} x${item.quantity} $${item.price}`).join('\n');
    
    const message = `💎 *Pedido Joyería Rose* 💎

👤*${data.name}*
📞 ${data.phone}
📍 ${data.address}

📦 *Productos:*
${items}

💰 *Total: $${total.toFixed(0)}*`;

    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`, '_blank');
    showToast('¡Gracias por tu Compra!');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 16px 24px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'}; color: white;
        border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        transform: translateX(400px); transition: all 0.4s ease; z-index: 1000;
        font-weight: 500;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});
