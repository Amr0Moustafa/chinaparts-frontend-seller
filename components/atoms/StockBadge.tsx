"use client";

interface StockBadgeProps {
  units: number;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ units }) => {
  const color = units > 0 ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600";
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}
    >
      {units} units
    </span>
  );
};
