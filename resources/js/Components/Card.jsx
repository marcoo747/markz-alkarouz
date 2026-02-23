import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import namer from "color-namer";

const ProductCard = ({
    id,
    title,
    brand,
    description,
    image,
    price,
    color_id,
    color,
    size_id,
    size,
    setAlertMessage,
}) => {
    const { auth } = usePage().props;
    const user = auth.user;
    const { cartItems = [] } = usePage().props || {};
    const [inCart, setInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (cartItems.includes(id)) setInCart(true);
    }, [cartItems, id]);

    const handleOpen = () => {
        router.get(route("items.show", id));
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();

        router.post(
            route("cart.add"),
            {
                product_id: id,
                color_id: color_id || null,
                size_id: size_id || null,
                quantity: quantity,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setInCart(true);
                    setAlertMessage(`"${title}" added to cart!`);
                    setTimeout(() => setAlertMessage(""), 3000);
                },
            }
        );
    };

    return (
        <>
            <article
                className={`card product-card ${inCart ? "cursor-default" : "cursor-pointer"}`}
            >
                {image && (
                    <img
                        src={image}
                        alt={title}
                        className="product-image"
                        onClick={handleOpen}
                    />
                )}
                <div className="card-body">
                    <div onClick={handleOpen}>
                        <h3>{title}</h3>
                        <h6>{brand}</h6>
                        <p>{description}</p>
                        <p className="text-success">EGP {price}</p>
                        {color && (
                            <p className="d-flex align-items-center">
                                {" "}
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        backgroundColor: color,
                                        marginLeft: 8,
                                        border: "1px solid #ccc",
                                    }}
                                ></span>{" "}
                                <span className="ms-2">
                                    {" "}
                                    {namer(color).basic[0].name}{" "}
                                </span>{" "}
                                , etc...
                            </p>
                        )}
                        {size && <p>Size: {size}</p>}
                    </div>

                    {/* Add to Cart / Already in Cart */}
                    {user &&
                        (!inCart ? (
                            <>
                                <div className="mb-2">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(Number(e.target.value))
                                        }
                                        className="form-control"
                                    />
                                </div>
                                <button
                                    className="btn btn-success w-100"
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </button>
                            </>
                        ) : (
                            <div className="alert alert-info mt-2 text-center cursor-text">
                                Already in cart
                            </div>
                        ))}
                </div>
            </article>
        </>
    );
};

export default ProductCard;
