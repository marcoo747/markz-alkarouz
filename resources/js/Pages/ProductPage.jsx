import React, { useState } from "react";
import { usePage, router, Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import NavBar from "@/Components/NavBar";   
import ItemPack from "@/Components/Item-pack";
import Container from "@/Components/Container";
import ProductDetail from "@/Components/ProductDetail";
import EditItemModal from "@/Components/EditItemModal";
import DeleteItemModal from "@/Components/DeleteItemModal";
import PaginationControls from "@/Components/PaginationControls";
import TopAlert from "@/Components/TopAlert";

const ProductPage = () => {
    const { t } = useTranslation();
    const { product, relatedProducts, pagination } = usePage().props;

    const [showEditItemModal, setShowEditItemModal] = useState(false);
    const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");

    // Delete confirmation handler
    const handleDeleteItem = () => {
        if (!selectedItem) return;

        router.delete(route("items.destroy", selectedItem.product_id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteItemModal(false);
                setSelectedItem(null);
            },
        });
    };

    const { auth } = usePage().props;
    const user = auth.user;
    const manager = user?.user_type === "manager";

    return (
        <>
            <Head title={t("product.page_title")} />
            <NavBar page_name="categories" />
            <TopAlert message={alertMessage} onClose={() => setAlertMessage("")} />

            <Container>
                {manager ? (
                    <div className="flex justify-end gap-3 mb-6 mt-2">
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-300 shadow-sm transition-all active:scale-95"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(product);
                                setShowEditItemModal(true);
                            }}
                        >
                            <i className="bi bi-pencil-square"></i> {t("product.edit_product")}
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 font-semibold rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm transition-all active:scale-95"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(product);
                                setShowDeleteItemModal(true);
                            }}
                        >
                            <i className="bi bi-trash"></i> {t("product.delete_product")}
                        </button>
                    </div>
                ) : null}

                {/* Product Detail */}
                <ProductDetail product={product} />

                {/* Related Items */}
                {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
                    <>
                        <ItemPack
                            category_name={t("product.you_might_also_like")}
                            products={relatedProducts}
                            setAlertMessage={setAlertMessage}
                        />

                        <PaginationControls pagination={pagination} />
                    </>
                )}

                {/* Modals */}
                {showEditItemModal && selectedItem && (
                    <EditItemModal
                        currentItem={selectedItem}
                        onClose={() => {
                            setShowEditItemModal(false);
                            setSelectedItem(null);
                        }}
                    />
                )}

                {showDeleteItemModal && selectedItem && (
                    <DeleteItemModal
                        itemName={selectedItem.pr_name}
                        onClose={() => setShowDeleteItemModal(false)}
                        onConfirm={handleDeleteItem}
                    />
                )}
            </Container>
        </>
    );
};

export default ProductPage;
