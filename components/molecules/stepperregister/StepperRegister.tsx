"use client";

import React from "react";
import { StepCircle } from "@/components/atoms/StepCircle";

export type RegisterStep = {
  id: number;
  label: string;
  description?: string;
};

export const REGISTER_STEPS: RegisterStep[] = [
  { id: 1, label: "Personal Information", description: "Your basic details" },
  { id: 2, label: "Store Information", description: "About your store" },
  { id: 3, label: "Company Legal Information", description: "Legal & compliance" },
  { id: 4, label: "Review & Submit", description: "Confirm & send" },
];

interface StepperRegisterProps {
  currentStep: number;
  steps?: RegisterStep[];
}

export const StepperRegister: React.FC<StepperRegisterProps> = ({
  currentStep,
  steps = REGISTER_STEPS,
}) => {
  const progressPct = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <aside className=" min-h-screen bg-white border-r border-gray-100 flex flex-col px-6 py-8 gap-8 sticky top-0 h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <span className="text-base font-bold text-gray-900 tracking-tight">
          Account Setup
        </span>
      </div>

      {/* Steps */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Your Progress
        </p>

        {steps.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200
                ${isActive ? "bg-orange-50" : "hover:bg-gray-50"}
              `}
            >
              {/* Step Circle */}
              <div className="mt-0.5 shrink-0">
                <StepCircle
                  number={step.id}
                  isActive={isActive}
                  isCompleted={isCompleted}
                />
              </div>

              {/* Labels */}
              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-sm font-semibold leading-tight transition-colors
                    ${isActive ? "text-orange-500" : isCompleted ? "text-gray-800" : "text-gray-400"}
                  `}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span
                    className={`text-xs leading-tight
                      ${isActive ? "text-orange-400" : "text-gray-400"}
                    `}
                  >
                    {step.description}
                  </span>
                )}
              </div>

              {/* Connector line between steps */}
            </div>
          );
        })}
      </nav>

      {/* Progress bar at bottom */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400 font-medium">Completion</span>
          <span className="text-xs font-bold text-orange-500">{progressPct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-[11px] text-gray-400 text-center mt-1">
          Step {currentStep} of {steps.length}
        </p>
      </div>
    </aside>
  );
};