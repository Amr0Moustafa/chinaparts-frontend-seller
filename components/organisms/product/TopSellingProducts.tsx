"use client";
import React from 'react';
import type { TopSellingProduct } from '@/types/product';
import { TopSellingProductRow } from '@/components/molecules/product/TopSellingProductRow';
import { useTranslation } from 'react-i18next';

interface Props {
  products: TopSellingProduct[];
  className?: string;
}

export const TopSellingProducts: React.FC<Props> = ({ products, className = '' }) => {
   const { t } = useTranslation();
  return (
    <div
      className={`max-w-2xl w-full bg-white   overflow-hidden ${className}`}
    >
      <div className=" flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-orange-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 17l6-6 4 4 8-8"
            />
          </svg>
          <h2 className="text-lg font-semibold text-slate-800">{t('topselling.title')}</h2>
        </div>
      </div>
      <div className="divide-y divide-gray-100 space-y-5 mt-5">
        {products.map((product, idx) => (
          <TopSellingProductRow key={product.id} product={product} rank={idx + 1} />
        ))}
      </div>
    </div>
  );
};
