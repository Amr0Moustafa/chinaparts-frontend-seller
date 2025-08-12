// components/molecules/TopSellingProductRow.tsx
import React from "react";
import type { TopSellingProduct } from "@/types/product";
import { RatingStars } from "@/components/atoms/RatingStars";

interface Props {
  product: TopSellingProduct;
  rank: number;
}

export const TopSellingProductRow: React.FC<Props> = ({ product, rank }) => {
  return (
    <div
      className="flex items-center gap-4 p-4 bg-gray-100 rounded-md  border border-slate-100 hover:shadow-md transition"
      aria-label={`Rank ${rank}: ${product.title}`}
    >
      <div className="flex-shrink-0">
        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-red-100 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="object-contain w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-slate-700 truncate">
              {product.title}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold ">#{rank}</div>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-slate-500">
            <span>{product.sold} sold</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="font-semibold text-green-600"
              
            >
              ${product.price.toLocaleString()}
            </span>
          </div>
          
          {product.rating && (
            <div className="flex items-center gap-1">
              <svg
                aria-hidden="true"
                width={14}
                height={14}
                viewBox="0 0 20 20"
                fill="currentColor"
                className="text-yellow-500"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.947c.3.922-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.196-1.538-1.118l1.287-3.947a1 1 0 00-.364-1.118L2.075 9.375c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.948z" />
              </svg>
              {product.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
