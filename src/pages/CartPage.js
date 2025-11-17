import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import CheckoutModal from "../Components/CheckoutModal";
import "../styles/cart.css";

const CartPage = () => {
  const [showModal, setShowModal] = useState(false);

  const cartItems = [
    {
      id: 1,
      title: "Samsung Galaxy S22 Ultra",
      image: "/imgs/shopping.webp",
      price: 59990,
      quantity: 1,
    },
    {
      id: 2,
      title: "iPhone 14 Pro Max Case",
      image: "/imgs/shopping.webp",
      price: 425,
      quantity: 2,
    },
  ];

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <NavBar />
      <div className="container cart-page mt-4">
        <h2>Your Cart</h2>

        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="item-details">
                <h5>{item.title}</h5>
                <p>Price: ₹{item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <button className="btn btn-danger btn-sm">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary text-end mt-4">
          <h4>Total: ₹{total}</h4>
          <button className="btn btn-success" onClick={() => setShowModal(true)}>
            Proceed to Checkout
          </button>
        </div>
      </div>

      {showModal && <CheckoutModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default CartPage;
