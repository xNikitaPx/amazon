class Cart {
  #localStorageKey;
  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
  }

  cartItem = this.#loadFromStorage() ?? [
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

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItem));
  }

  #loadFromStorage() {
    JSON.parse(localStorage.getItem(this.#localStorageKey));
  }

  addToCart(productId) {
    let matchingItem;

    this.cartItem.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItem.push({
        productId,
        quantity,
        deliveryOptionId: "1",
      });
    }

    this.saveToStorage();
  }

  deleteFromCart(productId) {
    this.cartItem = this.cartItem.filter(
      (cartItem) => productId !== cartItem.productId
    );
    this.saveToStorage();
  }

  calculateCartQuantity() {
    return this.cartItem.reduce((sum, cartItem) => {
      return (sum += cartItem.quantity);
    }, 0);
  }

  updateQuantity(productId, quantityInput) {
    this.cartItem.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        cartItem.quantity = +quantityInput.value;
      }
    });
    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    this.cartItem.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;

    this.saveToStorage();
  }

  resetCart() {
    cart = [];
    this.saveToStorage();
  }
}

const cart = new Cart("cart-oop");
