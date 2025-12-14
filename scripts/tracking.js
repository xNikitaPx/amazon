import { getOrder } from "../data/orders.js";
import { getProduct, loadProducts } from "../data/products.js";
import { cart } from "../data/cart-class.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

async function loadPage() {
  try {
    await loadProducts();
  } catch (error) {
    console.log("Unexpected error. Please try again later.");
  }
  randerTracking();
}

function randerTracking() {
  function formatedDate(date) {
    return dayjs(date).format("dddd, MMMM D");
  }

  const orderTracking = document.querySelector(".js-order-tracking");

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  const order = getOrder(orderId);
  const product = getProduct(productId);

  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  });

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress =
    ((today - orderTime) / (deliveryTime - orderTime)) * 100;

  const deliveredMessage =
    today < deliveryTime ? "Arriving on" : "Delivered on";

  orderTracking.innerHTML = `   
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date"> ${deliveredMessage} ${formatedDate(
    productDetails.estimatedDeliveryTime
  )}</div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">Quantity: ${productDetails.quantity}</div>

        <img
          class="product-image"
          src=${product.image}
        />

        <div class="progress-labels-container">
          <div class="progress-label ${
            percentProgress < 50 ? "current-status" : ""
          }">Preparing</div>
          <div class="progress-label ${
            percentProgress >= 50 && percentProgress < 100
              ? "current-status"
              : ""
          }">Shipped</div>
          <div class="progress-label ${
            percentProgress >= 100 ? "current-status" : ""
          }">Delivered</div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${percentProgress}%;"></div>
        </div>`;

  const cartQuantity = document.querySelector(".js-cart-quantity");

  function updateCartQuantity() {
    cartQuantity.innerText = cart.calculateCartQuantity() || "";
  }
  updateCartQuantity();
}

loadPage();
