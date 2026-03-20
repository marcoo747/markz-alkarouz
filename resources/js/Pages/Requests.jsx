import React from "react";
import { Link, usePage, Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import NavBar from "@/Components/NavBar";
import { useTranslation } from "react-i18next";

const Requests = () => {
    const { t } = useTranslation();
    const { requests } = usePage().props;

    const acceptRequest = (id) => {
        router.post(route("requests.accept", { request: id }));
    };

    const doneRequest = (id) => {
        router.post(route("requests.done", { request: id }));
    };

    return (
        <>
            <Head title={t('home.page_title')} />
            <NavBar page_name="requests" />
            <div className="container my-4">
                <h1 className="mb-4">{t('requests.title')}</h1>

                {!requests.length && (
                    <div className="alert alert-info">{t('requests.no_requests')}</div>
                )}

                <div className="row">
                    {requests.map((req) => (
                        <div key={req.request_id} className="col-6 col-md-4 col-lg-3 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <Link href={route("requests.show", {request: req.request_id})} className="text-decoration-none">
                                        <h5 className="card-title text-dark">
                                            {req.user.full_name}
                                        </h5>
                                        <h6 className="card-subtitle mb-2 text-muted">
                                            {req.osra?.osra_name || "—"}
                                        </h6>
                                        <p className="mb-1">
                                            <strong>
                                                {t('requests.status')}{" "}
                                                <span
                                                    className={
                                                        req.request_status ==
                                                        "pending"
                                                            ? "text-warning"
                                                            : "text-success"
                                                    }
                                                >
                                                    {req.request_status}
                                                </span>
                                            </strong>
                                        </p>

                                        {(req.total_price !== null && req.total_price !== undefined && req.total_price != 0) && (
                                            <p className="mb-1">
                                                <strong>{t('requests.price')}</strong> {req.total_price}
                                            </p>
                                        )}

                                        <p className="mb-1">
                                            <strong>{t('requests.time')}</strong>{" "}
                                            {req.display_time}
                                        </p>

                                        <p className="mb-2">
                                            {" "}
                                            <strong>
                                                {req.products.length}
                                            </strong>{" "}
                                            {req.products.length === 1
                                                ? t('requests.product')
                                                : t('requests.products')}{" "}
                                        </p>
                                    </Link>

                                    <div className="d-flex gap-2">
                                        {req.request_status !== "accepted" && (
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => acceptRequest(req.request_id)}
                                            >
                                                {t('requests.accept')}
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => doneRequest(req.request_id)}
                                        >
                                            {t('requests.done')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Requests;
