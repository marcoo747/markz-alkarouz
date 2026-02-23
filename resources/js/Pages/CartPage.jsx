import React, { useState } from "react";
import { usePage, router, Head } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import ProductCard from "@/Components/CartCard";
import CheckoutModal from "@/Components/CheckoutModal";

const CartPage = () => {
  const { cart, user, osra_time } = usePage().props;
  const products = cart?.products ?? [];
  const { errors } = usePage().props;

  const total = products.reduce((acc, p) => acc + Number(p.pr_price), 0);

  const [showCheckout, setShowCheckout] = useState(false);

  const removeItem = (product_id) => {
    router.delete(route("cart.remove"), {
      data: { product_id },
      preserveScroll: true,
    });
  };

  const handleConfirmBooking = (bookingData) => {
    router.post(route("requests.createFromCart"), bookingData, {
      preserveScroll: true,
      onSuccess: () => setShowCheckout(false),
    });
  };
console.log(products);
  return (
    <>
      <Head title="مركز وسائل الإيضاح" />
      <NavBar page_name="cart" />
      <Container>
        <h2 className="mt-6">Your Cart</h2>

        {products.length === 0 && <p>Your cart is empty.</p>}

        <div className="row">
          {products.map((product) => {
            const image =
              product.images && product.images.length > 0
                ? `/markaz_alkarouz/public/storage/${product.images[0].photo}`
                : "/markaz_alkarouz/public/imgs/shopping.webp";

            return (
              <div key={product.product_id} className="col-6 col-md-4 col-lg-3 mb-4">
                <ProductCard
                  id={product.product_id}
                  title={product.pr_name}
                  brand={product.brand}
                  color={product.pivot.color}
                  size={product.pivot.size}
                  quantity={product.pivot.quantity}
                  description={`Price: EGP ${product.pr_price}`}
                  image={image}
                  onRemove={() => removeItem(product.product_id)}
                />
              </div>
            );
          })}
        </div>

        {products.length > 0 && (
          <div className="text-right mt-6">
            <h4>Total: EGP {total}</h4>
            <button className="btn btn-success" onClick={() => setShowCheckout(true)}>
              Checkout
            </button>
          </div>
        )}

        {/* Only show modal if user exists */}
        {showCheckout && user && (
          <CheckoutModal
            errors={errors}
            total={total}
            user={user}
            onClose={() => setShowCheckout(false)}
            onConfirm={handleConfirmBooking}
            osraTime={osra_time}
          />
        )}
      </Container>
    </>
  );
};

export default CartPage;
