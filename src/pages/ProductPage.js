import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Container from "../Components/Container";
import ItemPack from "../Components/item-pack";
import ProductDetail from "../Components/ProductDetail";
import EditItemModal from "../Components/EditCategoryModal";
import DeleteItemModal from "../Components/DeleteItemModal";
import "../styles/productPage.css";

const fallbackProduct = {
  title: "3 Pack 180L Extra Large Under Bed Storage Bags",
  description: "Premium storage solution for your home",
  images: ["/imgs/shopping.webp", "/imgs/shopping.webp", "/imgs/shopping.webp"],
  price: "119.25",
  rating: 4.5,
  specs: {
    brand: "Voency",
    material: "PVC",
    color: "Ice",
    dimensions: "31.5 x 15.75 x 11.82 inches",
  },
  detailedDescription: [
    "Made from high-quality PVC material that is durable and water-resistant",
    "Extra large capacity of 180L per bag - perfect for storing blankets, pillows, and seasonal items",
    "Can be used under bed, in closets, basements, or attics for better space organization",
    "Features a heavy-duty reinforced zipper that ensures items stay secure and protected",
    "Excellent customer service with 30-day money-back guarantee and lifetime support",
  ],
};

const relatedProducts = [
  {
    title: "Samsung Galaxy S22 Ultra",
    description: "12GB RAM, 256GB Storage, Blush Gold",
    image: "/imgs/shopping.webp",
    price: "59500.00",
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
  {
    title: "Wireless Charger",
    description: "Fast charging pad for smartphones",
    image: "/imgs/shopping.webp",
    price: "800",
    rating: 4,
  },
];

const ProductPage = () => {
  const { state } = useLocation();
  const product = state?.product || fallbackProduct;

  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowEditItemModal(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setShowDeleteItemModal(true);
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
        <div className="action-btns" style={{ marginTop: 24, marginBottom: 24 }}>
          <button className="btn btn-info" onClick={() => handleEditItem(product)}>
            Edit Product
          </button>
          <button className="btn btn-danger" onClick={() => handleDeleteItem(product)}>
            Delete Product
          </button>
        </div>

        <ProductDetail
          product={product}
          showSeeMore={true}
          onSeeMore={() => {
            const el = document.getElementById("specs-more");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />

        {/* Related Items Section */}
        <div className="item-pack">
          <ItemPack
            category_name="You might also like"
            products={relatedProducts}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        </div>
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
      </Container>
    </div>
  );
};

export default ProductPage;
