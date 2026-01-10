import React from "react";
import { Link, usePage, Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import NavBar from "@/Components/NavBar";
import namer from "color-namer";
import shopping_image from "../../imgs/shopping.webp";

const RequestShow = () => {
    const { request } = usePage().props;

    const handleShowItem = (item_id) => {
        router.visit(route("items.show", { id: item_id }));
    };

    const acceptRequest = (id) => {
        router.post(route("requests.accept", { request: id }));
    };

    const doneRequest = (id) => {
        router.post(route("requests.done", { request: id }));
    };

    return (
        <>
            <Head title="مركز وسائل الإيضاح" />
            <NavBar page_name="requests" />

            <div className="container my-4">
                <h1 className="mb-4">Request Page</h1>

                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="card-title">
                            <p
                                className="text-decoration-none text-dark"
                                style={{ fontSize: "20px" }}
                            >
                                {request.user.full_name}
                            </p>
                        </h5>

                        <h6 className="card-subtitle mb-2 text-muted">
                            {request.osra?.osra_name || "—"}
                        </h6>

                        <p className="mb-1">
                            <strong>Status:{" "}
                            <span
                                className={
                                    request.request_status === "pending"
                                        ? "text-warning"
                                        : request.request_status === "done"
                                        ? "text-danger"
                                        : request.request_status === "accepted"
                                        ? "text-success"
                                        : "text-secondary"
                                }
                            >
                                {request.request_status}
                            </span>
                            </strong>
                        </p>

                        <p className="mb-1">
                            <strong>Time:</strong> {request.display_time}
                        </p>

                        {/* Accept / Done buttons */}
                        <div className="d-flex gap-2 mt-3">
                            {request.request_status !== "done" && (
                                <>
                                    {request.request_status !== "accepted" && (
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => acceptRequest(request.request_id)}
                                        >
                                            Accept
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => doneRequest(request.request_id)}
                                    >
                                        Done
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <h4>Products</h4>
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
                                            className="me-3"
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={shopping_image}
                                            alt="placeholder"
                                            className="me-3"
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}

                                    {/* Product details */}
                                    <div>
                                        <h6 className="mb-1">{p.pr_name}</h6>
                                        <small className="text-muted">
                                            <strong>Price:</strong> {p.pr_price}{" "}
                                            <br />
                                            <strong>Brand:</strong> {p.brand}{" "}
                                            <br />
                                            <strong>Color:</strong>{" "}
                                            {p.pivot?.color ? (
                                                <span className="d-inline-flex align-items-center">
                                                    <span
                                                        style={{
                                                            display:
                                                                "inline-block",
                                                            width: "16px",
                                                            height: "16px",
                                                            borderRadius: "50%",
                                                            backgroundColor:
                                                                p.pivot.color
                                                                    .hex_code ||
                                                                p.pivot.color
                                                                    .color,
                                                            marginRight: "6px",
                                                            border: "1px solid #ccc",
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
                                            <strong>Size:</strong>{" "}
                                            {p.pivot?.size?.size ||
                                                p.pivot?.size_id ||
                                                "—"}{" "}
                                            <br />
                                            <strong>Quantity:</strong>{" "}
                                            {p.pivot?.quantity}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No products</p>
                )}
            </div>
        </>
    );
};

export default RequestShow;
