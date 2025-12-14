import { orders } from "../data/orders.js";
import { formatCurrency } from "./utils/money.js";
import { getProduct, loadProducts } from "../data/products.js";
import { cart } from "../data/cart-class.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

async function loadPage() {
  try {
    await loadProducts();
  } catch (error) {
    console.log("Unexpected error. Please try again later.");
  }
  renderOrders();
}

loadPage();

function renderOrders() {
  function formatedDate(date) {
    return dayjs(date).format("MMMM D");
  }

  const ordersGrid = document.querySelector(".js-orders-grid");

  ordersGrid.innerHTML = orders
    .map((order) => {
      return `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${formatedDate(order.orderTime)}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
           ${productsListHTML(order)} 
          </div>
        </div>`;
    })
    .join("");

  function productsListHTML(order) {
    return order.products
      .map((productDetails) => {
        const product = getProduct(productDetails.productId);
        return `<div class="product-image-container">
              <img src=${product.image} />
            </div>

            <div class="product-details">
              <div class="product-name">
                 ${product.name}
              </div>
              <div class="product-delivery-date">Arriving on: ${formatedDate(
                productDetails.estimatedDeliveryTime
              )}</div>
              <div class="product-quantity js-product-quantity-${
                product.id
              }">Quantity: 
              <span>${productDetails.quantity}</span>
              </div>
              <button class="buy-again-button button-primary js-buy-again" data-product-id="${
                product.id
              }">
                <img class="buy-again-icon" src="images/icons/buy-again.png" />
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=${order.id}&productId=${
          product.id
        }">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>`;
      })
      .join("");
  }

  const buyAgainBtns = document.querySelectorAll(".js-buy-again");
  const cartQuantity = document.querySelector(".js-cart-quantity");

  function updateCartQuantity() {
    cartQuantity.innerText = cart.calculateCartQuantity() || "";
  }

  updateCartQuantity();

  buyAgainBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      const quantitySelector = document.querySelector(
        `.js-product-quantity-${productId} span`
      );
      const quantity = +quantitySelector.innerText;
      cart.addToCart(productId, quantity);
      updateCartQuantity();
      btn.innerHTML = "Added";
      setTimeout(() => {
        btn.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png" />
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);
    });
  });
}
