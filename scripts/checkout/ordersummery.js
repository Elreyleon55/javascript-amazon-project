import {
  cart,
  removeFromCart,
  saveToStorage,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurreny } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryoptions.js";
import { renderPaymentSummery } from "./paymentsummery.js";

console.log(dayjs());

export function renderOrderSummery() {
  let innerHtml = "";
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    console.log(matchingProduct);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const datestring = deliveryDate.format("dddd MMMM D");

    innerHtml += `
            <div class="cart-item-container js-cart-item-container-${
              matchingProduct.id
            }">
              <div class="delivery-date">Delivery date: ${datestring}</div>
  
              <div class="cart-item-details-grid">
                <img
                  class="product-image"
                  src="${matchingProduct.image}"
                />
  
                <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-price">${formatCurreny(
                    matchingProduct.priceCents
                  )}</div>
                  <div class="product-quantity">
                    <span> Quantity: <span class="quantity-label">${
                      cartItem.quantity
                    }</span> </span>
                    <span class="update-quantity-link link-primary">
                      Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link"
                    data-product-id="${matchingProduct.id}";
                    >
                      Delete
                    </span>
                  </div>
                </div>
  
                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHtml(matchingProduct, cartItem)}
                </div>
              </div>
            </div>
    `;
    console.log(innerHtml);
  });
  console.log(innerHtml);

  document.querySelector(".js-order-summary").innerHTML = innerHtml;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
      saveToStorage();
      renderPaymentSummery();
    });
  });

  function deliveryOptionsHtml(matchingProduct, cartItem) {
    let innerHtml = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const datestring = deliveryDate.format("dddd MMMM D");
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurreny(deliveryOption.priceCents)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      innerHtml += `<div class="delivery-option js-delivery-options" 
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}" >
                    <input
                      type="radio"
                      ${isChecked ? "checked" : ""}
                      class="delivery-option-input"
                      name="delivery-option-${matchingProduct.id}"
                    />
                    <div>
                      <div class="delivery-option-date">${datestring}</div>
                      <div class="delivery-option-price">${priceString}</div>
                    </div>
                  </div>
                  `;
    });
    return innerHtml;
  }

  document.querySelectorAll(".js-delivery-options").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummery();
      renderPaymentSummery();
    });
  });
}
