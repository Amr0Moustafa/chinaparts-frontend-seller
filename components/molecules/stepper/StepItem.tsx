"use client";

import React from "react";
import { StepCircle } from "@/components/atoms/StepCircle";

type StepItemProps = {
  number: number;
  title: string;
  subtitle: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
  isLast?: boolean;
};

export const StepItem: React.FC<StepItemProps> = ({
  number,
  title,
  subtitle,
  isActive,
  isCompleted,
  onClick,
  isLast = false,
}) => {
  return (
    <div className="flex items-center w-full">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={onClick}
      >
        <StepCircle
          number={number}
          isActive={isActive}
          isCompleted={isCompleted}
        />
        <div>
          <div
            className={`text-sm font-semibold ${
              isActive ? "text-orange-500" : "text-gray-800"
            }`}
          >
            {title}
          </div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>

      {!isLast && (
        <div className="flex-1 h-px bg-gray-300 mx-4"></div>
      )}
    </div>
  );
};
