import { cart } from "../../data/cart-class.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

function renderPaymenSummary() {
  const paymentSummaryEl = document.querySelector(".js-payment-summary");
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.cartItem.forEach((cartItem) => {
    const matchingProduct = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    productPriceCents += matchingProduct.priceCents * cartItem.quantity;
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = (totalBeforeTaxCents * 10) / 100;
  const totalCents = totalBeforeTaxCents + taxCents;

  paymentSummaryEl.innerHTML = `        
          <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (${cart.calculateCartQuantity()}):</div>
            <div class="payment-summary-money">$${formatCurrency(
              productPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(
              shippingPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalBeforeTaxCents
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(
              taxCents
            )}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalCents
            )}</div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>`;

  const orderBtn = document.querySelector(".js-place-order");

  orderBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("https://supersimplebackend.dev/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart.cartItem,
        }),
      });

      const order = await response.json();
      addOrder(order);
    } catch (error) {
      console.log("Unexpected error. Try again later.");
    }

    cart.resetCart();

    window.location.href = "orders.html";
  });
}

export { renderPaymenSummary };
