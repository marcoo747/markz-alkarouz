import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "./card";

const Category = ({ title, description, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${title.toLowerCase()}`);
  };

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <Card image={image} title={title} description={description} />
    </div>
  );
};

export default Category;
