import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymenSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";

async function loadPage() {
  try {
    await loadProducts();
  } catch (error) {
    console.log("Unexpected error. Please try again later.");
  }
  renderOrderSummary();
  renderPaymenSummary();
}

loadPage();
