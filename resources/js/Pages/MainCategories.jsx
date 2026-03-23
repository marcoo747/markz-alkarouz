import React, { useState } from "react";
import { usePage, Head, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import NavBar from "@/Components/NavBar";
import Container from "@/Components/Container";
import Category from "@/Components/Category";
import AddCategoryModal from "@/Components/AddMainCategoryModal";
import EditCategoryModal from "@/Components/EditMainCategoryModal";
import DeleteCategoryModal from "@/Components/DeleteMainCategoryModal";

const MainCategories = () => {
  const { t } = useTranslation();
  const { auth, main_categories } = usePage().props;
  const user = auth.user;
  const manager = user?.user_type === "manager";

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAdd = () => setShowAddModal(true);

  const handleEdit = (cat) => {
    setSelectedCategory(cat);
    setShowEditModal(true);
  };

  const handleDelete = (cat) => {
    setSelectedCategory(cat);
    setShowDeleteModal(true);
  };

  // ADD CATEGORY
  const handleAddConfirm = ({ name, description, photo }) => {
    const formData = new FormData();
    formData.append("category_name", name);
    formData.append("category_description", description);
    if (photo instanceof File) formData.append("category_photo", photo);

    router.post(route("categories.store"), formData, {
      forceFormData: true,
      headers: { "Content-Type": "multipart/form-data" },
      onError: (errors) => console.log(errors),
    });

    setShowAddModal(false);
  };

  // EDIT CATEGORY
  const handleEditConfirm = ({ name, description, photo, canGoOutside }) => {
    if (!selectedCategory || !selectedCategory.category_id) {
      console.error("No category selected!");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", name);
    formData.append("category_description", description);
    formData.append("can_go_outside", canGoOutside ? 1 : 0);
    if (photo instanceof File) formData.append("category_photo", photo);

    router.post(
      route("main_categories.update", selectedCategory.category_id),
      formData,
      {
        forceFormData: true,
        onError: (errors) => console.log(errors),
      }
    );

    setShowEditModal(false);
  };

  // DELETE CATEGORY
  const handleDeleteConfirm = () => {
    if (!selectedCategory || !selectedCategory.category_id) return;

    router.delete(route("main_categories.destroy", selectedCategory.category_id));
    setShowDeleteModal(false);
  };

  return (
    <>
      <Head title="Main Categories" />
      <NavBar page_name="categories" />
      <Container>
        <h2 className="mt-6 mb-8 text-2xl font-bold text-gray-800">
          {t("main_categories.title")}
        </h2>

        {manager && (
          <div className="mt-4 mb-8 flex gap-2.5">
            <button className="btn btn-success" onClick={handleAdd}>
              {t("main_categories.add_category")}
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {main_categories.map((cat) => {
            const cleanDesc = cat.category_description
              ? cat.category_description.replace(/ \[type:.*?\]/g, "")
              : "";

            if(user){
                return (
                <Category
                  key={cat.category_id}
                  id={cat.category_id}
                  title={cat.category_name}
                  description={cleanDesc}
                  image={
                    cat.category_photo
                      ? `storage/${cat.category_photo}`
                      : "/markaz_alkarouz/public/imgs/shopping.webp"
                  }
                  onClick={() =>
                    router.visit(route("show_main_category", cat.category_id))
                  }
                  onEdit={() =>
                    handleEdit({ ...cat, category_description: cleanDesc })
                  }
                  onDelete={() =>
                    handleDelete({ ...cat, category_description: cleanDesc })
                  }
                />
              );
            }else{
              if(cat.can_go_outside){
                  return (
                  <Category
                    key={cat.category_id}
                    id={cat.category_id}
                    title={cat.category_name}
                    description={cleanDesc}
                    image={
                      cat.category_photo
                        ? `storage/${cat.category_photo}`
                        : "/markaz_alkarouz/public/imgs/shopping.webp"
                    }
                    onClick={() =>
                      router.visit(route("show_main_category", cat.category_id))
                    }
                    onEdit={() =>
                      handleEdit({ ...cat, category_description: cleanDesc })
                    }
                    onDelete={() =>
                      handleDelete({ ...cat, category_description: cleanDesc })
                    }
                  />
                );
              }
            }
          })}
        </div>

        {showAddModal && (
          <AddCategoryModal
            onClose={() => setShowAddModal(false)}
            onConfirm={handleAddConfirm}
          />
        )}

        {showEditModal && selectedCategory && (
          <EditCategoryModal
            onClose={() => setShowEditModal(false)}
            category={selectedCategory}
            onConfirm={handleEditConfirm}
          />
        )}

        {showDeleteModal && selectedCategory && (
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

export default MainCategories;