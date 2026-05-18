/* =========================================
MENU LATERAL
========================================= */
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

/* =========================================
CARRINHO
========================================= */
const cartToggle = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotalValue = document.getElementById("cartTotalValue");
const addToCart = document.getElementById("addToCart");

/* =========================================
MODAL PRODUTO
========================================= */
const openProductButtons = document.querySelectorAll(".open-product");
const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");

/* =========================================
QUANTIDADE MODAL
========================================= */
const minusQty = document.getElementById("minusQty");
const plusQty = document.getElementById("plusQty");
const productQty = document.getElementById("productQty");

/* =========================================
PESQUISA
========================================= */
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchToggle = document.getElementById("searchToggle");
const searchArea = document.getElementById("searchArea");

/* =========================================
LOGIN
========================================= */
const loginButton = document.getElementById("loginButton");
const authModal = document.getElementById("authModal");
const closeAuth = document.getElementById("closeAuth");
const authTabs = document.querySelectorAll(".auth-tab");

/* =========================================
AVALIAÇÕES
========================================= */
const stars = document.querySelectorAll(".star");
const submitReview = document.getElementById("submitReview");
const reviewsGrid = document.getElementById("reviewsGrid");

/* =========================================
ESTADO
========================================= */
let currentProduct = null;
let quantity = 1;
let cart = [];
let selectedStars = 0;

/* =========================================
FUNÇÕES AUXILIARES
========================================= */
function closeEverything() {
  sideMenu.classList.remove("show");
  cartSidebar.classList.remove("show");
  productModal.classList.remove("show");
  authModal.classList.remove("show");
  overlay.classList.remove("show");

  document.body.style.overflow = "auto";
}

function openOverlay() {
  overlay.classList.add("show");

  if (window.innerWidth <= 768) {
    document.body.style.overflow = "hidden";
  }
}

function parsePriceBRL(value) {
  return (
    Number(
      String(value)
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", ".")
    ) || 0
  );
}

function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.innerText = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

/* =========================================
MENU
========================================= */
openMenu?.addEventListener("click", () => {
  sideMenu.classList.add("show");
  openOverlay();
});

closeMenu?.addEventListener("click", closeEverything);

overlay?.addEventListener("click", closeEverything);

/* =========================================
FILTROS
========================================= */
const menuFilters = document.querySelectorAll(".menu-filter");
const productCards = document.querySelectorAll(".product-card");

function filterProducts(category) {
  productCards.forEach((card) => {
    const cardCategory = card.dataset.category;

    card.style.display =
      category === "all" || cardCategory === category
        ? "block"
        : "none";
  });

  if (window.innerWidth <= 768) {
    const productsSection = document.getElementById("produtos");

    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  }
}

menuFilters.forEach((button) => {
  button.addEventListener("click", () => {
    filterProducts(button.dataset.category);
    closeEverything();
  });
});

/* =========================================
PESQUISA
========================================= */
function searchProducts() {
  const value = searchInput.value.toLowerCase().trim();

  productCards.forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category.toLowerCase();

    card.style.display =
      name.includes(value) || category.includes(value)
        ? "block"
        : "none";
  });
}

searchButton?.addEventListener("click", searchProducts);

searchInput?.addEventListener("keyup", searchProducts);

searchToggle?.addEventListener("click", () => {
  searchArea?.scrollIntoView({
    behavior: "smooth",
  });

  setTimeout(() => {
    searchInput?.focus();
  }, 400);
});

/* =========================================
MODAL PRODUTO
========================================= */
openProductButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");

    const title = card.querySelector("h3").innerText;

    const category =
      card.querySelector(".product-category").innerText;

    const description = card.querySelector("p").innerText;

    const priceText =
      card.querySelector(".product-price-row strong").innerText;

    const unitPrice = parsePriceBRL(priceText);

    currentProduct = {
      id: card.dataset.name,
      title,
      category,
      description,
      unitPrice,
    };

    quantity = 1;

    productQty.innerText = quantity;

    modalTitle.innerText = title;
    modalCategory.innerText = category;
    modalDescription.innerText = description;
    modalPrice.innerText = formatBRL(unitPrice);

    productModal.classList.add("show");

    openOverlay();
  });
});

closeModal?.addEventListener("click", closeEverything);

/* =========================================
QUANTIDADE MODAL + PREÇO DINÂMICO
========================================= */
function updateModalPrice() {
  if (!currentProduct) return;

  const total = currentProduct.unitPrice * quantity;

  modalPrice.innerText = formatBRL(total);
}

plusQty?.addEventListener("click", () => {
  quantity++;

  productQty.innerText = quantity;

  updateModalPrice();
});

minusQty?.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;

    productQty.innerText = quantity;

    updateModalPrice();
  }
});

/* =========================================
ABRIR CARRINHO
========================================= */
cartToggle?.addEventListener("click", () => {
  cartSidebar.classList.add("show");

  openOverlay();
});

closeCart?.addEventListener("click", closeEverything);

/* =========================================
ADICIONAR AO CARRINHO
========================================= */
addToCart?.addEventListener("click", () => {
  if (!currentProduct) return;

  const existing = cart.find(
    (item) => item.id === currentProduct.id
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      ...currentProduct,
      quantity,
    });
  }

  updateCart();

  showToast("Produto adicionado ao carrinho");

  productModal.classList.remove("show");
  overlay.classList.remove("show");

  if (window.innerWidth <= 768) {
    setTimeout(() => {
      cartSidebar.classList.add("show");
      openOverlay();
    }, 300);
  }
});

/* =========================================
ALTERAR QUANTIDADE NO CARRINHO
========================================= */
window.changeCartQty = function (index, change) {
  const item = cart[index];

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
};

/* =========================================
ATUALIZAR CARRINHO
========================================= */
function updateCart() {
  cartItems.innerHTML = "";

  /* carrinho vazio */
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Seu carrinho está vazio.
      </p>
    `;

    cartCount.innerText = "0";

    cartTotalValue.innerText = "R$ 0,00";

    return;
  }

  let totalUnits = 0;
  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalUnits += item.quantity;

    const itemTotal = item.unitPrice * item.quantity;

    totalPrice += itemTotal;

    const div = document.createElement("div");

    div.classList.add("cart-item");

    div.innerHTML = `
      <h4>${item.title}</h4>

      <div class="cart-qty-controls">
        <button onclick="changeCartQty(${index}, -1)">
          -
        </button>

        <span>${item.quantity}</span>

        <button onclick="changeCartQty(${index}, 1)">
          +
        </button>
      </div>

      <p>
        Subtotal: ${formatBRL(itemTotal)}
      </p>

      <button
        class="remove-btn"
        onclick="removeItem(${index})"
      >
        Remover
      </button>
    `;

    cartItems.appendChild(div);
  });

  /* total interno */
  const totalDiv = document.createElement("div");

  totalDiv.classList.add("cart-item");

  totalDiv.innerHTML = `
    <h4>Total</h4>

    <p>
      Itens: ${totalUnits}
    </p>

    <p>
      Total: ${formatBRL(totalPrice)}
    </p>
  `;

  cartItems.appendChild(totalDiv);

  /* contador topo */
  cartCount.innerText = totalUnits;

  /* TOTAL FINAL DO CARRINHO */
  cartTotalValue.innerText = formatBRL(totalPrice);
}

/* =========================================
REMOVER ITEM
========================================= */
window.removeItem = function (index) {
  cart.splice(index, 1);

  updateCart();

  showToast("Produto removido");
};

/* =========================================
LOGIN
========================================= */
loginButton?.addEventListener("click", () => {
  authModal.classList.add("show");

  openOverlay();
});

closeAuth?.addEventListener("click", closeEverything);

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    authTabs.forEach((t) => {
      t.classList.remove("active");
    });

    tab.classList.add("active");
  });
});

/* =========================================
AVALIAÇÕES
========================================= */
stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedStars = Number(star.dataset.star);

    stars.forEach((s, i) => {
      s.classList.toggle("active", i < selectedStars);
    });
  });
});

submitReview?.addEventListener("click", () => {
  const name =
    document.getElementById("reviewName").value.trim();

  const text =
    document.getElementById("reviewText").value.trim();

  if (!name || !text || selectedStars === 0) {
    alert("Preencha todos os campos.");
    return;
  }

  const review = document.createElement("div");

  review.classList.add("review-card");

  review.innerHTML = `
    <div class="review-card-top">
      <strong>${name}</strong>

      <div class="review-stars">
        ${"★".repeat(selectedStars)}
      </div>
    </div>

    <p>${text}</p>
  `;

  reviewsGrid.prepend(review);

  document.getElementById("reviewName").value = "";
  document.getElementById("reviewText").value = "";

  selectedStars = 0;

  stars.forEach((s) => {
    s.classList.remove("active");
  });

  showToast("Avaliação publicada");
});

/* =========================================
SCROLL HEADER MOBILE
========================================= */
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");

  if (!header) return;

  const currentScroll = window.pageYOffset;

  if (
    currentScroll > lastScroll &&
    currentScroll > 120 &&
    window.innerWidth <= 768
  ) {
    header.style.transform = "translateY(-100%)";
  } else {
    header.style.transform = "translateY(0)";
  }

  lastScroll = currentScroll;
});

/* =========================================
AJUSTE AUTOMÁTICO MOBILE
========================================= */
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    document.body.style.overflow = "auto";
  }
});

/* =========================================
INICIAL
========================================= */
updateCart();