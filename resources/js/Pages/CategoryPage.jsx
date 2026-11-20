import React, { useState } from "react";
import { usePage, router, Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

import ProductCard from "@/Components/CategoryProductCard";
import Container from "@/Components/Container";
import NavBar from "@/Components/NavBar";
import PaginationControls from "@/Components/PaginationControls";

import AddItemModal from "@/Components/AddItemModal";
import EditItemModal from "@/Components/EditItemModal";
import DeleteItemModal from "@/Components/DeleteItemModal";

const CategoryPage = () => {
  const { t } = useTranslation();
  const page = usePage();
  const category = page.props.category || {};
  const products = page.props.products || [];
  const pagination = page.props.pagination || null;
  const { cart_items_count } = page.props;

  const { auth } = usePage().props;
  const user = auth.user;
  const manager = user?.user_type === "manager";

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  /* =========================
     ITEM ACTIONS
  ========================= */
  const handleAddItemConfirm = (itemData) => {
    router.post(
      route("categories.items.store", category.category_id),
      {
        name: itemData.name,
        brand: itemData.brand,
        description: itemData.description,
        price: itemData.price,
        inventory_quantity: itemData.inventory_quantity,
      },
      {
        preserveScroll: true,
        onSuccess: () => setShowAddItemModal(false),
        onError: (errors) => console.log(errors),
      }
    );
  };

  const handleDeleteItemConfirm = () => {
    if (!selectedItem) return;

    router.delete(route("items.destroy", { item: selectedItem.id }), {
      preserveScroll: true,
      onSuccess: () => {
        setShowDeleteItemModal(false);
        setSelectedItem(null);
      },
    });
  };

  const closeEditModal = () => {
    setShowEditItemModal(false);
    setSelectedItem(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteItemModal(false);
    setSelectedItem(null);
  };

  return (
    <>
      <Head title={t('home.page_title')} />
      <NavBar page_name="categories" />

      <Container>
        <h2 className="mt-6">
          {category.category_name?.toUpperCase()} {t('category.products')}
        </h2>
        {manager ? (
          <div className="action-btns mt-4 mb-8 flex gap-2.5">
            <button
              className="btn btn-success"
              onClick={() => setShowAddItemModal(true)}
            >
              {t('category.add_item')}
            </button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="h-full"
            >
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                brand={product.brand}
                description={product.description}
                price={product.price}
                color={product.color}
                color_id={product.color_id}
                size={product.size}
                size_id={product.size_id}
                image={product.image}
                inventory_quantity={product.inventory_quantity}
                onEdit={() => {
                  setSelectedItem(product);
                  setShowEditItemModal(true);
                }}
                onDelete={() => {
                  setSelectedItem(product);
                  setShowDeleteItemModal(true);
                }}
              />
            </div>
          ))}
        </div>

        <PaginationControls pagination={pagination} />

        {/* =========================
            MODALS
        ========================= */}
        {showAddItemModal && (
          <AddItemModal
            onClose={() => setShowAddItemModal(false)}
            onConfirm={handleAddItemConfirm}
          />
        )}

        {showEditItemModal && selectedItem && (
          <EditItemModal
            currentItem={selectedItem}
            onClose={closeEditModal}
          />
        )}

        {showDeleteItemModal && selectedItem && (
          <DeleteItemModal
            itemName={selectedItem.title || selectedItem.pr_name || ""}
            onClose={closeDeleteModal}
            onConfirm={handleDeleteItemConfirm}
          />
        )}
      </Container>

      {/* Floating checkout button when cart has items */}
      {user && cart_items_count > 0 && (
        <button
          onClick={() => router.visit(route("cart"))}
          className="fixed bottom-6 end-6 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-full px-6 py-3.5 shadow-[0_8px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.5)] z-30 flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
          aria-label="Go to cart and checkout"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {t("cart.checkout")} ({cart_items_count})
        </button>
      )}
    </>
  );
};

export default CategoryPage;
