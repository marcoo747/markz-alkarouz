import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import CheckoutModal from "../Components/CheckoutModal";
import Container from "../Components/Container";
import Button from "../Components/Button";
import Card from "../Components/card";
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
    0,
  );

  return (
    <>
      <NavBar />
      <Container>
        <h2 style={{ marginTop: 24 }}>Your Cart</h2>

        <div className="grid grid-cols-1" style={{ marginTop: 16 }}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{ display: "flex", gap: 16, alignItems: "center" }}
            >
              <Card
                className=""
                image={item.image}
                title={item.title}
                description={`Price: ₹${item.price} • Qty: ${item.quantity}`}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="outline" onClick={() => {}}>
                    Remove
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "right", marginTop: 24 }}>
          <h4>Total: ₹{total}</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Proceed to Checkout
          </Button>
        </div>
      </Container>

      {showModal && <CheckoutModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default CartPage;
