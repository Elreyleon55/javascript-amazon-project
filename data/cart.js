export let cart = JSON.parse(localStorage.getItem("cart"));

// if (cart) {
//   cart = [
//     {
//       productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
//       quantity: 2,
//     },
//     {
//       productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
//       quantity: 1,
//     },
//   ];
// }

//you cant see it here beacasue the cart is updated after this file is loaded
console.log(cart);

export function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
    });
  }
}

console.log(cart);

export function removeFromCart(productId) {
  const newCart = cart.filter((cartItem) => {
    if (productId === cartItem.productId) {
      return false;
    } else {
      return true;
    }
  });
  cart = newCart;
  saveToStorage();
}
