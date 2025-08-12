"use client";

import React from "react";

interface StatusBadgeProps {
  label: string;
  color: "green" | "red" | "orange" | "yellow" | "blue" | "gray"; // you can extend this as needed
  className?: string;
}

const colorMap: Record<StatusBadgeProps["color"], string> = {
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
  orange: "bg-orange-100 text-orange-600",
  yellow: "bg-yellow-100 text-yellow-600",
  blue: "bg-blue-100 text-blue-600",
  gray: "bg-gray-100 text-gray-600",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  color,
  className = "",
}) => {
  const base = "px-2 py-1 text-xs font-semibold rounded-full inline-block";
  const classes = `${base} ${colorMap[color]} ${className}`;

  return <span className={classes}>{label}</span>;
};
