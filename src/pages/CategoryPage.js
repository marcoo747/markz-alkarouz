import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../Components/card";
import Container from "../Components/Container";
import "../styles/categoryPage.css";
import NavBar from "../Components/NavBar";
import EditCategoryModal from "../Components/EditCategoryModal";
import DeleteCategoryModal from "../Components/DeleteCategoryModal";
import AddItemModal from "../Components/AddItemModal";
import EditItemModal from "../Components/EditCategoryModal";
import DeleteItemModal from "../Components/DeleteItemModal";

const products = [
  {
    title: "Samsung Galaxy S22 Ultra",
    description: "12GB RAM, 256GB Storage, Blush Gold",
    image: "/imgs/shopping.webp",
    price: "59990",
    rating: 4,
  },
  {
    title: "iPhone 14 Pro Max Case",
    description: "Clear case with card holder",
    image: "/imgs/shopping.webp",
    price: "425",
    rating: 3,
  },
  {
    title: "Bluetooth Speaker",
    description: "Portable speaker with mic",
    image: "/imgs/shopping.webp",
    price: "1200",
    rating: 5,
  },
  {
    title: "Noise Cancelling Headphones",
    description: "Over-ear wireless headphones",
    image: "/imgs/shopping.webp",
    price: "2500",
    rating: 4,
  },
];

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [itemMode, setItemMode] = useState(null); // 'edit' or 'delete'
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEditCategory = () => {
    setShowEditCategoryModal(true);
  };

  const handleDeleteCategory = () => {
    setShowDeleteCategoryModal(true);
  };

  const handleAddItem = () => {
    setShowAddItemModal(true);
  };

  const handleEditItem = () => {
    setItemMode("edit");
  };

  const handleDeleteItem = () => {
    setItemMode("delete");
  };

  const handleItemClick = (item) => {
    if (itemMode === "edit") {
      setSelectedItem(item);
      setShowEditItemModal(true);
      setItemMode(null);
    } else if (itemMode === "delete") {
      setSelectedItem(item);
      setShowDeleteItemModal(true);
      setItemMode(null);
    }
  };

  const handleEditCategoryConfirm = (newName) => {
    // Nothing happens
  };

  const handleDeleteCategoryConfirm = () => {
    // Nothing happens
  };

  const handleAddItemConfirm = (itemData) => {
    // Nothing happens
  };

  const handleEditItemConfirm = (itemData) => {
    // Nothing happens
  };

  const handleDeleteItemConfirm = () => {
    // Nothing happens
  };

  return (
    <div>
      <NavBar />
      <Container>
        <h2 style={{ marginTop: 24 }}>
          {categoryName ? categoryName.toUpperCase() : "Category"} Products
        </h2>
        <div className="action-btns"
            
          
        >
          <button className="btn btn-primary" onClick={handleAddItem}>
            Add Item
          </button>
        </div>
        {itemMode && (
          <p style={{ color: "blue", marginBottom: "16px" }}>
            Click on an item to {itemMode} it.
          </p>
        )}
        <div className="items">
        <div className="product-grid" style={{ marginTop: 24 }}>
          {products.map((p, idx) => (
            <ProductCard
              key={idx}
              {...p}
              onClick={itemMode ? () => handleItemClick(p) : null}
            />
          ))}
        </div>
        {showAddItemModal && (
          <AddItemModal
            onClose={() => setShowAddItemModal(false)}
            onConfirm={handleAddItemConfirm}
          />
        )}
        {showEditItemModal && (
          <EditItemModal
            onClose={() => setShowEditItemModal(false)}
            onConfirm={handleEditItemConfirm}
            currentItem={selectedItem}
          />
        )}
        {showDeleteItemModal && (
          <DeleteItemModal
            onClose={() => setShowDeleteItemModal(false)}
            onConfirm={handleDeleteItemConfirm}
            itemName={selectedItem?.title}
          />
        )}
        {showEditCategoryModal && (
          <EditCategoryModal
            onClose={() => setShowEditCategoryModal(false)}
            onConfirm={handleEditCategoryConfirm}
            currentName={categoryName}
          />
        )}
        {showDeleteCategoryModal && (
          <DeleteCategoryModal
            onClose={() => setShowDeleteCategoryModal(false)}
            onConfirm={handleDeleteCategoryConfirm}
            categoryName={categoryName}
          />
        )}
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
