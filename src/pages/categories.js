import React from "react";
import NavBar from "../Components/NavBar";
import Category from "../Components/category";
import "../styles/categories.css";

const categoryData = [
  {
    title: "Speakers",
    description: "Explore our latest audio systems and portable speakers.",
    image: "/imgs/shopping.webp",
  },
  {
    title: "Clothing",
    description: "Trendy outfits and accessories for all seasons.",
    image: "/imgs/shopping.webp",
  },
  {
    title: "Electronics",
    description: "Smart gadgets and tech essentials.",
    image: "/imgs/shopping.webp",
  },
    {
    title: "Electronics",
    description: "Smart gadgets and tech essentials.",
    image: "/imgs/shopping.webp",
  },
    {
    title: "Electronics",
    description: "Smart gadgets and tech essentials.",
    image: "/imgs/shopping.webp",
  },
    {
    title: "Electronics",
    description: "Smart gadgets and tech essentials.",
    image: "/imgs/shopping.webp",
  },
    {
    title: "Electronics",
    description: "Smart gadgets and tech essentials.",
    image: "/imgs/shopping.webp",
  },
  // أضف باقي الفئات هنا
];

const Categories = () => {
  return (
    <div>
      <NavBar />
      <div className="grid">
        {categoryData.map((cat, index) => (
          <Category
            key={index}
            title={cat.title}
            description={cat.description}
            image={cat.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Categories;
