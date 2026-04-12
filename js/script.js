// Datos de productos - con categorías (minoristas, mayoristas, skincare)
const products = [
  {
    id: 1,
    name: "Anillo Oro 18K",
    price: 30000,
    image: "Img/anillo.jpg",
    category: "minoristas",
    discount: 0,
  },
  {
    id: 2,
    name: "Collar Perlas",
    price: 25000,
    image: "Img/collar.jpg",
    category: "minoristas",
    discount: 0,
  },
  {
    id: 3,
    name: "Aretes Diamante",
    price: 30000,
    image: "Img/aretes.jpg",
    category: "minoristas",
    discount: 10,
  },
  {
    id: 4,
    name: "Pulsera Plata",
    price: 80000,
    image: "Img/pulsera.jpg",
    category: "minoristas",
    discount: 0,
  },
  {
    id: 5,
    name: "Cadena Oro Blanco",
    price: 20000,
    image: "Img/cadena.jpg",
    category: "minoristas",
    discount: 5,
  },
  {
    id: 6,
    name: "Pendientes Esmeralda",
    price: 18000,
    image: "Img/pendientes.jpg",
    category: "minoristas",
    discount: 0,
  },
  {
    id: 7,
    name: "Combo Anillo + Aretes",
    price: 550000,
    image: "Img/anillo.jpg",
    category: "mayoristas",
    discount: 15,
  },
  {
    id: 8,
    name: "Oferta Cadena + Collar",
    price: 420000,
    image: "Img/cadena.jpg",
    category: "mayoristas",
    discount: 20,
  },
  {
    id: 9,
    name: "Set Premium Oro 18K",
    price: 120000,
    image: "Img/collar.jpg",
    category: "mayoristas",
    discount: 0,
  },
  {
    id: 10,
    name: "Mascarilla Facial Purificante",
    price: 50000,
    image: "Img/mascarilla.jpg",
    category: "skincare",
    discount: 0,
  },
  {
    id: 11,
    name: "Sérum Vitamina C",
    price: 65000,
    image: "Img/serum.jpg",
    category: "skincare",
    discount: 5,
  },
  {
    id: 12,
    name: "Crema Hidratante Premium",
    price: 85000,
    image: "Img/crema.jpg",
    category: "skincare",
    discount: 0,
  },
  {
    id: 13,
    name: "Tónico Limpiador",
    price: 45000,
    image: "Img/tonico.jpg",
    category: "skincare",
    discount: 5,
  },
  {
    id: 14,
    name: "Pack Skincare 3 Productos",
    price: 180000,
    image: "Img/pack.jpg",
    category: "skincare",
    discount: 25,
  },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let activeCategory = "todos";
let currentSortBy = "default";

const WHATSAPP_PHONE = "573206094126";

// DOM Elements
const cartBtn = document.querySelector(".cart-btn");

// Slider & Testimonials Elements
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dots .dot');
const testimonials = document.querySelectorAll('.testimonial');
const testimonialDots = document.querySelectorAll('.testimonials-dots .dot');

let currentSlide = 0;
let currentTestimonial = 0;

const cartSection = document.querySelector(".cart-section");
const cartOverlay = document.querySelector(".cart-overlay");
const cartCloseBtn = document.querySelector("#cartCloseBtn");
const productGrid = document.querySelector(".product-grid");
const cartItemsEl = document.querySelector("#cartItems");
const totalEl = document.querySelector("#total");
const orderForm = document.querySelector("#orderForm");
const searchInput = document.querySelector("#searchInput");
const clearSearchBtn = document.querySelector("#clearSearch");
const noResultsEl = document.querySelector("#noResults");
const productsSection = document.querySelector("#products");
const orderFormContainer = document.getElementById("orderFormContainer");

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  setupEventListeners();
  
  // Initialize Sliders
  initHeroSlider();
  initTestimonialsSlider();
  
  console.log(
    "DOMContentLoaded complete. Initial cart:",
    cart.length,
    "remove buttons:",
    document.querySelectorAll(".remove-item").length,
  );

  // Intersection Observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  document
    .querySelectorAll(
      ".product-card, .cart-section, .order-section, .highlight-card, .payment-card, .hero-slider, .testimonials-section",
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.6s ease";
      observer.observe(el);
    });
});

// Hero Slider Functions
function initHeroSlider() {
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  // Auto play
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 4000);

  // Touch swipe
  let startX = 0;
  document.querySelector('.slider-container').addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  document.querySelector('.slider-container').addEventListener('touchend', e => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextSlide();
    if (endX - startX > 50) prevSlide();
  });

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  }
}

// Testimonials Slider
function initTestimonialsSlider() {
  function showTestimonial(index) {
    testimonials.forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
    testimonialDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentTestimonial = index;
  }

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => showTestimonial(index));
  });

  // Auto play
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }, 5000);
}

function filterProducts(category) {
  if (category === "todos" || !category) {
    return products;
  }
  return products.filter((p) => p.category === category);
}

function toggleCart() {
  cartSection.classList.toggle("active");
  cartOverlay.classList.toggle("active");
  document.body.classList.toggle("cart-open");
}

function openCart() {
  cartSection.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartSection.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.classList.remove("cart-open");
}

function renderProducts(productsToRender = products) {
  productGrid.innerHTML = productsToRender
    .map((product) => {
      const finalPrice = product.price * (1 - product.discount / 100);
      const discountBadge =
        product.discount > 0
          ? `<span class="discount-badge">-${product.discount}%</span>`
          : "";
      return `
        <div class="product-card">
            ${discountBadge}
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price-section">
                    ${product.discount > 0 ? `<span class="original-price">$${product.price.toLocaleString()}</span>` : ""}
                    <div class="product-price">$${finalPrice.toLocaleString()}</div>
                </div>
                <button class="add-btn" data-id="${product.id}">Agregar al carrito</button>
            </div>
        </div>
    `;
    })
    .join("");
}

function updateActiveCategory(btn) {
  document
    .querySelectorAll(".category-btn, .category-chip")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

function setupEventListeners() {
  // Explicit WhatsApp form submit handler (FIX)
  if (orderForm) {
    orderForm.addEventListener('submit', sendWhatsApp);
    console.log('✅ WhatsApp form submit listener attached');
  }
  // ... existing code until end of function

  // Explicit WhatsApp form submit handler
  if (orderForm) {
    orderForm.addEventListener('submit', sendWhatsApp);
    console.log('WhatsApp form submit listener attached');
  }

  // Carrito toggle
  cartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleCart();
  });

  cartCloseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    closeCart();
  });

  cartOverlay.addEventListener("click", closeCart);

  // Prevenir que los clicks dentro del carrito lo cierren (excepto en botones del carrito)
  cartSection.addEventListener("click", (e) => {
    const cartButtons =
      ".cart-close-btn, .remove-item, .quantity-btn, #clearCart";
    if (!e.target.closest(cartButtons)) {
      e.stopPropagation();
    }
  });

  // Integrated Categories Toggle
  const toggleBtn = document.getElementById("toggleBtn");
  const categoriesBar = document.getElementById("categoriesBar");

  if (toggleBtn && categoriesBar) {
    let isExpanded = false;

    const toggleCategories = () => {
      isExpanded = !isExpanded;
      toggleBtn.textContent = isExpanded
        ? "📂 Ocultar Categorías ▲"
        : "📂 Todas Categorías ▼";
      toggleBtn.classList.toggle("active");

      // Show/hide category chips (except toggle and todos)
      const categoryChips = categoriesBar.querySelectorAll(
        ".category-btn:not(#toggleBtn):not(#todosBtn)",
      );
      categoryChips.forEach((chip, index) => {
        if (isExpanded) {
          chip.style.display = "flex";
          chip.style.opacity = "0";
          chip.style.transform = "translateY(10px)";
          setTimeout(() => {
            chip.style.transition = "all 0.3s ease";
            chip.style.opacity = "1";
            chip.style.transform = "translateY(0)";
          }, index * 50);
        } else {
          chip.style.opacity = "0";
          chip.style.transform = "translateY(10px)";
          setTimeout(() => (chip.style.display = "none"), 300);
        }
      });
    };

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCategories();
    });

    // Auto-collapse on small screens or outside click
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 480 && isExpanded) {
        toggleCategories();
      }
    });

    document.addEventListener("click", (e) => {
      if (!categoriesBar.contains(e.target)) {
        if (isExpanded && window.innerWidth <= 768) {
          toggleCategories();
        }
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && accesoriosMenu.classList.contains("open")) {
      accesoriosMenu.classList.remove("open");
      accesoriosBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query) {
        const filtered = products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query),
        );
        renderProducts(filtered);
        noResultsEl.classList.toggle("hidden", filtered.length > 0);
      } else {
        renderProducts();
        noResultsEl.classList.add("hidden");
      }
    });
  }

  // Clear search
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
        renderProducts();
        noResultsEl.classList.add("hidden");
      }
    });
  }

  // Category filtering - Unified for .category-btn AND .category-chip
  document.addEventListener("click", (e) => {
    const isCategoryBtn =
      e.target.matches(".category-btn") || e.target.closest(".category-btn");
    const isCategoryChip =
      e.target.matches(".category-chip") || e.target.closest(".category-chip");

    if (isCategoryBtn || isCategoryChip) {
      const btn = isCategoryBtn
        ? e.target.matches(".category-btn")
          ? e.target
          : e.target.closest(".category-btn")
        : e.target.matches(".category-chip")
          ? e.target
          : e.target.closest(".category-chip");
      const category = btn.dataset.category;
      if (!category) return;

      activeCategory = category;
      const filtered = filterProducts(category);
      applyFiltersAndSort(filtered);

      // Update active states
      document
        .querySelectorAll(".category-btn, .category-chip")
        .forEach((el) => el.classList.remove("active"));
      btn.classList.add("active");

      // Auto-scroll to active chip/grid position
      btn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });

      if (searchInput) searchInput.value = "";
      noResultsEl.classList.add("hidden");

      // Smooth scroll to products
      setTimeout(() => {
        productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  });

  // Universal click handler
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
      e.preventDefault();
      e.stopPropagation();
      addToCart(parseInt(e.target.dataset.id));
    }
    if (e.target.classList.contains("remove-item")) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Remove clicked for ID:", e.target.dataset.id);
      removeFromCart(parseInt(e.target.dataset.id));
    }
  });

  // Re-attach clearCart after potential re-renders
  function attachClearCart() {
    const clearBtn = document.getElementById("clearCart");
    if (clearBtn) {
      clearBtn.addEventListener("click", clearCart);
    }
  }
  attachClearCart();
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const wasEmpty = cart.length === 0;
  const item = cart.find((i) => i.id === id);

  if (item) item.quantity++;
  else cart.push({ ...product, quantity: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  console.log(
    "Cart rendered after add (wasEmpty:",
    wasEmpty,
    "), buttons:",
    document.querySelectorAll(".remove-item").length,
  );

  if (wasEmpty) {
    openCart();
    showToast(`${product.name} agregado al carrito! 🎉`);
    // Cerrar automáticamente después de 5 segundos solo para el primero
    setTimeout(closeCart, 5000);
  } else {
    showToast(
      `${product.name} agregado (${cart.reduce((sum, i) => sum + i.quantity, 0)} items totales)`,
    );
  }
}

function removeFromCart(id) {
  console.log("removeFromCart called with ID:", id, "Current cart:", cart);
  const index = cart.findIndex((i) => i.id === id);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      console.log("Quantity decreased to:", cart[index].quantity);
    } else {
      cart.splice(index, 1);
      console.log("Item removed from cart");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  } else {
    console.log("Item not found in cart");
  }
}

function renderCart() {
  if (cart.length === 0) {
    cartBtn.textContent = "🛒 0";
    cartItemsEl.innerHTML =
      '<p style="text-align: center; opacity: 0.7; padding: 1rem;">Tu carrito está vacío</p>';
    totalEl.textContent = `Total: $0`;
    orderFormContainer.classList.add("hidden");
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
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
    `,
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalEl.textContent = `Total: $${total.toLocaleString()}`;
  cartBtn.textContent = `🛒 ${cart.reduce((sum, item) => sum + item.quantity, 0)}`;
  orderFormContainer.classList.remove("hidden");

  console.log(
    "renderCart complete, cartItems children:",
    cartItemsEl.children.length,
    "remove buttons:",
    document.querySelectorAll(".remove-item").length,
  );

  // Setup quantity buttons
  document.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      const item = cart.find((i) => i.id === id);

      if (action === "increase") {
        item.quantity++;
      } else if (action === "decrease" && item.quantity > 1) {
        item.quantity--;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}

function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  renderCart();
  orderForm.reset();
}

function sendWhatsApp(e) {
  e.preventDefault();

  const formData = new FormData(orderForm);
  const data = Object.fromEntries(formData);

  if (!data.name || !data.phone || !data.address) {
    showToast("Completa todos los campos", "error");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const items = cart
    .map((item) => `${item.name} x${item.quantity} $${item.price}`)
    .join("\n");

  const message = `💎 *Pedido Productos Rose* 💎

👤*${data.name}*
📞 ${data.phone}
📍 ${data.address}

📦 *Productos:*
${items}

💰 *Total: $${total.toLocaleString()}*`;

  window.open(
    `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`,
    "_blank",
  );
  clearCart();
  showToast("¡Gracias por tu Compra!");
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 16px 24px;
        background: ${type === "error" ? "#ef4444" : "#10b981"}; color: white;
        border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        transform: translateX(400px); transition: all 0.4s ease; z-index: 1000;
        font-weight: 500;
    `;
  document.body.appendChild(toast);

  setTimeout(() => (toast.style.transform = "translateX(0)"), 100);
  setTimeout(() => {
    toast.style.transform = "translateX(400px)";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// Aplicar filtros y ordenamiento
function applyFiltersAndSort(filteredProducts) {
  let filtered = [...filteredProducts];

  // Ordenamiento (future expansion)
  switch (currentSortBy) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "discount":
      filtered.sort((a, b) => b.discount - a.discount);
      break;
  }

  renderProducts(filtered);
}
