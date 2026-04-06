"use client";

import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChange }: Props) => {

  const onQuantityChanged = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity < 1) return;

    onQuantityChange(newQuantity);
  };

  return (
    <div className="flex">
      <button
        className="cursor-pointer hover:bg-gray-100 rounded-full fadeIn transition-all duration-300"
        onClick={() => onQuantityChanged(-1)}
      >
        <IoRemoveCircleOutline size={30} />
      </button>

      <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded">
        {quantity}
      </span>

      <button
        className="cursor-pointer hover:bg-gray-100 rounded-full fadeIn transition-all duration-300"
        onClick={() => onQuantityChanged(+1)}
      >
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
};
