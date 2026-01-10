import React, { useState } from "react";
import { usePage, router, Link, Head } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import Category from "@/Components/Category";
import Container from "@/Components/Container";
import AddCategoryModal from "@/Components/AddCategoryModal";
import EditCategoryModal from "@/Components/EditCategoryModal";
import DeleteCategoryModal from "@/Components/DeleteCategoryModal";
import "../../css/categories.css";

const Categories = () => {
  const { categories } = usePage().props;
  const { auth } = usePage().props;
  const user = auth.user;
  const manager = user?.user_type === "manager";

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAdd = () => setShowAddModal(true);
  const handleEdit = (cat) => { setSelectedCategory(cat); setShowEditModal(true); };
  const handleDelete = (cat) => { setSelectedCategory(cat); setShowDeleteModal(true); };

  // ADD
  const handleAddConfirm = ({ name, description, photo }) => {
    const formData = new FormData();
    formData.append("category_name", name);
    formData.append("category_description", description);
    if (photo) formData.append("category_photo", photo);

    router.post(route("categories.store"), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setShowAddModal(false);
  };

  const handleEditConfirm = ({ name, description, photo }) => {
    const formData = new FormData();
    formData.append("category_name", name);
    formData.append("category_description", description);
    if (photo) formData.append("category_photo", photo);
    formData.append("_method", "PATCH"); // simulate PATCH

    router.post(route("categories.update", selectedCategory.category_id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setShowEditModal(false);
  };

  // DELETE
  const handleDeleteConfirm = () => {
    router.delete(route("categories.destroy", selectedCategory.category_id));
    setShowDeleteModal(false);
  };

  return (
    <>
      <Head title="مركز وسائل الإيضاح" />
      <NavBar page_name="categories" />
      <Container>
        <h2 style={{ marginTop: 24 }}>Categories</h2>
        {manager ? (
          <div style={{ marginTop: '16px', marginBottom: '32px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-success" onClick={handleAdd}>Add Category</button>
          </div>
        ) : null}

        <div className="row">
        {categories.map((cat) => (
          <div className="col-6 col-md-4 col-lg-3 mb-4" key={cat.category_id}>
            <Category
              key={cat.category_id}
              id={cat.category_id}
              title={cat.category_name}
              description={cat.category_description}
              image={cat.category_photo ? `storage/${cat.category_photo}` : "/imgs/shopping.webp"}
              onEdit={() => handleEdit(cat)}
              onDelete={() => handleDelete(cat)}
            />
          </div>
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
            category={selectedCategory}
            onConfirm={handleEditConfirm}
          />
        )}

        {showDeleteModal && (
          <DeleteCategoryModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            categoryName={selectedCategory?.category_name}
          />
        )}
      </Container>
    </>
  );
};

export default Categories;
