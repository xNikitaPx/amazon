import {
  cart,
  deleteFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

function renderOrderSummary() {
  const orderSummary = document.querySelector(".js-order-summary");
  const quantityHeader = document.querySelector(".js-return-to-home");

  orderSummary.innerHTML = cart
    .map((cartItem) => {
      const matchingProduct = products.find(
        (product) => product.id === cartItem.productId
      );

      const deliveryOptionId = cartItem.deliveryOptionId;
      let deliveryOption;
      deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
          deliveryOption = option;
        }
      });

      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      return `<div class="cart-item-container js-cart-item-container-${
        matchingProduct.id
      }">
            <div class="delivery-date">Delivery date: ${dateString}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src=${matchingProduct.image}
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(
                  matchingProduct.priceCents
                )}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label js-quantity-label-${
                    matchingProduct.id
                  }">${cartItem.quantity}</span> </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id=${
                    matchingProduct.id
                  }>
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${
                    matchingProduct.id
                  }" type="text">
                  <span class="save-quantity-link link-primary js-save-link"  data-product-id=${
                    matchingProduct.id
                  }>Save</span>
                  <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id=${
                    matchingProduct.id
                  }>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
               ${deliveryOptionsHTML(cartItem, matchingProduct.id)}    
              </div>
            </div>
          </div>`;
    })
    .join("");

  function deliveryOptionsHTML(cartItem, matchingProduct) {
    return deliveryOptions
      .map((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
        const dateString = deliveryDate.format("dddd, MMMM D");

        const priceString =
          deliveryOption.priceCents === 0
            ? "FREE"
            : `$${formatCurrency(deliveryOption.priceCents)} -`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        return `<div class="delivery-option js-delivery-option" data-product-id="${matchingProduct}" data-delivery-option-id="${
          deliveryOption.id
        }">
      <input
        type="radio"
        ${isChecked && "checked"}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct}"
      />
      <div>
        <div class="delivery-option-date">${dateString}</div>
        <div class="delivery-option-price">${priceString} Shipping</div>
      </div>
    </div>`;
      })
      .join("");
  }

  function updateCartQuantity() {
    quantityHeader.innerText = `${calculateCartQuantity()} items`;
  }

  updateCartQuantity();

  const deleteBtns = document.querySelectorAll(".js-delete-quantity-link");
  const updateBtns = document.querySelectorAll(".js-update-link");
  const saveQuantity = document.querySelectorAll(".js-save-link");
  const deliveryVariants = document.querySelectorAll(".js-delivery-option");

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      deleteFromCart(productId);

      const cartEl = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      cartEl.remove();
      updateCartQuantity();
    });
  });

  updateBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add("is-editing-quantity");
    });
  });

  saveQuantity.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove("is-editing-quantity");

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );

      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );

      updateQuantity(productId, quantityInput);
      quantityLabel.innerText = +quantityInput.value;
      updateCartQuantity();
    });
  });

  deliveryVariants.forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
    });
  });
}

renderOrderSummary();
