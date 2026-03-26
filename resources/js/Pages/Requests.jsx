import React, { useState } from "react";
import { Link, usePage, Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import NavBar from "@/Components/NavBar";
import { useTranslation } from "react-i18next";

const PER_PAGE = 12;

const Requests = () => {
    const { t } = useTranslation();
    const { requests } = usePage().props;

    const [activeFilter, setActiveFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const acceptRequest = (id) => {
        router.post(route("requests.accept", { request: id }));
    };

    const doneRequest = (id) => {
        router.post(route("requests.done", { request: id }));
    };

    const FILTERS = [
        { key: "all", label: t("requests_filter.all") || "All" },
        { key: "pending", label: t("requests_filter.pending") || "Pending" },
        { key: "accepted", label: t("requests_filter.accepted") || "Accepted" },
        { key: "done", label: t("requests_filter.done") || "Done" },
    ];

    const filtered = activeFilter === "all"
        ? requests
        : requests.filter((r) => r.request_status === activeFilter);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const handleFilter = (key) => {
        setActiveFilter(key);
        setCurrentPage(1);
    };

    return (
        <>
            <Head title={t('home.page_title')} />
            <NavBar page_name="requests" />
            <div className="container my-4">
                <h1 className="mb-4">{t('requests.title')}</h1>

                {/* Filter Tabs */}
                <div className="d-flex flex-row flex-wrap justify-content-center gap-2 mb-4">
                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => handleFilter(f.key)}
                            style={{ width: "auto", whiteSpace: "nowrap" }}
                            className={`btn btn-sm rounded-pill px-4 transition ${
                                activeFilter === f.key
                                    ? "btn-dark text-white shadow-sm"
                                    : "btn-outline-secondary"
                            }`}
                        >
                            {f.label}
                            <span className={`ms-2 badge rounded-pill ${activeFilter === f.key ? "bg-white text-dark" : "bg-secondary text-white"}`}>
                                {activeFilter === f.key
                                    ? filtered.length
                                    : (f.key === "all" ? requests.length : requests.filter(r => r.request_status === f.key).length)
                                }
                            </span>
                        </button>
                    ))}
                </div>

                {!paginated.length && (
                    <div className="alert alert-info">{t('requests.no_requests')}</div>
                )}

                <div className="row">
                    {paginated.map((req) => (
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
                                                        req.request_status === "pending"
                                                            ? "text-warning"
                                                            : req.request_status === "accepted"
                                                            ? "text-primary"
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

                                    <div className="d-flex flex-nowrap gap-2 mt-3">
                                        {req.request_status !== "accepted" && (
                                            <button
                                                className="btn btn-warning btn-sm text-dark font-weight-bold flex-grow-1"
                                                onClick={(e) => { e.preventDefault(); acceptRequest(req.request_id); }}
                                            >
                                                {t('requests.accept')}
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-success btn-sm font-weight-bold flex-grow-1"
                                            onClick={(e) => { e.preventDefault(); doneRequest(req.request_id); }}
                                        >
                                            {t('requests.done')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav className="d-flex justify-content-center mt-4">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>&laquo;</button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>&raquo;</button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </>
    );
};

export default Requests;

