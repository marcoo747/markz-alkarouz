import React from 'react';
import Card from './card';

const ItemPack = ({category_name}) => {
  return (
    <div className="item-pack">
      <h2>{category_name}</h2>
      <div className="cards-row">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

export default ItemPack;
