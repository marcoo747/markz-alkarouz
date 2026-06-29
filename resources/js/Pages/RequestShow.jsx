import React, { useState, useEffect } from "react";
import { Link, usePage, Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import NavBar from "@/Components/NavBar";
import namer from "color-namer";
import shopping_image from "../../imgs/shopping.webp";
import { useTranslation } from "react-i18next";

const RequestShow = () => {
    const { t } = useTranslation();
    const { request, auth } = usePage().props;
    const user = auth.user;

    const profile_user = user?.user_type === "user";
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!request.created_at) return;
        
        const createdAt = new Date(request.created_at).getTime();
        const endTime = createdAt + 10 * 60 * 1000;

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance <= 0) {
                setTimeLeft("00:00");
            } else {
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                setTimeLeft(
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [request.created_at]);

    const handleShowItem = (item_id) => {
        router.visit(route("items.show", { id: item_id }));
    };

    const acceptRequest = (id) => {
        router.post(route("requests.accept", { request: id }));
    };

    const doneRequest = (id) => {
        router.post(route("requests.done", { request: id }));
    };

    const rejectRequest = (id) => {
        router.post(route("requests.reject", { request: id }));
        setShowRejectModal(false);
    };

    return (
        <>
            {/* Reject Confirmation Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[1050] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-[480px] w-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                        {/* Red header */}
                        <div className="bg-[#dc3545] text-white py-5 px-6">
                            <h5 className="m-0 font-bold text-[1.1rem]">
                                ⚠️ {t('request_show.reject_confirm_title') || 'هل أنت متأكد أنك تريد رفض هذا الطلب؟'}
                            </h5>
                        </div>

                        {/* Order details */}
                        <div className="py-5 px-6 border-b border-[#f0f0f0]">
                            <p className="mb-1">
                                <strong>{t('request_show.status')} </strong>
                                <span className="text-danger">{request.request_status}</span>
                            </p>
                            <p className="mb-1">
                                <strong>{t('request_show.time')} </strong>{request.display_time}
                            </p>
                            {request.osra_date && (
                                <p className="mb-1">
                                    <strong>{t('request_show.date')} </strong>{request.osra_date}
                                </p>
                            )}
                            <p className="mb-0">
                                <strong>{request.user.full_name}</strong>
                                {request.osra?.osra_name && (
                                    <span className="text-muted ms-2">— {request.osra.osra_name}</span>
                                )}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="py-4 px-6 flex gap-3 justify-end">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setShowRejectModal(false)}
                            >
                                {t('request_show.cancel') || 'إلغاء'}
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => rejectRequest(request.request_id)}
                            >
                                {t('request_show.reject') || 'رفض'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Head title={t('home.page_title')} />
            <NavBar page_name="requests" />

            <div className="container my-4">
                <h1 className="mb-4">{t('request_show.title')}</h1>

                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="card-title">
                            <p
                                className="text-decoration-none text-dark text-xl"
                            >
                                {request.user.full_name}
                            </p>
                        </h5>

                        <h6 className="card-subtitle mb-2 text-muted">
                            {request.osra?.osra_name || "—"}
                        </h6>

                        <p className="mb-1">
                            <strong>{t('request_show.status')}{" "}
                            <span
                                className={
                                    request.request_status === "pending"
                                        ? "text-warning"
                                        : request.request_status === "done"
                                        ? "text-success"
                                        : request.request_status === "accepted"
                                        ? "text-primary"
                                        : request.request_status === "rejected"
                                        ? "text-danger"
                                        : "text-secondary"
                                }
                            >
                                {request.request_status}
                            </span>
                            </strong>
                        </p>

                        <p className="mb-1">
                            <strong>{t('request_show.time')}</strong> {request.display_time}
                        </p>

                        {request.osra_date && (
                            <p className="mb-1 text-muted">
                                <strong>{t('request_show.date')}</strong> {request.osra_date}
                            </p>
                        )}

                        {!profile_user && (
                            <>
                            {/* Accept / Done / Reject buttons */}
                            {request.request_status === 'pending' && timeLeft && timeLeft !== '00:00' && (
                                <div className="text-warning fw-bold mb-2">
                                    auto accept : {timeLeft}
                                </div>
                            )}
                            <div className="d-flex flex-nowrap gap-2 mt-3">
                                {request.request_status !== "done" && (
                                    <>
                                        {request.request_status !== "accepted" && (
                                            <button
                                                className="btn btn-warning btn-sm text-dark flex-grow-1"
                                                onClick={() => acceptRequest(request.request_id)}
                                            >
                                                {t('request_show.accept')}
                                            </button>
                                        )}
                                        
                                        {request.request_status !== "rejected" && (
                                            <>
                                                <button
                                                    className="btn btn-success btn-sm flex-grow-1"
                                                    onClick={() => doneRequest(request.request_id)}
                                                >
                                                    {t('request_show.done')}
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm flex-grow-1"
                                                    onClick={() => setShowRejectModal(true)}
                                                >
                                                    {t('request_show.reject') || 'رفض'}
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            </>
                        )}
                    </div>
                </div>

                <h4>{t('request_show.products_heading')}</h4>
                {request.products.length ? (
                    <div className="list-group">
                        {request.products.map((p) => (
                            <div
                                key={p.product_id}
                                onClick={() => handleShowItem(p.product_id)}
                                className="card mb-3 cursor-pointer"
                            >
                                <div className="card-body d-flex align-items-center">
                                    {/* Product image */}
                                    {p.images?.length > 0 ? (
                                        <img
                                            src={p.images[0].url}
                                            alt={p.pr_name}
                                            className="me-3 w-36 h-36 object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={shopping_image}
                                            alt="placeholder"
                                            className="me-3 w-36 h-36 object-cover"
                                        />
                                    )}

                                    {/* Product details */}
                                    <div>
                                        <h6 className="mb-1">{p.pr_name}</h6>
                                        <small className="text-muted">
                                            <strong>{t('request_show.price')}</strong> {p.pr_price}{" "}
                                            <br />
                                            <strong>{t('request_show.brand')}</strong> {p.brand}{" "}
                                            <br />
                                            <strong>{t('request_show.color')}</strong>{" "}
                                            {p.pivot?.color ? (
                                                <span className="d-inline-flex align-items-center">
                                                    <span
                                                        className="inline-block w-4 h-4 rounded-full mr-1.5 border border-[#ccc]"
                                                        style={{
                                                            backgroundColor:
                                                                p.pivot.color
                                                                    .hex_code ||
                                                                p.pivot.color
                                                                    .color,
                                                        }}
                                                    />
                                                    {
                                                        namer(
                                                            p.pivot.color
                                                                .hex_code ||
                                                                p.pivot.color
                                                                    .color
                                                        ).ntc[0].name
                                                    }
                                                </span>
                                            ) : (
                                                "—"
                                            )}
                                            <br />
                                            <strong>{t('request_show.size')}</strong>{" "}
                                            {p.pivot?.size?.size ||
                                                p.pivot?.size_id ||
                                                "—"}{" "}
                                            <br />
                                            <strong>{t('request_show.quantity')}</strong>{" "}
                                            {p.pivot?.quantity}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>{t('request_show.no_products')}</p>
                )}
            </div>
        </>
    );
};

export default RequestShow;
