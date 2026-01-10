import React, { useState } from "react";
import { usePage, router, Head } from "@inertiajs/react";

import ProductCard from "@/Components/CategoryProductCard";
import Container from "@/Components/Container";
import NavBar from "@/Components/NavBar";

import AddItemModal from "@/Components/AddItemModal";
import EditItemModal from "@/Components/EditItemModal";
import DeleteItemModal from "@/Components/DeleteItemModal";

const CategoryPage = () => {
  const page = usePage();
  const category = page.props.category || {};
  const products = page.props.products || [];

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
      },
      {
        preserveScroll: true,
        onSuccess: () => setShowAddItemModal(false),
        onError: (errors) => console.log(errors),
      }
    );
  };

  const handleEditItemConfirm = (itemData) => {
    if (!selectedItem) return;

    router.put(
      route("items.update", selectedItem.product_id),
      {
        name: itemData.name,
        brand: itemData.brand,
        description: itemData.description,
        price: itemData.price,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setShowEditItemModal(false);
          setSelectedItem(null);
        },
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

  /* =========================
     MODAL CLOSE HANDLERS
  ========================= */
  const closeEditModal = () => {
    setShowEditItemModal(false);
    setSelectedItem(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteItemModal(false);
    setSelectedItem(null);
  };

  const { auth } = usePage().props;
  const user = auth.user;
  const manager = user?.user_type === "manager";
  return (
    <>
      <Head title="مركز وسائل الإيضاح" />
      <NavBar page_name="categories" />

      <Container>
        <h2 style={{ marginTop: 24 }}>
          {category.category_name?.toUpperCase()} Products
        </h2>
        {manager ? (
          <div
            className="action-btns"
            style={{ marginTop: '16px', marginBottom: '32px', display: 'flex', gap: '10px' }}
          >
            <button
              className="btn btn-success"
              onClick={() => setShowAddItemModal(true)}
            >
              Add Item
            </button>
          </div>
        ) : null}

        <div className="row">
          {products.map((product) => (
            <div
              key={product.id}
              className="col-6 col-md-4 col-lg-3 mb-4"
              style={{ marginTop: 24 }}
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
            onConfirm={handleEditItemConfirm}
          />
        )}

        {showDeleteItemModal && selectedItem && (
          <DeleteItemModal
            itemName={selectedItem.pr_name}
            onClose={closeDeleteModal}
            onConfirm={handleDeleteItemConfirm}
          />
        )}
      </Container>
    </>
  );
};

export default CategoryPage;
