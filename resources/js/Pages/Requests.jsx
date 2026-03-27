import React, { useState } from "react";
import { Link, usePage, Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import NavBar from "@/Components/NavBar";
import { useTranslation } from "react-i18next";
import Button from "@/Components/Button";
import "../../css/requests_style.css";

const PER_PAGE = 12;

const Requests = () => {
    const { t } = useTranslation();
    const { requests } = usePage().props;

    const [activeFilter, setActiveFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isDateSearchActive, setIsDateSearchActive] = useState(false);
    const [dateError, setDateError] = useState("");

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

    const parseDateValue = (value) => {
        if (!value) return null;

        let normalized = value.toString().trim();

        // ✅ Handle pure numeric timestamps (Unix)
        if (/^\d+$/.test(normalized)) {
            const num = Number(normalized);
            // If it's in seconds (10 digits), convert to ms
            return num < 1e12 ? new Date(num * 1000) : new Date(num);
        }

        // ✅ Handle dd/mm/yyyy
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(normalized)) {
            const [day, month, year] = normalized.split("/");
            return new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
        }

        // ✅ Handle dd/mm/yyyy hh:mm:ss
        if (/^\d{1,2}\/\d{1,2}\/\d{4} \d{2}:\d{2}(:\d{2})?$/.test(normalized)) {
            const [datePart, timePart] = normalized.split(" ");
            const [day, month, year] = datePart.split("/");
            return new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart}`);
        }

        // ✅ Handle yyyy-mm-dd hh:mm:ss
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(normalized)) {
            return new Date(normalized.replace(" ", "T"));
        }

        // ✅ Fallback: let JS Date try to parse (covers ISO timestamps like 2026-03-27T14:30:00Z)
        const date = new Date(normalized);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    const filtered = requests.filter((r) => {
        const statusMatch = activeFilter === "all" || r.request_status === activeFilter;
        if (!statusMatch) return false;

        if (!isDateSearchActive) return true;

        // ✅ Use created_at or updated_at instead of osra_date
        const rawDate = r.created_at || r.updated_at;
        if (!rawDate) return false;

        const requestDate = parseDateValue(rawDate);
        if (!requestDate) return false;

        if (startDate) {
            const fromDate = parseDateValue(startDate);
            if (!fromDate || requestDate < fromDate) return false;
        }

        if (endDate) {
            const toDate = parseDateValue(endDate);
            if (!toDate) return false;
            toDate.setHours(23, 59, 59, 999);
            if (requestDate > toDate) return false;
        }

        return true;
    });

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const handleFilter = (key) => {
        setActiveFilter(key);
        setCurrentPage(1);
    };

    const applyDateFilter = (e) => {
        e.preventDefault();
        setDateError("");

        if (startDate && endDate) {
            const fromDate = parseDateValue(startDate);
            const toDate = parseDateValue(endDate);
            if (!fromDate || !toDate || fromDate > toDate) {
                setDateError(t('requests.error_date_range') || 'Start date cannot be later than end date');
                setIsDateSearchActive(false);
                return;
            }
        }

        setIsDateSearchActive(true);
        setCurrentPage(1);
    };

    const clearDateFilter = () => {
        setStartDate("");
        setEndDate("");
        setIsDateSearchActive(false);
        setDateError("");
        setCurrentPage(1);
    };

    return (
        <>
            <Head title={t('home.page_title')} />
            <NavBar page_name="requests" />
            <div className="container my-4">
                <div className="p-3 mb-4 requests-top-card">
                    <div className="w-100 d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <h1 className="mb-0">{t('requests.title')}</h1>

                        <form
                            role="search"
                            className="requests-filter-form d-flex align-items-end gap-2 flex-wrap"
                            style={{ maxWidth: 363 }}
                            onSubmit={applyDateFilter}
                        >
                            <div className="d-flex flex-column requests-date-field">
                                <label>{t('requests.start_date') || 'Start Date'}</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="form-control form-control-sm requests-date-input"
                                />
                            </div>

                            <div className="d-flex flex-column requests-date-field">
                                <label>{t('requests.end_date') || 'End Date'}</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="form-control form-control-sm requests-date-input"
                                />
                            </div>

                            <Button type="submit" className="btn btn-sm btn-primary">
                                {t('requests.search') || 'Search'}
                            </Button>

                            <button
                                type="button"
                                onClick={clearDateFilter}
                                className="btn btn-sm btn-outline-secondary"
                            >
                                {t('requests.clear') || 'Clear'}
                            </button>

                            {dateError && (
                                <div className="w-100 mt-2 alert alert-danger py-1 px-2">
                                    {dateError}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

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
                                        {req.osra_date && (
                                            <p className="mb-1 text-muted small">
                                                <strong>{t('requests.date')}</strong> {req.osra_date}
                                            </p>
                                        )}
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

                                    <div className="d-flex gap-2 mt-3">
                                        {req.request_status === "pending" && (
                                            <button
                                                className="btn btn-warning btn-sm text-dark font-weight-bold"
                                                onClick={(e) => { e.preventDefault(); acceptRequest(req.request_id); }}
                                            >
                                                {t('requests.accept')}
                                            </button>
                                        )}
                                        {req.request_status !== "done" && (
                                            <button
                                                className="btn btn-success btn-sm font-weight-bold"
                                                onClick={(e) => { e.preventDefault(); doneRequest(req.request_id); }}
                                            >
                                                {t('requests.done')}
                                            </button>
                                        )}
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

