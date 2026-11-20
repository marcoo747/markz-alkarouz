import React from "react";
import { usePage, router } from "@inertiajs/react";

const CategoryCard = ({ id, title, description, image, onEdit, onDelete, onClick }) => {
  const { auth } = usePage().props;
  const user = auth.user;
  const manager = user?.user_type === "manager";
  const handleClick = () => {
    if (onClick) return onClick();
    router.visit(route("categories.show", id));
  };

  return (
    <div
      className="h-full flex flex-col rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      tabIndex={0}
      role="link"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="w-full aspect-[4/3] overflow-hidden bg-slate-50 border-b border-slate-100">
        <img
          src={image}
          className="w-full h-full object-cover"
          alt={title}
          onClick={handleClick}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/imgs/shopping.webp";
          }}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col text-center">
        <div onClick={handleClick} className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold mb-1.5 text-slate-900 line-clamp-1">{title}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-0">{description}</p>
        </div>
        {manager ? (
          <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2 justify-center">
            <button
              type="button"
              className="btn btn-primary btn-sm flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CategoryCard;
