"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";

interface FilterTabsProps {
  filters: string[] ;
  activeFilter: string;
  onChange: (filter: string) => void;
  className?: string;
}

export const FilterTabs: FC<FilterTabsProps> = ({
  filters,
  activeFilter,
  onChange,
  className = "",
}) => {
  const { t } = useTranslation();
  return (
    <div className={`flex items-center bg-gray-100 border border-gray-200 rounded-md p-1 gap-3 ${className}`}>
      {filters.map((f) => {
        
        return (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-4 py-1 2xl:px-8 rounded-md text-sm font-medium border-0 transition-colors ${
            activeFilter === f || f === t(activeFilter)
              ? "bg-white text-gray-900 shadow-md"
              : " hover:bg-white hover:text-gray-900"
          }`}
        >
          {f}
        </button>
      ) })}
    </div>
  );
};
