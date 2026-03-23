import React, { useState } from "react";
import { usePage, router, Link, Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import NavBar from "@/Components/NavBar";
import Category from "@/Components/Category";
import Container from "@/Components/Container";
import AddCategoryModal from "@/Components/AddCategoryModal";
import EditCategoryModal from "@/Components/EditCategoryModal";
import DeleteCategoryModal from "@/Components/DeleteCategoryModal";

const Categories = () => {
  const { t } = useTranslation();
  const { categories, type, main_category_id } = usePage().props;
  const { auth } = usePage().props;
  const user = auth.user;
  const manager = user?.user_type === "manager";

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(null);
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
    formData.append("category_description", description + (type ? ` [type:${type}]` : ''));
    if (photo) formData.append("category_photo", photo);

    router.post(route("categories.store"), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setShowAddModal(false);
  };

  const handleEditConfirm = ({ name, description, photo }) => {
    const formData = new FormData();
    formData.append("category_name", name);
    formData.append("category_description", description + (type ? ` [type:${type}]` : ''));
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
      <Head title={t('categories.page_title')} />
      <NavBar page_name="categories" />
      <Container>
        <h2 className="mt-6">{t('categories.title')}</h2>
        {manager ? (
          <div className="mt-4 mb-8 flex gap-2.5">
            <button className="btn btn-success" onClick={handleAdd}>{t('categories.add_category')}</button>
          </div>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const cleanDesc = cat.category_description ? cat.category_description.replace(/ \[type:.*?\]/g, '') : '';
          return (
          <div key={cat.category_id}>
            <Category
              key={cat.category_id}
              id={cat.category_id}
              title={cat.category_name}
              description={cleanDesc}
              image={cat.category_photo ? `/markaz_alkarouz/public/storage/${cat.category_photo}` : "/markaz_alkarouz/public/imgs/shopping.webp"}
              onEdit={() => handleEdit({ ...cat, category_description: cleanDesc })}
              onDelete={() => handleDelete({ ...cat, category_description: cleanDesc })}
            />
          </div>
          );
        })}
        </div>

        {showAddModal && (
          <AddCategoryModal
            onClose={() => setShowAddModal(false)}
            main_category_id={main_category_id}
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
