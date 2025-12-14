class Cart {
  #localStorageKey;
  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.cartItem = this.#loadFromStorage() ?? [
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
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItem));
  }

  #loadFromStorage() {
    return JSON.parse(localStorage.getItem(this.#localStorageKey));
  }

  addToCart(productId, quantity) {
    const matchingItem = this.cartItem.find(
      (cartItem) => productId === cartItem.productId
    );

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

  updateQuantity(productId, quantity) {
    this.cartItem.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        cartItem.quantity = quantity;
      }
    });
    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    const matchingItem = this.cartItem.find(
      (cartItem) => productId === cartItem.productId
    );

    matchingItem.deliveryOptionId = deliveryOptionId;

    this.saveToStorage();
  }

  resetCart() {
    this.cartItem = [];
    this.saveToStorage();
  }
}

const cart = new Cart("cart-oop");

export { cart };
