import React, { useState, useEffect } from "react";
import NavBar from "@/Components/NavBar";
import Carousel from "@/Components/Carousel";
import ItemPack from "@/Components/Item-pack";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import { router, usePage, Head } from "@inertiajs/react";
import TopAlert from "@/Components/TopAlert";
import LoginMessage from "@/Components/LoginMessage";
import EditImagesModal from "@/Components/EditImagesModal";
import PaginationControls from "@/Components/PaginationControls";
import { useTranslation } from "react-i18next";
import useTimeFilteredProducts from "@/Components/useTimeFilteredProducts";
import { useBooking } from "@/Components/BookingContext";

const Home = () => {
  const { t } = useTranslation();
  const { flash, products: initialProducts, pagination, auth, cart_items_count } = usePage().props;
  const [alertMessage, setAlertMessage] = useState("");
  const [showLoginAlert, setShowLoginAlert] = useState(true);

  const [carouselImages, setCarouselImages] = useState([]);
  const [loadingCarousel, setLoadingCarousel] = useState(true);
  const [showEditImages, setShowEditImages] = useState(false);
  const user = auth?.user;
  const manager = user?.user_type === "manager";

  const { openCheckout } = useBooking();
  const { products, loading: loadingProducts } = useTimeFilteredProducts({
    initialProducts: initialProducts || [],
  });

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await fetch(route('carousel.photos.index'));
        if (response.ok) {
          const data = await response.json();
          setCarouselImages(data.map(img => img.url));
        } else {
          setCarouselImages(["imgs/img1.jpg", "imgs/img1.jpg", "imgs/img1.jpg", "imgs/img1.jpg"]);
        }
      } catch (error) {
        console.error('Failed to fetch carousel images:', error);
        setCarouselImages(["imgs/img1.jpg", "imgs/img1.jpg", "imgs/img1.jpg", "imgs/img1.jpg"]);
      } finally {
        setLoadingCarousel(false);
      }
    };

    fetchCarouselImages();
  }, []);

  return (
    <>
      {showLoginAlert && <LoginMessage message={t('home.login_alert')} onClose={() => setShowLoginAlert(false)} />}
      {alertMessage && <TopAlert message={alertMessage} onClose={() => setAlertMessage("")} />}

      <Head title={t('home.page_title')} />

      <NavBar page_name="home" />

      <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-start-2 md:col-span-1 text-center">
              <p className="text-sm font-semibold text-blue-600 mb-2">{t('home.welcome')}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('home.hero_title')}</h1>
              <p className="text-gray-600 mb-8">
                {t('home.hero_desc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="btn btn-primary"
                  onClick={() => router.visit(route("categories"))}
                >
                  {t('home.get_started')}
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() =>
                    window.scrollTo({ top: 600, behavior: "smooth" })
                  }
                >
                  {t('home.learn_more')}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="mt-8 flex flex-col gap-4">
          {loadingCarousel ? (
            <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400"></div>
                <span className="text-slate-500">Loading carousel...</span>
              </div>
            </div>
          ) : (
            <Carousel images={carouselImages} />
          )}

          {manager && (
            <button
              className="w-full md:w-auto mx-auto px-6 flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all duration-200 border border-slate-200 shadow-sm active:scale-[0.98]"
              onClick={() => setShowEditImages(true)}
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Edit Images
            </button>
          )}

          {showEditImages && (
            <EditImagesModal
              initialImages={carouselImages}
              onClose={() => setShowEditImages(false)}
              onSave={async () => {
                try {
                  const response = await fetch(route('carousel.photos.index'));
                  if (response.ok) {
                    const data = await response.json();
                    setCarouselImages(data.map(img => img.url));
                  }
                } catch (error) {
                  console.error('Failed to refresh carousel images:', error);
                }
              }}
            />
          )}
        </div>

        <div className="mt-8">
          {loadingProducts ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              <span className="text-slate-500">Updating products...</span>
            </div>
          ) : (
            <ItemPack
              category_name={t('home.recently_added')}
              products={products}
              setAlertMessage={setAlertMessage}
            />
          )}
        </div>

        <PaginationControls pagination={pagination} />
      </Container>

      {/* Floating checkout button when cart has items */}
      {user && cart_items_count > 0 && (
        <button
          onClick={openCheckout}
          className="fixed bottom-6 right-6 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-full px-6 py-4 shadow-[0_8px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.5)] z-40 flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
          aria-label="Open checkout"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Checkout ({cart_items_count})
        </button>
      )}
    </>
  );
};

export default Home;
