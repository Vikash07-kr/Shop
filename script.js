// Dummy product data used for product rendering and search/filter logic.
const products = [
  {
    id: 1,
    title: "Noise-Canceling Headphones",
    price: 249,
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    description:
      "Immersive over-ear headphones with adaptive noise cancellation and 30-hour battery life.",
  },
  {
    id: 2,
    title: "Smart Desk Lamp",
    price: 89,
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
    description:
      "Minimal LED desk lamp with touch controls, dimming modes, and warm/cool temperature settings.",
  },
  {
    id: 3,
    title: "Everyday Leather Watch",
    price: 179,
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5c1cf61a7cf?auto=format&fit=crop&w=900&q=80",
    description:
      "Classic timepiece crafted with premium leather strap and lightweight brushed steel case.",
  },
  {
    id: 4,
    title: "Wireless Charging Pad",
    price: 49,
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80",
    description:
      "Fast-charge compatible charging pad with anti-slip matte finish and compact silhouette.",
  },
  {
    id: 5,
    title: "Performance Knit Sneakers",
    price: 159,
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description:
      "Breathable knit sneakers engineered for all-day comfort and lightweight cushioning.",
  },
  {
    id: 6,
    title: "Lightweight Crossbody Bag",
    price: 129,
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80",
    description:
      "Compact daily carry bag featuring water-resistant fabric and adjustable strap.",
  },
  {
    id: 7,
    title: "Portable Bluetooth Speaker",
    price: 99,
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80",
    description:
      "Room-filling audio with deep bass, USB-C charging, and splash-resistant finish.",
  },
  {
    id: 8,
    title: "Polarized Sunglasses",
    price: 119,
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    description:
      "Unisex polarized sunglasses with UV400 protection and clean geometric frame.",
  },
];

// DOM references.
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("productSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const noResults = document.getElementById("noResults");

const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const closeModalBtn = document.getElementById("closeModal");
const modalAddToCartBtn = document.getElementById("modalAddToCart");

const cartSidebar = document.getElementById("cartSidebar");
const cartToggleBtn = document.getElementById("cartToggleBtn");
const closeCartBtn = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

const checkoutSection = document.getElementById("checkoutSection");
const checkoutForm = document.getElementById("checkoutForm");
const thankYouMessage = document.getElementById("thankYouMessage");
const mainContent = document.getElementById("mainContent");
const footer = document.getElementById("footer");

const mobileMenu = document.getElementById("mobileMenu");
const menuBackdrop = document.getElementById("menuBackdrop");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const closeMobileMenuBtn = document.getElementById("closeMobileMenu");

let selectedCategory = "All";
let selectedProduct = null;
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Utility formatter.
const formatPrice = (value) => `$${value.toFixed(2)}`;

/**
 * Render products based on active category and search query.
 */
function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  productsGrid.innerHTML = filtered
    .map(
      (product) => `
      <article class="product-card" data-id="${product.id}" tabindex="0">
        <img src="${product.image}" alt="${product.title}" loading="lazy" />
        <div class="product-meta">
          <h3>${product.title}</h3>
          <p>${product.category} • ${formatPrice(product.price)}</p>
        </div>
      </article>
    `,
    )
    .join("");

  noResults.hidden = filtered.length !== 0;

  // Attach listeners to each card after rendering.
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = Number(card.dataset.id);
      const product = products.find((item) => item.id === id);
      openProductModal(product);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        card.click();
      }
    });
  });
}

/**
 * Open and populate product detail modal.
 */
function openProductModal(product) {
  if (!product) return;

  selectedProduct = product;
  modalImage.src = product.image;
  modalImage.alt = product.title;
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalPrice.textContent = formatPrice(product.price);

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

/**
 * Cart methods.
 */
function persistCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  persistCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  persistCart();
  renderCart();
}

function updateCartQuantity(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  persistCart();
  renderCart();
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id);
    return product ? total + product.price * item.quantity : total;
  }, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Render cart UI in slide-out sidebar.
 */
function renderCart() {
  if (!cart.length) {
    cartItemsEl.innerHTML = '<p style="color:#666; padding: 1rem 0;">Your cart is empty.</p>';
  } else {
    cartItemsEl.innerHTML = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return "";

        return `
          <div class="cart-row">
            <img src="${product.image}" alt="${product.title}" />
            <div>
              <strong>${product.title}</strong>
              <p>${formatPrice(product.price)}</p>
              <div class="qty-controls">
                <button data-action="decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
                <span>${item.quantity}</span>
                <button data-action="increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
                <button class="remove-btn" data-action="remove" data-id="${product.id}">Remove</button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  cartTotalEl.textContent = formatPrice(getCartTotal());
  cartCountEl.textContent = getCartCount();
}

/**
 * Open/close helpers for sidebars.
 */
function openCart() {
  cartSidebar.classList.add("open");
  cartSidebar.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartSidebar.setAttribute("aria-hidden", "true");
}

function openMobileMenu() {
  mobileMenu.classList.add("open");
  hamburgerBtn.setAttribute("aria-expanded", "true");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuBackdrop.hidden = false;
}

function closeMobileMenu() {
  mobileMenu.classList.remove("open");
  hamburgerBtn.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuBackdrop.hidden = true;
}

/**
 * Show checkout page and hide normal storefront sections.
 */
function showCheckout() {
  closeCart();
  mainContent.hidden = true;
  footer.hidden = true;
  checkoutSection.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetToStorefront() {
  mainContent.hidden = false;
  footer.hidden = false;
  checkoutSection.hidden = true;
}

// Event bindings.
searchInput.addEventListener("input", renderProducts);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderProducts();
  });
});

closeModalBtn.addEventListener("click", closeProductModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeProductModal();
});

modalAddToCartBtn.addEventListener("click", () => {
  if (!selectedProduct) return;
  addToCart(selectedProduct.id);
  openCart();
  closeProductModal();
});

cartToggleBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);

cartItemsEl.addEventListener("click", (event) => {
  const actionBtn = event.target.closest("button[data-action]");
  if (!actionBtn) return;

  const productId = Number(actionBtn.dataset.id);
  const action = actionBtn.dataset.action;

  if (action === "increase") updateCartQuantity(productId, 1);
  if (action === "decrease") updateCartQuantity(productId, -1);
  if (action === "remove") removeFromCart(productId);
});

checkoutBtn.addEventListener("click", () => {
  if (!cart.length) {
    alert("Your cart is empty. Add some products first.");
    return;
  }

  showCheckout();
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  cart = [];
  localStorage.removeItem("cart");
  renderCart();

  thankYouMessage.hidden = false;
  checkoutForm.reset();

  setTimeout(() => {
    thankYouMessage.hidden = true;
    resetToStorefront();
  }, 2500);
});

hamburgerBtn.addEventListener("click", openMobileMenu);
closeMobileMenuBtn.addEventListener("click", closeMobileMenu);
menuBackdrop.addEventListener("click", () => {
  closeMobileMenu();
  closeCart();
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
    closeProductModal();
    closeCart();
  }
});

// Initial paint.
renderProducts();
renderCart();
