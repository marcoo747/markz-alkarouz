import React from "react";
import { usePage, router } from "@inertiajs/react";

const CategoryCard = ({ id, title, description, image, onEdit, onDelete }) => {
  const { auth } = usePage().props;
  const user = auth.user;
  const manager = user?.user_type === "manager";
  const handleClick = () => {
    router.visit(route("categories.show", id));
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow hover:scale-105 bg-white cursor-pointer">
      <img
        src={image}
        className="w-full object-cover aspect-[4/3] max-h-32 sm:max-h-none"
        alt={title}
        onClick={handleClick}
      />
      <div className="p-4 sm:p-3 text-center">
        <div onClick={handleClick}>
          <h5 className="text-lg sm:text-base font-bold mb-2 text-gray-800">{title}</h5>
          <p className="text-sm sm:text-xs text-gray-600">{description}</p>
        </div>
        {manager ? (
          <div className="mt-2.5 flex gap-1 justify-center">
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
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
