import React from "react";
import { usePage, Head } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import Container from "@/Components/Container";
import ItemPack from "@/Components/Item-pack";
import { useTranslation } from "react-i18next";

const SearchResult = () => {
  const { t } = useTranslation();
  const { props } = usePage();
  const query = props.query ?? "";
  const results = Array.isArray(props.results) ? props.results : [];

  return (
    <>
      <Head title={t('home.page_title')} />
      <NavBar page_name="search" />

      <Container>
        {/* 🔹 Top heading */}
        <h2 className="mt-5 mb-2.5">
          {t('search.results_for')} "<strong>{query}</strong>"
        </h2>
        <div className="mt-0">
          {results.length > 0 ? (
            <div className="grid gap-5">
              {results.map((p) => (
                <ItemPack
                  key={p.product_id}
                  category_name=""
                  products={[
                    {
                      id: p.product_id,
                      title: p.pr_name,
                      brand: p.brand,
                      description: p.pr_description,
                      price: p.pr_price,
                      image:
                        p.images && p.images.length > 0
                          ? `storage/${p.images[0].photo}`
                          : "imgs/shopping.webp",
                    },
                  ]}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <p className="mt-10">
              {t('search.no_results')} "<strong>{query}</strong>"
            </p>
          )}
        </div>
      </Container>
    </>
  );
};

export default SearchResult;
