import React from "react";
import { usePage, Head, Link } from "@inertiajs/react";
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
    <div className="min-h-screen bg-gray-50 pb-12">
      <Head title={t('home.page_title')} />
      <NavBar page_name="search" />

      <Container>
        {/* 🔹 Top heading */}
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
            {t('search.results_for')} <span className="text-blue-600">"{query}"</span>
            </h2>
        </div>
        
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
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl shadow-sm border border-gray-100 max-w-3xl mx-auto mt-8">
              <div className="w-40 h-40 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-500 max-w-md mb-8">
                We couldn't find anything matching "<strong>{query}</strong>". Try adjusting your search term or browsing our categories.
              </p>
              <Link
                href={route("categories")}
                className="btn btn-primary max-w-[200px]"
              >
                Browse Categories
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SearchResult;
