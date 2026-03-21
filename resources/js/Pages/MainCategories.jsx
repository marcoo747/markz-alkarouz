import React from "react";
import { Head, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import NavBar from "@/Components/NavBar";
import Container from "@/Components/Container";
import Category from "@/Components/Category";

const MainCategories = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head title="Main Categories" />
      <NavBar page_name="categories" />
      <Container>
        <h2 className="mt-6 mb-8 text-2xl font-bold text-gray-800">
           {t('categories.title') || "Categories"}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Category
            id={1}
            title="Electronics"
            description="Browse electronic categories"
            image="/imgs/shopping.webp"
            onClick={() => router.visit(route('categories.type', 1))}
          />
          <Category
            id={2}
            title="Non-Electronics"
            description="Browse physical stores & tools"
            image="/imgs/shopping.webp"
            onClick={() => router.visit(route('categories.type', 2))}
          />
        </div>
      </Container>
    </>
  );
};

export default MainCategories;
