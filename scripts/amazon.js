import { products, loadProducts } from "../data/products.js";
import { addToCart, calculateCartQuantity } from "../data/cart.js";

function renderProductsGrid() {
  const productGrid = document.querySelector(".js-products-grid");
  const searchBtn = document.querySelector(".js-search-button");
  const searchBar = document.querySelector(".js-search-bar");

  const url = new URL(window.location.href);
  const search = url.searchParams.get("search");

  let filteredProducts = products;

  if (search) {
    filteredProducts = products.filter((product) => {
      let matchingKeywords = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeywords = true;
        }
      });
      return (
        matchingKeywords ||
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  productGrid.innerHTML = filteredProducts
    .map((product) => {
      return `<div class="product-container">
          <div class="product-image-container">
            <img
              class="product-image"
              src=${product.image}
            />
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img
              class="product-rating-stars"
              src=${product.getStarsUrl()}
            />
            <div class="product-rating-count link-primary">${
              product.rating.count
            }</div>
          </div>

          <div class="product-price">${product.getPrice()}</div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart${product.id}">
            <img src="images/icons/checkmark.png" />
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${
            product.id
          }">Add to Cart</button>
        </div>`;
    })
    .join("");

  const addBtns = document.querySelectorAll(".js-add-to-cart");
  const cartQuantity = document.querySelector(".js-cart-quantity");

  function updateCartQuantity() {
    cartQuantity.innerText = calculateCartQuantity() || "";
  }

  updateCartQuantity();

  function addMessage(productId) {
    const addMessage = document.querySelector(`.js-added-to-cart${productId}`);

    addMessage.classList.add("added-to-cart-visible");
    setTimeout(() => {
      addMessage.classList.remove("added-to-cart-visible");
    }, 2000);
  }

  addBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      const quantitySelector = document.querySelector(
        `.js-quantity-selector-${productId}`
      );
      const quantity = +quantitySelector.value;

      addToCart(productId, quantity);
      addMessage(productId);
      updateCartQuantity();
    });
  });

  searchBtn.addEventListener("click", () => {
    const search = searchBar.value;
    window.location.href = `amazon.html?search=${search}`;
  });

  searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const search = searchBar.value;
      window.location.href = `amazon.html?search=${search}`;
    }
  });
}

async function loadPage() {
  try {
    await loadProducts();
  } catch (error) {
    console.log("Unexpected error. Please try again later.");
  }
  renderProductsGrid();
}

loadPage();
