import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import Category from "../Components/category";
import Container from "../Components/Container";
import AddCategoryModal from "../Components/AddCategoryModal";
import EditCategoryModal from "../Components/EditCategoryModal";
import DeleteCategoryModal from "../Components/DeleteCategoryModal";
import "../styles/categories.css";

const categoryData = [
  {
    title: "Speakers",
    description: "Explore our latest audio systems and portable speakers.",
    image: "/imgs/shopping.webp",
  },
  {
    title: "Clothing",
    description: "Trendy outfits and accessories for all seasons.",
    image: "/imgs/shopping.webp",
  },
  {
    title: "Electronics",
    description: "Smart gadgets and tech essentials.",
    image: "/imgs/shopping.webp",
  },
  {
    title: "Electronics",
    description: "Smart gadgets and tech essentials.",
    image: "/imgs/shopping.webp",
  },
  {
    title: "Electronics",
    description: "Smart gadgets and tech essentials.",
    image: "/imgs/shopping.webp",
  },
  {
    title: "Electronics",
    description: "Smart gadgets and tech essentials.",
    image: "/imgs/shopping.webp",
  },
  {
    title: "Electronics",
    description: "Smart gadgets and tech essentials.",
    image: "/imgs/shopping.webp",
  },
  // أضف باقي الفئات هنا
];

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleEdit = (cat) => {
    setSelectedCategory(cat);
    setShowEditModal(true);
  };

  const handleDelete = (cat) => {
    setSelectedCategory(cat);
    setShowDeleteModal(true);
  };

  const handleAddConfirm = (name) => {
    // Nothing happens
  };

  const handleEditConfirm = (newName) => {
    // Nothing happens
  };

  const handleDeleteConfirm = () => {
    // Nothing happens
  };

  return (
    <div>
      <NavBar />
      <Container>
        <h2 style={{ marginTop: 24 }}>Categories</h2>
        <div  style={{ marginTop: '16px', marginBottom: '32px', display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={handleAdd}>
            Add Category
          </button>
        </div>
        <div className="grid grid-cols-3 mt-8">
          {categoryData.map((cat, index) => (
            <Category
              key={index}
              title={cat.title}
              description={cat.description}
              image={cat.image}
              onEdit={() => handleEdit(cat)}
              onDelete={() => handleDelete(cat)}
            />
          ))}
        </div>
        {showAddModal && (
          <AddCategoryModal
            onClose={() => setShowAddModal(false)}
            onConfirm={handleAddConfirm}
          />
        )}
        {showEditModal && (
          <EditCategoryModal
            onClose={() => setShowEditModal(false)}
            onConfirm={handleEditConfirm}
            currentName={selectedCategory?.title}
          />
        )}
        {showDeleteModal && (
          <DeleteCategoryModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            categoryName={selectedCategory?.title}
          />
        )}
      </Container>
    </div>
  );
};

export default Categories;
