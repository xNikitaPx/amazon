let cart = JSON.parse(localStorage.getItem("cart")) ?? [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: "1",
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: "2",
  },
];

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
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
      deliveryOptionId: "1",
    });
  }

  saveToStorage();
}

function deleteFromCart(productId) {
  cart = cart.filter((cartItem) => productId !== cartItem.productId);
  saveToStorage();
}

function calculateCartQuantity() {
  return cart.reduce((sum, cartItem) => {
    return (sum += cartItem.quantity);
  }, 0);
}

function updateQuantity(productId, quantityInput) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = +quantityInput.value;
    }
  });
  saveToStorage();
}

export {
  cart,
  addToCart,
  deleteFromCart,
  calculateCartQuantity,
  updateQuantity,
};
