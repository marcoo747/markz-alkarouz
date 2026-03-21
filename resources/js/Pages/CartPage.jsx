import React, { useState } from "react";
import { usePage, router, Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import NavBar from "@/Components/NavBar";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import ProductCard from "@/Components/CartCard";
import CheckoutModal from "@/Components/CheckoutModal";

const CartPage = () => {
  const { t } = useTranslation();
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
      <Head title={t('home.page_title')} />
      <NavBar page_name="cart" />
      <Container>
        <h2 className="mt-6">{t('cart.title')}</h2>

        {products.length === 0 && <p>{t('cart.empty')}</p>}

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
                  description={`${t('cart.price_egp')} ${product.pr_price}`}
                  image={image}
                  onRemove={() => removeItem(product.product_id)}
                />
              </div>
            );
          })}
        </div>

        {products.length > 0 && (
          <>
            <div style={{ height: "100px" }}></div>
            <div 
              className="position-fixed bottom-0 start-0 w-100 bg-white p-3 shadow-lg d-flex justify-content-between align-items-center"
              style={{ zIndex: 1000, position: "fixed", bottom: 0, left: 0, right: 0 }}
            >
              <h4 className="mb-0 m-0 font-weight-bold">{t('cart.total_egp')} {total}</h4>
              <button className="btn btn-success px-5 py-2" onClick={() => setShowCheckout(true)}>
                {t('cart.checkout')}
              </button>
            </div>
          </>
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
