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
    <>
     <div className="flex items-center justify-center md:justify-start  w-full ">
      <div
        className="flex flex-col lg:flex-row items-center gap-3 cursor-pointer bg-orange-50 md:px-4 md:py-2"
        onClick={onClick}
      >
        <StepCircle
          number={number}
          isActive={isActive}
          isCompleted={isCompleted}
        />
        <div>
          <div
            className={` hidden md:block text-sm font-semibold ${
              isActive ? "text-orange-500" : "text-gray-800"
            }`}
          >
            {title}
          </div>
          <div className="hidden lg:block text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>

      {!isLast && (
        <div className=" flex-1 h-px bg-gray-300 mx-2"></div>
      )}
    </div>


   
    
    </>
   


  );
};
