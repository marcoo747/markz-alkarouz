import React, { useState, useEffect } from "react";
import NavBar from "@/Components/NavBar";
import Carousel from "@/Components/Carousel";
import ItemPack from "@/Components/Item-pack";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import { router, usePage, Head } from "@inertiajs/react";
import TopAlert from "@/Components/TopAlert";
import LoginMessage from "@/Components/LoginMessage";

const Home = () => {
  const { flash, products } = usePage().props;
  const [alertMessage, setAlertMessage] = useState("");

  const [alerLogintMessage, setAlertLoginMessage] = useState( "Welcome! Please log in first to use this website." );

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
      {alerLogintMessage && <LoginMessage message={alerLogintMessage} onClose={() => setAlertLoginMessage("")} />}
      {/* Top Alert */}
      {alertMessage && <TopAlert message={alertMessage} onClose={() => setAlertMessage("")} />}

      <Head title="مركز وسائل الإيضاح" />

      <NavBar page_name="home" />

      <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-start-2 md:col-span-1 text-center">
              <p className="text-sm font-semibold text-blue-600 mb-2">مرحباً بكم</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">مركز وسائل الإيضاح - كنيسة مار مرقس الرسول</h1>
              <p className="text-gray-600 mb-8">
                منصة تعرض الموارد والمنتجات الخاصة بالمركز. اكتشف الإضافات الأخيرة
                وتصفح التصنيفات بسهولة.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="btn btn-primary"
                  onClick={() => router.visit(route("categories"))}
                >
                  Get Started
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() =>
                    window.scrollTo({ top: 600, behavior: "smooth" })
                  }
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="mt-8">
          <Carousel
            images={["imgs/img1.jpg", "imgs/img1.jpg", "imgs/img1.jpg", "imgs/img1.jpg"]}
          />
        </div>

        <div className="mt-8">
          <ItemPack
            category_name="Recently Added"
            products={products}
            setAlertMessage={setAlertMessage}
          />
        </div>
      </Container>
    </>
  );
};

export default Home;
