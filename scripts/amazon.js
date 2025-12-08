"use strict";

import { cart } from "../data/cart.js";

const productGrid = document.querySelector(".js-products-grid");

productGrid.innerHTML = products
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
              src="images/ratings/rating-${product.rating.stars * 10}.png"
            />
            <div class="product-rating-count link-primary">${
              product.rating.count
            }</div>
          </div>

          <div class="product-price">$${(product.priceCents / 100).toFixed(
            2
          )}</div>

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

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart${product.id}">
            <img src="images/icons/checkmark.png" />
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-card" data-product-id="${
            product.id
          }">Add to Cart</button>
        </div>`;
  })
  .join("");

const addBtns = document.querySelectorAll(".js-add-to-card");
const cartQuantity = document.querySelector(".js-cart-quantity");

addBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const productId = btn.dataset.productId;

    let matchingItem;
    cart.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    const quantitySelector = document.querySelector(
      `.js-quantity-selector-${productId}`
    );

    const quantity = +quantitySelector.value;

    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity,
      });
    }

    const addMessage = document.querySelector(`.js-added-to-cart${productId}`);

    addMessage.classList.add("added-to-cart-visible");
    setTimeout(() => {
      addMessage.classList.remove("added-to-cart-visible");
    }, 2000);

    cartQuantity.innerText = cart.reduce((sum, item) => {
      return (sum += item.quantity);
    }, 0);
  });
});
