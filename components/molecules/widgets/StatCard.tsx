"use client";

import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  color?: "blue" | "green" | "orange" | "purple" | "red" | "violet" | "gray";
  subLabel?: string;
  change?: string;
  home?: boolean; // made optional
}

const variantClasses: Record<
  NonNullable<StatCardProps["color"]>,
  { bg: string; text: string }
> = {
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  orange: { bg: "bg-orange-100", text: "text-orange-700" },
  green: { bg: "bg-green-100", text: "text-green-700" },
  red: { bg: "bg-red-100", text: "text-red-700" },
  violet: { bg: "bg-violet-100", text: "text-violet-700" },
  purple: { bg: "bg-purple-100", text: "text-purple-700" },
  gray: { bg: "bg-gray-100", text: "text-gray-700" },
};

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  subLabel,
  change,
  color = "blue",
  home = false,
}) => {
  const { bg, text } = variantClasses[color];

  if (!home) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-4 flex items-center gap-4 shadow-sm">
        <div className={`${bg} ${text} p-3 rounded-md flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <div className="text-xl font-bold">{value}</div>
          <div className="text-md text-gray-500">{label}</div>
        </div>
      </div>
    );
  }

  return (
 <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500 mb-1">{label}</div>
          <div className="text-xl font-bold text-gray-900 mb-1">{value}</div>
          {subLabel && <div className="text-xs text-gray-400">{subLabel}</div>}
          {change && <div className="text-xs text-green-500 mt-1">{change}</div>}
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>
          <div className={text}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};
