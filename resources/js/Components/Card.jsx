import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import namer from "color-namer";
import { useTranslation } from "react-i18next";

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
    inventory_quantity,
    setAlertMessage,
}) => {
    const { t } = useTranslation();
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
    
    // Determine stock limit or default to 5 if undefined. If 0, out of stock.
    const stockLimit = inventory_quantity !== undefined ? inventory_quantity : 5;
    const isOutOfStock = stockLimit == 0 || stockLimit == null || stockLimit == "";
    return (
        <>
            <article
                className={`flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${inCart ? "cursor-default" : "cursor-pointer"}`}
                onClick={handleOpen}
            >
                {image && !image.includes('shopping.webp') ? (
                    <div className="w-full h-48 sm:h-56 overflow-hidden bg-white relative p-4 border-b border-gray-100 flex items-center justify-center">
                        <img
                            src={image.startsWith('http') || image.startsWith('/') ? image : `/${image}`}
                            alt={title}
                            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>
                ) : (
                    <div className="w-full h-48 sm:h-56 bg-gray-50 flex flex-col items-center justify-center text-gray-300 border-b border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">No Image</span>
                    </div>
                )}
                <div className="p-4 flex flex-col flex-grow gap-3">
                    <div className="flex flex-col gap-1">
                        {brand && <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">{brand}</span>}
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">{title}</h3>
                        {description && <p className="text-sm text-gray-500 line-clamp-2">{description}</p>}
                    </div>
                    
                    <div className="mt-auto flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-extrabold text-green-600">EGP {price}</span>
                            
                            <div className="flex items-center gap-2">
                            {color && (
                                <span
                                    className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                    style={{ backgroundColor: color }}
                                    title={namer(color)?.basic?.[0]?.name || color}
                                ></span>
                            )}
                            {size && <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{size}</span>}
                            </div>
                        </div>

                        {/* Add to Cart / Already in Cart */}
                        {user && (
                            <div className="pt-3 border-t border-gray-100 z-10 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                                {!inCart ? (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-700">Quantity</span>
                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-8">
                                                <button 
                                                    className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors active:scale-95 disabled:opacity-50 rounded-l-lg"
                                                    onClick={(e) => { e.stopPropagation(); setQuantity(prev => Math.max(1, prev - 1)); }}
                                                    disabled={quantity <= 1}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-gray-900">{isOutOfStock ? 0 : quantity}</span>
                                                <button 
                                                    className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors active:scale-95 rounded-r-lg"
                                                    onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
                                                    disabled={quantity >= stockLimit}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold h-10 rounded-lg transition-all duration-200 active:scale-95 shadow-md flex justify-center items-center"
                                            onClick={handleAddToCart}
                                            disabled={isOutOfStock}
                                        >
                                            {t('cart.add_to_cart')}
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-10 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100 flex justify-center items-center gap-1 cursor-default transition-all shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        {t('cart.in_cart')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </>
    );
};

export default ProductCard;
