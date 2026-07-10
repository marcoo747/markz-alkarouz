import React, { useState } from "react";
import { usePage, Head, router } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import shopping_image from "../../imgs/shopping.webp";
import { useTranslation } from "react-i18next";

const getStatus = (product) => {
    if (product.quantity_returned >= product.quantity_rented) return "returned";
    if (product.shortfall_reason === "missing") return "missing";
    if (product.shortfall_reason === "damaged") return "damaged";
    return "pending";
};

const STATUS_BADGE = {
    returned: "bg-success",
    missing: "bg-danger",
    damaged: "bg-warning text-dark",
    pending: "bg-secondary",
};

const FILTER_KEYS = ["all", "pending", "returned", "missing", "damaged"];

// ================================================================
// RECONCILIATION MODAL
// ================================================================
const ReconciliationModal = ({ product, onClose, onSave }) => {
    const { t } = useTranslation();

    const isFullyReturned =
        product.quantity_returned >= product.quantity_rented;

    const [classification, setClassification] = useState(
        product.shortfall_reason || "missing",
    );
    const [comment, setComment] = useState(product.comment || "");
    const [error, setError] = useState("");

    const handleSave = () => {
        if (!isFullyReturned && !classification) {
            setError(t("done_request.modal.error_no_classification"));
            return;
        }
        if (!isFullyReturned && !comment.trim()) {
            setError(t("done_request.modal.error_no_comment"));
            return;
        }
        onSave({
            classification: isFullyReturned ? null : classification,
            comment: comment.trim(),
        });
        onClose();
    };

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                <div className="modal-content border-0 shadow-lg rounded-xl overflow-hidden">
                    {/* Header */}
                    <div className="modal-header bg-light border-bottom">
                        <h5 className="modal-title fw-bold">💬 {product.pr_name}</h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body p-4">
                        {/* Saved Comment / Delete Button */}
                        {product.comment && (
                            <div className="border border-danger-subtle rounded-3 p-3 bg-danger-subtle/10 mb-4 d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-bold small d-block text-danger mb-1">
                                        ⚠️ {t("missings.comment") || "الملاحظات"}:
                                    </span>
                                    <p className="mb-0 small text-dark">{product.comment}</p>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm hover-scale"
                                    onClick={() => {
                                        setComment("");
                                        setClassification("");
                                        onSave({ classification: null, comment: "" });
                                        onClose();
                                    }}
                                >
                                    🗑️ {t("terms.delete_button") || "حذف"}
                                </button>
                            </div>
                        )}

                        {/* New Entry */}
                        <h6 className="fw-bold mb-3 text-secondary">
                            ➕ {t("done_request.modal.new_entry_heading")}
                        </h6>

                        {/* Classification */}
                        {!isFullyReturned && (
                            <div className="mb-4">
                                <label className="form-label fw-bold small text-muted">
                                    {t("done_request.modal.classification_label")}{" "}
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="d-flex gap-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="cls_missing"
                                            name="classification"
                                            value="missing"
                                            checked={classification === "missing"}
                                            onChange={(e) => {
                                                setClassification(e.target.value);
                                                setError("");
                                            }}
                                        />
                                        <label
                                            className="form-check-label text-danger fw-bold cursor-pointer"
                                            htmlFor="cls_missing"
                                        >
                                            {t("done_request.modal.missing_option")}
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="cls_damaged"
                                            name="classification"
                                            value="damaged"
                                            checked={classification === "damaged"}
                                            onChange={(e) => {
                                                setClassification(e.target.value);
                                                setError("");
                                            }}
                                        />
                                        <label
                                            className="form-check-label fw-bold cursor-pointer"
                                            style={{ color: "#b8860b" }}
                                            htmlFor="cls_damaged"
                                        >
                                            {t("done_request.modal.damaged_option")}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Comment */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-muted">
                                {t("done_request.modal.comment_label")}{" "}
                                {!isFullyReturned ? (
                                    <span className="text-danger">*</span>
                                ) : (
                                    <span className="text-muted fw-normal">
                                        {t("done_request.modal.comment_optional")}
                                    </span>
                                )}
                            </label>
                            <textarea
                                className="form-control"
                                rows={3}
                                placeholder={t("done_request.modal.comment_placeholder")}
                                value={comment}
                                onChange={(e) => {
                                    setComment(e.target.value);
                                    setError("");
                                }}
                            />
                        </div>

                        {error && (
                            <div className="alert alert-danger py-2 border-0 small">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer bg-light border-top">
                        <button className="btn btn-secondary btn-sm px-3 rounded-pill" onClick={onClose}>
                            {t("done_request.modal.cancel")}
                        </button>
                        <button
                            className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm"
                            onClick={handleSave}
                        >
                            {t("done_request.modal.save")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ================================================================
// MAIN PAGE
// ================================================================
const DoneRequest = () => {
    const { t } = useTranslation();
    const { requestDetails } = usePage().props;

    if (!requestDetails) {
        return (
            <>
                <NavBar page_name="requests" />
                <div className="container my-5 text-center">
                    <div className="alert alert-warning">No request details found.</div>
                </div>
            </>
        );
    }

    // Initialize products from db request
    const initialProducts = (requestDetails.products || []).map((product) => {
        const quantity_rented = product.pivot?.quantity || 0;
        const quantity_returned = product.pivot?.checked_qnty || 0;
        const comment = product.pivot?.comment || "";
        const color_name = product.pivot?.color?.color || null;
        const size_name = product.pivot?.size?.size || null;

        // If returned is less than rented, default shortfall reason is "missing"
        const shortfall_reason = quantity_returned < quantity_rented ? "missing" : null;

        return {
            request_product_id: product.pivot?.request_product_id || product.product_id,
            product_id: product.product_id,
            pr_name: product.pr_name,
            color_name,
            size_name,
            image: product.images && product.images.length > 0 ? product.images[0].url : null,
            quantity_rented,
            quantity_returned,
            shortfall_reason,
            comment,
        };
    });

    const [products, setProducts] = useState(initialProducts);
    const [activeFilter, setActiveFilter] = useState("all");
    const [modalProduct, setModalProduct] = useState(null);

    const updateProduct = (id, changes) =>
        setProducts((prev) =>
            prev.map((p) =>
                p.request_product_id === id ? { ...p, ...changes } : p,
            ),
        );

    const handleCounterChange = (product, delta) => {
        const newQty = Math.max(
            0,
            Math.min(
                product.quantity_rented,
                product.quantity_returned + delta,
            ),
        );
        updateProduct(product.request_product_id, {
            quantity_returned: newQty,
            shortfall_reason:
                newQty >= product.quantity_rented
                    ? null
                    : product.shortfall_reason || "missing",
        });
    };

    const handleModalSave = (product, { classification, comment }) => {
        updateProduct(product.request_product_id, {
            shortfall_reason: classification,
            comment: comment,
        });
    };

    const handleDoneSubmit = () => {
        router.post(route("requests.done", { request: requestDetails.request_id }), {
            products: products.map((p) => ({
                request_product_id: p.request_product_id,
                product_id: p.product_id,
                checked_qnty: p.quantity_returned,
                comment: p.comment || null,
                shortfall_reason: p.shortfall_reason || null,
            })),
        });
    };

    const filteredProducts = products.filter((p) =>
        activeFilter === "all" ? true : getStatus(p) === activeFilter,
    );

    return (
        <>
            <Head title={t("done_request.page_title")} />
            <NavBar page_name="requests" />

            {modalProduct && (
                <ReconciliationModal
                    product={modalProduct}
                    onClose={() => setModalProduct(null)}
                    onSave={(data) => {
                        handleModalSave(modalProduct, data);
                        setModalProduct(null);
                    }}
                />
            )}

            <div className="container my-4" dir="rtl">
                {/* Header */}
                <div className="mb-4 p-4 rounded-xl bg-white shadow-sm border border-light animate-fade-in">
                    <h2 className="mb-2 fw-bold text-dark">{t("done_request.heading")}</h2>
                    <p className="text-secondary mb-1">
                        👤 {requestDetails.user?.full_name}
                        {requestDetails.osra?.osra_name && (
                            <span className="ms-2">
                                — 🏠 {requestDetails.osra.osra_name}
                            </span>
                        )}
                    </p>
                    <small className="text-muted">
                        🆔 {t("done_request.request_number")}{" "}
                        <strong className="text-dark">{requestDetails.request_id}</strong>
                    </small>
                </div>

                {/* Filter Tabs */}
                <div className="d-flex gap-2 mb-4 flex-wrap">
                    {FILTER_KEYS.map((key) => {
                        const count =
                            key === "all"
                                ? products.length
                                : products.filter((p) => getStatus(p) === key)
                                      .length;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveFilter(key)}
                                className={`btn btn-sm px-4 rounded-pill transition shadow-sm ${
                                    activeFilter === key
                                        ? "btn-dark text-white"
                                        : "btn-outline-secondary bg-white text-secondary"
                                }`}
                            >
                                {t(`done_request.filters.${key}`)}
                                <span
                                    className={`ms-2 badge rounded-pill ${
                                        activeFilter === key
                                            ? "bg-white text-dark"
                                            : "bg-secondary text-white"
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="alert alert-info border-0 rounded-xl p-4 text-center shadow-sm">
                        {t("done_request.no_products")}
                    </div>
                )}

                {/* Product Cards */}
                <div className="d-flex flex-column gap-3">
                    {filteredProducts.map((product) => {
                        const status = getStatus(product);
                        const remaining =
                            product.quantity_rented - product.quantity_returned;

                        return (
                            <div
                                key={product.request_product_id}
                                className="card border-0 shadow-sm rounded-xl hover-shadow transition overflow-hidden"
                            >
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                        {/* Product Info */}
                                        <div className="d-flex align-items-center gap-3">
                                            <img
                                                src={
                                                    product.image ||
                                                    shopping_image
                                                }
                                                alt={product.pr_name}
                                                className="rounded-lg shadow-sm"
                                                style={{
                                                    width: 72,
                                                    height: 72,
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <div>
                                                <h6 className="mb-1 fw-bold text-dark">
                                                    {product.pr_name}
                                                </h6>
                                                
                                                {(product.color_name || product.size_name) && (
                                                    <div className="d-flex flex-wrap gap-2 mb-1">
                                                        {product.color_name && (
                                                            <span className="badge bg-light text-secondary border">
                                                                🎨 {product.color_name}
                                                            </span>
                                                        )}
                                                        {product.size_name && (
                                                            <span className="badge bg-light text-secondary border">
                                                                📏 {product.size_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="d-flex align-items-center gap-2">
                                                    <span
                                                        className={`badge ${STATUS_BADGE[status]}`}
                                                    >
                                                        {t(
                                                            `done_request.status.${status}`,
                                                        )}
                                                    </span>
                                                    {remaining > 0 && (
                                                        <span className="text-danger small fw-bold">
                                                            {t(
                                                                "done_request.remaining",
                                                            )}{" "}
                                                            {remaining}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                            {/* Counter */}
                                            <div className="d-flex align-items-center gap-2 bg-light p-1 rounded-pill border">
                                                <button
                                                    className="btn btn-sm btn-white rounded-circle shadow-sm"
                                                    style={{ width: 28, height: 28, padding: 0 }}
                                                    onClick={() =>
                                                        handleCounterChange(
                                                            product,
                                                            -1,
                                                        )
                                                    }
                                                    disabled={
                                                        product.quantity_returned <=
                                                        0
                                                    }
                                                >
                                                    −
                                                </button>
                                                <span
                                                    className="fw-bold text-center text-dark"
                                                    style={{ minWidth: 50 }}
                                                >
                                                    {product.quantity_returned}{" "}
                                                    / {product.quantity_rented}
                                                </span>
                                                <button
                                                    className="btn btn-sm btn-white rounded-circle shadow-sm"
                                                    style={{ width: 28, height: 28, padding: 0 }}
                                                    onClick={() =>
                                                        handleCounterChange(
                                                            product,
                                                            1,
                                                        )
                                                    }
                                                    disabled={
                                                        product.quantity_returned >=
                                                        product.quantity_rented
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Comment Icon */}
                                            <button
                                                className={`btn btn-sm rounded-circle p-2 position-relative hover-scale transition ${
                                                    product.comment
                                                        ? "btn-primary"
                                                        : "btn-outline-primary"
                                                }`}
                                                style={{ width: 38, height: 38 }}
                                                onClick={() =>
                                                    setModalProduct(product)
                                                }
                                                title={t(
                                                    "done_request.comment_btn_title",
                                                )}
                                            >
                                                💬
                                                {product.comment && (
                                                    <span
                                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                                        style={{ fontSize: 9 }}
                                                    >
                                                        ✓
                                                    </span>
                                                )}
                                            </button>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Done Button */}
                <div className="d-flex justify-content-end mt-4">
                    <button
                        className="btn btn-success px-5 py-2.5 rounded-pill shadow-md hover-scale transition fw-bold"
                        onClick={handleDoneSubmit}
                    >
                        {t("done_request.done_btn")}
                    </button>
                </div>
            </div>
        </>
    );
};

export default DoneRequest;
