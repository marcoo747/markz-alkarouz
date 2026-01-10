import React, { useState, useEffect } from "react";
import NavBar from "@/Components/NavBar";
import Carousel from "@/Components/Carousel";
import ItemPack from "@/Components/Item-pack";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import { router, usePage, Head } from "@inertiajs/react";
import TopAlert from "@/Components/TopAlert";
import LoginMessage from "@/Components/LoginMessage";
import "../../css/home.css";

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

      <section className="hero">
        <Container>
          <div className="row">
            <div className="col-8 offset-2">
              <p className="hero-eyebrow">مرحباً بكم</p>
              <h1>مركز وسائل الإيضاح - كنيسة مار مرقس الرسول</h1>
              <p className="hero-eyebrow">
                منصة تعرض الموارد والمنتجات الخاصة بالمركز. اكتشف الإضافات الأخيرة
                وتصفح التصنيفات بسهولة.
              </p>

              <div className="hero-cta">
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
            images={["imgs/img1.jpg", "imgs/img1.jpg", "imgs/img1.jpg"]}
          />
        </div>

        <div className="mt-8">
          <ItemPack
            category_name="Recently Added >"
            products={products}
            setAlertMessage={setAlertMessage}
          />
        </div>
      </Container>
    </>
  );
};

export default Home;