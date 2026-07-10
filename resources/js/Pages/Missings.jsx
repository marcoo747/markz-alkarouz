import React, { useState } from "react";
import { usePage, Head, router } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import shopping_image from "../../imgs/shopping.webp";
import { useTranslation } from "react-i18next";

const MissingItemCard = ({ item, onReturn }) => {
    const { t } = useTranslation();
    const [returnQty, setReturnQty] = useState(item.quantity);

    const handleIncrement = () => {
        setReturnQty((prev) => Math.min(item.quantity, prev + 1));
    };

    const handleDecrement = () => {
        setReturnQty((prev) => Math.max(1, prev - 1));
    };

    const handleReturnClick = () => {
        onReturn(item.missings_id, returnQty);
    };

    const imageSrc = item.product?.images && item.product.images.length > 0 
        ? item.product.images[0].url 
        : null;

    return (
        <div className="card border-0 shadow-sm rounded-xl overflow-hidden hover-shadow transition-all duration-300 bg-white mb-3">
            <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                    {/* Product & User Details */}
                    <div className="d-flex align-items-start gap-3 flex-grow-1">
                        <img
                            src={imageSrc || shopping_image}
                            alt={item.product?.pr_name || "Product"}
                            className="rounded-lg shadow-sm"
                            style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                            }}
                        />
                        <div className="d-flex flex-column gap-1">
                            <h5 className="fw-bold text-dark mb-1">
                                {item.product?.pr_name || t("missings.product")}
                            </h5>

                            <div className="d-flex flex-wrap gap-2 text-muted small">
                                {item.user && (
                                    <span className="bg-light px-2.5 py-1 rounded border">
                                        👤 {t("missings.user")}: <strong>{item.user.full_name}</strong>
                                    </span>
                                )}
                                {item.osra && (
                                    <span className="bg-light px-2.5 py-1 rounded border">
                                        🏠 {t("missings.family")}: <strong>{item.osra.osra_name}</strong>
                                    </span>
                                )}
                                <span className="bg-light px-2.5 py-1 rounded border">
                                    🆔 {t("missings.request")}: <strong>#{item.request_id}</strong>
                                </span>
                            </div>

                            {item.comment && (
                                <div className="text-secondary small mt-2 p-2 bg-light rounded border-start border-primary border-3">
                                    💬 <em>{item.comment}</em>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Return Action & Quantities */}
                    <div className="d-flex align-items-center gap-4 flex-wrap justify-content-end">
                        {/* Quantities Display */}
                        <div className="text-center text-md-end">
                            <span className="text-muted small d-block">{t("missings.missing_qty")}</span>
                            <span className="fs-4 fw-black text-danger">{item.quantity}</span>
                        </div>

                        {/* Return Qty Counter */}
                        <div className="d-flex flex-column align-items-center gap-1">
                            <span className="text-muted small">{t("missings.qty_to_return")}</span>
                            <div className="d-flex align-items-center gap-2 bg-light p-1 rounded-pill border">
                                <button
                                    className="btn btn-sm btn-white rounded-circle shadow-sm"
                                    style={{ width: 28, height: 28, padding: 0 }}
                                    onClick={handleDecrement}
                                    disabled={returnQty <= 1}
                                >
                                    −
                                </button>
                                <span className="fw-bold px-2 text-dark" style={{ minWidth: 40, textAlign: "center" }}>
                                    {returnQty}
                                </span>
                                <button
                                    className="btn btn-sm btn-white rounded-circle shadow-sm"
                                    style={{ width: 28, height: 28, padding: 0 }}
                                    onClick={handleIncrement}
                                    disabled={returnQty >= item.quantity}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleReturnClick}
                            className="btn btn-primary px-4 py-2 rounded-pill shadow-sm hover-scale transition fw-bold"
                        >
                            ↩ {t("missings.return_btn")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Missings = () => {
    const { t } = useTranslation();
    const { missings } = usePage().props;

    const handleReturn = (missingsId, qtyToReturn) => {
        router.post(route("missings.return", { missing: missingsId }), {
            quantity_to_return: qtyToReturn,
        });
    };

    return (
        <>
            <Head title={t("missings.page_title") || "المفقودات"} />
            <NavBar page_name="missings" />

            <div className="container my-4" dir="rtl">
                {/* Header */}
                <div className="mb-4 p-4 rounded-xl bg-white shadow-sm border border-light animate-fade-in d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="mb-1 fw-bold text-dark">{t("missings.heading") || "المفقودات"}</h2>
                        <p className="text-secondary mb-0 small">
                            {t("users.subtitle") || "إدارة المفقودات واسترداد المنتجات المستعارة"}
                        </p>
                    </div>
                    <span className="badge bg-danger fs-6 px-3 py-2 rounded-pill">
                        {t("missings.missing_qty") || "إجمالي المفقودات"}: {missings.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                </div>

                {/* Empty State */}
                {missings.length === 0 ? (
                    <div className="alert alert-success border-0 rounded-xl p-5 text-center shadow-sm">
                        <span className="fs-1 d-block mb-3">🎉</span>
                        <h4 className="fw-bold">{t("missings.no_missings") || "لا توجد مفقودات حالياً"}</h4>
                        <p className="text-muted mb-0">جميع المواد والمنتجات المستعارة تم إرجاعها بنجاح.</p>
                    </div>
                ) : (
                    /* Missing Items List */
                    <div className="d-flex flex-column gap-1">
                        {missings.map((item) => (
                            <MissingItemCard
                                key={item.missings_id}
                                item={item}
                                onReturn={handleReturn}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Missings;
