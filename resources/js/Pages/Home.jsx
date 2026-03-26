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
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const { flash, products, auth } = usePage().props;
  const [alertMessage, setAlertMessage] = useState("");
  const [showLoginAlert, setShowLoginAlert] = useState(true);
  
  const [carouselImages, setCarouselImages] = useState([
    "imgs/img1.jpg", 
    "imgs/img1.jpg", 
    "imgs/img1.jpg", 
    "imgs/img1.jpg"
  ]);
  const [showEditImages, setShowEditImages] = useState(false);
  const user = auth?.user;
  const manager = user?.user_type === "manager";

  useEffect(() => {
    if (flash?.success) {
      setAlertMessage(flash.success);
      const timer = setTimeout(() => setAlertMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  return (
    <>
      {/* Top Login Alert */}
      {showLoginAlert && <LoginMessage message={t('home.login_alert')} onClose={() => setShowLoginAlert(false)} />}
      {/* Top Alert */}
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
                  className="btn btn-outline "
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
          <Carousel
            images={carouselImages}
          />
          
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
               onSave={(newImages) => setCarouselImages(newImages)}
            />
          )}

        </div>

        <div className="mt-8">
          <ItemPack
            category_name={t('home.recently_added')}
            products={products}
            setAlertMessage={setAlertMessage}
          />
        </div>
      </Container>
    </>
  );
};

export default Home;
