import React from "react";
import { usePage, Head, Link, router } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import Container from "@/Components/Container";
import ItemPack from "@/Components/Item-pack";
import PaginationControls from "@/Components/PaginationControls";
import { useTranslation } from "react-i18next";
import useTimeFilteredProducts from "@/Components/useTimeFilteredProducts";
import { useBooking } from "@/Components/BookingContext";

const SearchResult = () => {
  const { t } = useTranslation();
  const { props } = usePage();
  const query = props.query ?? "";
  const initialResults = Array.isArray(props.results) ? props.results : [];
  const pagination = props.pagination || null;
  const { cart_items_count, auth } = props;
  const user = auth?.user;

  const { openCheckout } = useBooking();

  // Map initial results to the standard product shape
  const initialProducts = initialResults.map((p) => ({
    id: p.product_id,
    title: p.pr_name,
    brand: p.brand,
    description: p.pr_description,
    price: p.pr_price,
    inventory_quantity: p.inventory_quantity,
    image:
      p.images && p.images.length > 0
        ? `/markaz_alkarouz/public/storage/${p.images[0].photo}`
        : "/markaz_alkarouz/public/imgs/shopping.webp",
  }));

  const { products: results, loading: loadingProducts } = useTimeFilteredProducts({
    initialProducts,
    searchQuery: query,
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Head title={t('home.page_title')} />
      <NavBar page_name="search" />

      <Container>
        {/* Top heading */}
        <div className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
            {t('search.results_for')} <span className="text-blue-600">"{query}"</span>
          </h2>
        </div>

        <div className="mt-0">
          {loadingProducts ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              <span className="text-slate-500">Updating results...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-5">
              {results.map((p) => (
                <ItemPack
                  key={p.id || p.product_id}
                  category_name=""
                  products={[p]}
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
                We couldn't find anything matching "<strong>{query}</strong>" for the selected time. Try adjusting your search term, changing the booking time, or browsing our categories.
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

        <PaginationControls pagination={pagination} params={{ query }} />
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
    </div>
  );
};

export default SearchResult;
