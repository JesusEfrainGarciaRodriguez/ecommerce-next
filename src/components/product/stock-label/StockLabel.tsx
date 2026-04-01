"use client";

import { useEffect, useState } from "react";
import { getStockBySlug } from "@/actions";

interface StockLabelProps {
  slug: string;
}

export const StockLabel = ({ slug }: StockLabelProps) => {
  const [stock, setStock] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStock = async () => {
      const stock = await getStockBySlug(slug);
      setStock(stock);
      setIsLoading(false);
    };
    
    getStock();
  }, []);

  if (isLoading) {
    return (
      <p className="animated-pulse antialiased text-lg mb-1 bg-gray-200">
        &nbsp;
      </p>
    );
  }

  return (
    <p className="antialiased font-bold text-sm mb-1">
      Disponibles: {stock !== null ? stock : "Cargando..."}
    </p>
  );
};
