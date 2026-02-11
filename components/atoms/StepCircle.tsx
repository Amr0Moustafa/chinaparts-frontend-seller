"use client";

import { BadgeCheck } from "lucide-react";
import React from "react";

type StepCircleProps = {
  number: number;
  isActive: boolean;
  isCompleted: boolean;
};

export const StepCircle: React.FC<StepCircleProps> = ({
  number,
  isActive,
  isCompleted,
}) => {
  return (
    <div
      className={`w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-sm font-bold transition-all duration-200
        ${isActive ? "bg-orange-500 text-white border-0" : ""}
        ${isCompleted ? "border-green-500 bg-green-500 text-white" : ""}
        ${!isActive && !isCompleted ? " bg-white text-gray-500" : ""}
      `}
    >
      {isCompleted ? <BadgeCheck className="w-4 h-4" /> : number}
    </div>
  );
};
