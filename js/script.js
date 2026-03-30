// Datos de productos - con categorías (minoristas, mayoristas, skincare)
const products = [
    { id: 1, name: 'Anillo Oro 18K', price: 30000, image: 'Img/anillo.jpg', category: 'minoristas', discount: 0},
    { id: 2, name: 'Collar Perlas', price: 25000, image: 'Img/collar.jpg', category: 'minoristas', discount: 0 },
    { id: 3, name: 'Aretes Diamante', price: 30000, image: 'Img/aretes.jpg', category: 'minoristas', discount: 10 },
    { id: 4, name: 'Pulsera Plata', price: 80000, image: 'Img/pulsera.jpg', category: 'minoristas', discount: 0 },
    { id: 5, name: 'Cadena Oro Blanco', price: 20000, image: 'Img/cadena.jpg', category: 'minoristas', discount: 5 },
    { id: 6, name: 'Pendientes Esmeralda', price: 18000, image: 'Img/pendientes.jpg', category: 'minoristas', discount: 0 },
    { id: 7, name: 'Combo Anillo + Aretes', price: 550000, image: 'Img/anillo.jpg', category: 'mayoristas', discount: 15 },
    { id: 8, name: 'Oferta Cadena + Collar', price: 420000, image: 'Img/cadena.jpg', category: 'mayoristas', discount: 20 },
    { id: 9, name: 'Set Premium Oro 18K', price: 120000, image: 'Img/collar.jpg', category: 'mayoristas', discount: 0 },
    { id: 10, name: 'Mascarilla Facial Purificante', price: 50000, image: 'Img/mascarilla.jpg', category: 'skincare', discount: 0 },
    { id: 11, name: 'Sérum Vitamina C', price: 65000, image: 'Img/serum.jpg', category: 'skincare', discount: 5 },
    { id: 12, name: 'Crema Hidratante Premium', price: 85000, image: 'Img/crema.jpg', category: 'skincare', discount: 0 },
    { id: 13, name: 'Tónico Limpiador', price: 45000, image: 'Img/tonico.jpg', category: 'skincare', discount: 5 },
    { id: 14, name: 'Pack Skincare 3 Productos', price: 180000, image: 'Img/pack.jpg', category: 'skincare', discount: 25 },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let activeCategory = 'accesorios';
let currentSortBy = 'default';
let currentMaxPrice = 550000;
const WHATSAPP_PHONE = '573206094126';

// DOM Elements
const cartBtn = document.querySelector('.cart-btn');
const cartSection = document.querySelector('.cart-section');
const orderSection = document.querySelector('.order-section');
const productGrid = document.querySelector('.product-grid');
const cartItemsEl = document.querySelector('#cartItems');
const totalEl = document.querySelector('#total');
const orderForm = document.querySelector('#orderForm');
const searchInput = document.querySelector('#searchInput');
const clearSearchBtn = document.querySelector('#clearSearch');
const noResultsEl = document.querySelector('#noResults');
const sortBySelect = document.querySelector('#sortBy');
const priceFilter = document.querySelector('#priceFilter');
const priceValue = document.querySelector('#priceValue');

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
    
    document.querySelectorAll('.product-card, .cart-section, .order-section, .highlight-card, .payment-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

function filterProducts(category) {
    if (category === 'todos' || !category) {
        return products;
    }
    return products.filter(p => p.category === category);
}

function renderProducts(productsToRender = products) {
    productGrid.innerHTML = productsToRender.map(product => {
        const finalPrice = product.price * (1 - product.discount / 100);
        const discountBadge = product.discount > 0 ? `<span class="discount-badge">-${product.discount}%</span>` : '';
        return `
        <div class="product-card">
            ${discountBadge}
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price-section">
                    ${product.discount > 0 ? `<span class="original-price">$${product.price.toLocaleString()}</span>` : ''}
                    <div class="product-price">$${finalPrice.toLocaleString()}</div>
                </div>
                <button class="add-btn" data-id="${product.id}">Agregar al carrito</button>
            </div>
        </div>
    `}).join('');
}

function updateActiveCategory(btn) {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function setupEventListeners() {
    // Dropdown Accesorios
    const accesoriosBtn = document.getElementById('accesoriosBtn');
    const accesoriosMenu = document.getElementById('accesoriosMenu');
    
    if (accesoriosBtn && accesoriosMenu) {
        accesoriosBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accesoriosMenu.classList.toggle('open');
        });
        
        // Cerrar dropdown al seleccionar una subcategoría
        document.querySelectorAll('.subcategory-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                accesoriosMenu.classList.remove('open');
            });
        });
    }
    
    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
        if (accesoriosMenu && !accesoriosBtn.contains(e.target) && !accesoriosMenu.contains(e.target)) {
            accesoriosMenu.classList.remove('open');
        }
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query) {
                const filtered = products.filter(p => 
                    p.name.toLowerCase().includes(query) || 
                    p.category.toLowerCase().includes(query)
                );
                renderProducts(filtered);
                noResultsEl.classList.toggle('hidden', filtered.length > 0);
            } else {
                renderProducts();
                noResultsEl.classList.add('hidden');
            }
        });
    }

    // Clear search
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                renderProducts();
                noResultsEl.classList.add('hidden');
            }
        });
    }

    // Category filtering
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            if (!category) return;
            
            activeCategory = category;
            const filtered = filterProducts(category);
            applyFiltersAndSort(filtered);
            updateActiveCategory(btn);
            if (searchInput) searchInput.value = '';
            noResultsEl.classList.add('hidden');
        });
    });

    // Price filter
    if (priceFilter && priceValue) {
        priceFilter.addEventListener('input', (e) => {
            currentMaxPrice = parseInt(e.target.value);
            priceValue.textContent = `Hasta $${currentMaxPrice.toLocaleString()}`;
            applyFiltersAndSort();
        });
    }

    // Sort by
    if (sortBySelect) {
        sortBySelect.addEventListener('change', (e) => {
            currentSortBy = e.target.value;
            applyFiltersAndSort();
        });
    }

    // Universal click handler
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-btn')) addToCart(parseInt(e.target.dataset.id));
        if (e.target.classList.contains('remove-item')) removeFromCart(parseInt(e.target.dataset.id));
    });

    document.getElementById('clearCart').addEventListener('click', clearCart);
    orderForm.addEventListener('submit', sendWhatsApp);
    
    // Setup FAQ
    setupFAQ();
    setupNewsletterItem();
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(i => i.id === id);
    
    if (item) item.quantity++;
    else cart.push({...product, quantity: 1});
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
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
        orderSection.classList.add('hidden');
        cartBtn.textContent = '🛒 0';
        cartItemsEl.innerHTML = '<p style="text-align: center; opacity: 0.7; padding: 1rem;">Tu carrito está vacío</p>';
        const total = 0;
        totalEl.textContent = `Total: $${total.toLocaleString()}`;
        return;
    }
    
    orderSection.classList.remove('hidden');
    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong> 
                <div style="margin-top: 0.5rem;">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease" style="padding: 4px 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; cursor: pointer; color: white; margin-right: 5px;">-</button>
                    <span style="font-weight: 600;">${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase" style="padding: 4px 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; cursor: pointer; color: white; margin-left: 5px;">+</button>
                </div>
            </div>
            <div>
                <span style="display: block; margin-bottom: 0.5rem;">$${(item.price * item.quantity).toLocaleString()}</span>
                <button class="remove-item" data-id="${item.id}" title="Eliminar">❌</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalEl.textContent = `Total: $${total.toLocaleString()}`;
    cartBtn.textContent = `🛒 ${cart.reduce((sum, item) => sum + item.quantity, 0)}`;

    // Setup quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(btn.dataset.id);
            const action = btn.dataset.action;
            const item = cart.find(i => i.id === id);
            
            if (action === 'increase') {
                item.quantity++;
            } else if (action === 'decrease' && item.quantity > 1) {
                item.quantity--;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
    });
}

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
    orderForm.reset();
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
    
    const message = `💎 *Pedido Productos Rose* 💎

👤*${data.name}*
📞 ${data.phone}
📍 ${data.address}

📦 *Productos:*
${items}

💰 *Total: $${total.toLocaleString()}*`;

    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`, '_blank');
    clearCart();
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
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// FAQ Toggle
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        }
    });
}

// Newsletter
function setupNewsletterItem() {
    const newsletterBtn = document.querySelector('#newsletterBtn');
    const newsletterEmail = document.querySelector('#newsletterEmail');
    
    if (newsletterBtn && newsletterEmail) {
        newsletterBtn.addEventListener('click', () => {
            const email = newsletterEmail.value.trim();
            if (email && email.includes('@') && email.includes('.')) {
                showToast('¡Gracias por suscribirte! Recibirás ofertas exclusivas 📧');
                newsletterEmail.value = '';
            } else {
                showToast('Por favor ingresa un email válido', 'error');
            }
        });
    }
}

// Aplicar filtros y ordenamiento
function applyFiltersAndSort(baseProducts = products) {
    let filtered = baseProducts
        .filter(p => p.price * (1 - p.discount / 100) <= currentMaxPrice);
    
    // Ordenamiento
    switch (currentSortBy) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'discount':
            filtered.sort((a, b) => b.discount - a.discount);
            break;
        default:
            // Default: products in order
    }
    
    if (filtered.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; opacity: 0.7;">No hay productos que coincidan con los filtros</p>';
        noResultsEl.classList.remove('hidden');
    } else {
        renderProducts(filtered);
        noResultsEl.classList.add('hidden');
    }
}
