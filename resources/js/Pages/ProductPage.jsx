import React, { useState } from "react";
import { usePage, router, Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import NavBar from "@/Components/NavBar";
import ItemPack from "@/Components/Item-pack";
import Container from "@/Components/Container";
import ProductDetail from "@/Components/ProductDetail";
import EditItemModal from "@/Components/EditItemModal";
import DeleteItemModal from "@/Components/DeleteItemModal";
import ShareModal from "@/Components/shareModal";

const ProductPage = () => {
    const { t } = useTranslation();
    const { product, relatedProducts } = usePage().props;

    const [showEditItemModal, setShowEditItemModal] = useState(false);
    const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleEditItem = (itemData) => {
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
            },
        );
    };

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
            <Head title={t('product.page_title')} />
            <NavBar page_name="categories" />

            <Container>
                {manager ? (
                    <>
                        {/* Action Buttons */}
                        <div className="flex gap-2 mb-4 mt-4">
                            <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(product);
                                    setShowEditItemModal(true);
                                }}
                            >
                                {t('product.edit_product')}
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(product);
                                    setShowDeleteItemModal(true);
                                }}
                            >
                                {t('product.delete_product')}
                            </button>
                        </div>
                    </>
                ) : null}

                {/* Product Detail */}
                <ProductDetail product={product} />

                {/* Related Items */}
                <ItemPack
                    category_name={t('product.you_might_also_like')}
                    products={relatedProducts}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                />

                {/* Modals */}
                {showEditItemModal && selectedItem && (
                    <EditItemModal
                        currentItem={selectedItem}
                        onClose={() => setShowEditItemModal(false)}
                        onConfirm={handleEditItem}
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
