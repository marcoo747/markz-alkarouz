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
  const { can_go_outside, cart, user, osra_time, next_same_day } = usePage().props;
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

  return (
    <>
      <Head title={t('home.page_title')} />
      <NavBar page_name="cart" />
      <Container>
        <div className="flex flex-col mb-8 mt-8">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{t('cart.title')}</h2>
          <p className="text-slate-500 mt-2 text-lg">Review your items before proceeding to checkout</p>
        </div>

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
             <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
             </svg>
             <p className="text-slate-500 text-lg font-medium">{t('cart.empty')}</p>
          </div>
        )}

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
            <div style={{ height: "120px" }}></div>
            <div 
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-slate-200/60 p-3 px-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] flex justify-between items-center rounded-2xl w-[92%] md:w-[600px] z-[1000] transition-all"
            >
              <div className="flex flex-col">
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-0.5">Total Amount</span>
                 <h4 className="mb-0 m-0 font-extrabold text-2xl text-slate-800 tracking-tight">{t('cart.total_egp')} {total}</h4>
              </div>
              <button 
                 className="bg-[#10b981] hover:bg-[#059669] text-white font-bold flex items-center gap-2 rounded-xl px-7 py-3.5 transition-all shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                 onClick={() => setShowCheckout(true)}
              >
                {t('cart.checkout')}
                <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Only show modal if user exists */}
        {showCheckout && user && (
          <CheckoutModal
            next_same_day={next_same_day}
            can_go_outside={can_go_outside}
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
