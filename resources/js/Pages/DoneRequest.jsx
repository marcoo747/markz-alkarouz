import React, { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import shopping_image from "../../imgs/shopping.webp";
import { useTranslation } from "react-i18next";

// ================================================================
// MOCK DATA — باك اند هيبدلها بالداتا الحقيقية
// ================================================================
const MOCK_REQUEST = {
    request_id: 84,
    user: { full_name: "أحمد محمد علي" },
    osra: { osra_name: "عيلة الفرح" },
    osra_date: "2026-07-15",
    products: [
        {
            request_product_id: 1,
            pr_name: "طقم كراسي ذهبي",
            image: null,
            quantity_rented: 5,
            quantity_returned: 0,
            shortfall_reason: null,
            logs: [],
        },
        {
            request_product_id: 2,
            pr_name: "طاولة مستديرة بيضاء",
            image: null,
            quantity_rented: 3,
            quantity_returned: 3,
            shortfall_reason: null,
            logs: [
                {
                    id: 1,
                    admin_name: "مدير النظام",
                    classification: null,
                    comment: "كل حاجة رجعت تمام",
                    quantity_returned_at_time: 3,
                    created_at: "2026-06-29 10:30",
                },
            ],
        },
        {
            request_product_id: 3,
            pr_name: "فانوس تزييني كبير",
            image: null,
            quantity_rented: 4,
            quantity_returned: 2,
            shortfall_reason: "missing",
            logs: [
                {
                    id: 1,
                    admin_name: "مدير النظام",
                    classification: "missing",
                    comment: "اتنين منهم مش موجودين",
                    quantity_returned_at_time: 2,
                    created_at: "2026-06-30 14:00",
                },
            ],
        },
        {
            request_product_id: 4,
            pr_name: "غطاء طاولة مطرز",
            image: null,
            quantity_rented: 6,
            quantity_returned: 5,
            shortfall_reason: "damaged",
            logs: [
                {
                    id: 1,
                    admin_name: "مدير النظام",
                    classification: "damaged",
                    comment: "واحد اتمزق من الجنب",
                    quantity_returned_at_time: 5,
                    created_at: "2026-07-01 09:15",
                },
            ],
        },
    ],
};
// ================================================================

const getStatus = (product) => {
    if (product.quantity_returned >= product.quantity_rented) return "returned";
    if (product.shortfall_reason === "missing") return "missing";
    if (product.shortfall_reason === "damaged") return "damaged";
    return "pending";
};

const STATUS_BADGE = {
    returned: "bg-success",
    missing:  "bg-danger",
    damaged:  "bg-warning text-dark",
    pending:  "bg-secondary",
};

const FILTER_KEYS = ["all", "pending", "returned", "missing", "damaged"];

// ================================================================
// MODAL
// ================================================================
const ReconciliationModal = ({ product, onClose, onSave }) => {
    const { t } = useTranslation();

    const isFullyReturned =
        product.quantity_returned >= product.quantity_rented;

    const [classification, setClassification] = useState(
        product.shortfall_reason || ""
    );
    const [comment, setComment] = useState("");
    const [error,   setError]   = useState("");

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
                <div className="modal-content">

                    {/* Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">💬 {product.pr_name}</h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body">

                        {/* Log History */}
                        {product.logs.length > 0 && (
                            <div className="mb-4">
                                <h6 className="text-muted mb-3">
                                    📋 {t("done_request.modal.log_heading")}
                                </h6>
                                <div className="d-flex flex-column gap-2">
                                    {product.logs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="border rounded p-3 bg-light"
                                        >
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="fw-bold small">
                                                    {log.admin_name}
                                                </span>
                                                <span className="text-muted small">
                                                    {log.created_at}
                                                </span>
                                            </div>

                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span className="small text-muted">
                                                    {t("done_request.modal.returned_at")}{" "}
                                                    {log.quantity_returned_at_time} / {product.quantity_rented}
                                                </span>
                                                {log.classification && log.classification !== "recovered" && (
                                                    <span
                                                        className={`badge ${
                                                            log.classification === "missing"
                                                                ? "bg-danger"
                                                                : "bg-warning text-dark"
                                                        }`}
                                                    >
                                                        {t(`done_request.status.${log.classification}`)}
                                                    </span>
                                                )}
                                                {log.classification === "recovered" && (
                                                    <span className="badge bg-success">
                                                        {t("done_request.modal.recovered_badge")}
                                                    </span>
                                                )}
                                            </div>

                                            {log.comment && (
                                                <p className="mb-0 small">{log.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <hr />
                            </div>
                        )}

                        {/* New Entry */}
                        <h6 className="mb-3">
                            ➕ {t("done_request.modal.new_entry_heading")}
                        </h6>

                        {/* Classification */}
                        {!isFullyReturned && (
                            <div className="mb-3">
                                <label className="form-label fw-bold">
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
                                            className="form-check-label text-danger fw-bold"
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
                                            className="form-check-label fw-bold"
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
                            <label className="form-label fw-bold">
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
                            <div className="alert alert-danger py-2">{error}</div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            {t("done_request.modal.cancel")}
                        </button>
                        <button className="btn btn-primary" onClick={handleSave}>
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
    const { requestId } = usePage().props;

    const [products, setProducts] = useState(MOCK_REQUEST.products);
    const [activeFilter, setActiveFilter] = useState("all");
    const [modalProduct, setModalProduct] = useState(null);

    const updateProduct = (id, changes) =>
        setProducts((prev) =>
            prev.map((p) =>
                p.request_product_id === id ? { ...p, ...changes } : p
            )
        );

    const handleCounterChange = (product, delta) => {
        const newQty = Math.max(
            0,
            Math.min(product.quantity_rented, product.quantity_returned + delta)
        );
        updateProduct(product.request_product_id, {
            quantity_returned: newQty,
            shortfall_reason:
                newQty >= product.quantity_rented ? null : product.shortfall_reason,
        });
    };

    const handleRecover = (product) => {
        const newQty = Math.min(
            product.quantity_rented,
            product.quantity_returned + 1
        );
        updateProduct(product.request_product_id, {
            quantity_returned: newQty,
            shortfall_reason:
                newQty >= product.quantity_rented ? null : product.shortfall_reason,
            logs: [
                ...product.logs,
                {
                    id: Date.now(),
                    admin_name: "Admin",
                    classification: "recovered",
                    comment: t("done_request.modal.auto_recover_comment"),
                    quantity_returned_at_time: newQty,
                    created_at: new Date().toLocaleString(),
                },
            ],
        });
    };

    const handleModalSave = (product, { classification, comment }) => {
        updateProduct(product.request_product_id, {
            shortfall_reason: classification,
            logs: [
                ...product.logs,
                {
                    id: Date.now(),
                    admin_name: "Admin",
                    classification,
                    comment,
                    quantity_returned_at_time: product.quantity_returned,
                    created_at: new Date().toLocaleString(),
                },
            ],
        });
    };

    const filteredProducts = products.filter((p) =>
        activeFilter === "all" ? true : getStatus(p) === activeFilter
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
                <div className="mb-4">
                    <h2 className="mb-1">{t("done_request.heading")}</h2>
                    <p className="text-muted mb-0">
                        {MOCK_REQUEST.user.full_name}
                        {MOCK_REQUEST.osra?.osra_name && (
                            <span className="ms-2">— {MOCK_REQUEST.osra.osra_name}</span>
                        )}
                    </p>
                    <small className="text-muted">
                        {t("done_request.request_number")}{" "}
                        {requestId ?? MOCK_REQUEST.request_id}
                    </small>
                </div>

                {/* Filter Tabs */}
                <div className="d-flex gap-2 mb-4 flex-wrap">
                    {FILTER_KEYS.map((key) => {
                        const count =
                            key === "all"
                                ? products.length
                                : products.filter((p) => getStatus(p) === key).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveFilter(key)}
                                className={`btn btn-sm ${
                                    activeFilter === key
                                        ? "btn-dark"
                                        : "btn-outline-secondary"
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
                    <div className="alert alert-info">
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
                                className="card shadow-sm"
                            >
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

                                        {/* Product Info */}
                                        <div className="d-flex align-items-center gap-3">
                                            <img
                                                src={product.image || shopping_image}
                                                alt={product.pr_name}
                                                className="rounded"
                                                style={{
                                                    width: 64,
                                                    height: 64,
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <div>
                                                <h6 className="mb-1">{product.pr_name}</h6>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className={`badge ${STATUS_BADGE[status]}`}>
                                                        {t(`done_request.status.${status}`)}
                                                    </span>
                                                    {remaining > 0 && (
                                                        <span className="text-muted small">
                                                            {t("done_request.remaining")} {remaining}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="d-flex align-items-center gap-3 flex-wrap">

                                            {/* Counter */}
                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() =>
                                                        handleCounterChange(product, -1)
                                                    }
                                                    disabled={product.quantity_returned <= 0}
                                                >
                                                    −
                                                </button>
                                                <span
                                                    className="fw-bold text-center"
                                                    style={{ minWidth: 64 }}
                                                >
                                                    {product.quantity_returned} / {product.quantity_rented}
                                                </span>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() =>
                                                        handleCounterChange(product, 1)
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
                                                className="btn btn-outline-primary btn-sm position-relative"
                                                onClick={() => setModalProduct(product)}
                                                title={t("done_request.comment_btn_title")}
                                            >
                                                💬
                                                {product.logs.length > 0 && (
                                                    <span
                                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
                                                        style={{ fontSize: 10 }}
                                                    >
                                                        {product.logs.length}
                                                    </span>
                                                )}
                                            </button>

                                            {/* Recover Button */}
                                            {(status === "missing" || status === "damaged") && (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleRecover(product)}
                                                >
                                                    {t("done_request.recover_btn")}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default DoneRequest;