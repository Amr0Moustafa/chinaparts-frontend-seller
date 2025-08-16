"use client";

import React, { useState } from "react";
import { StepItem } from "@/components/molecules/stepper/StepItem";
import { ProductInfoCard } from "../product/ProductInfoCard";
import { ProductImagesCard } from "../product/ProductImagesCard";

const steps = [
  {
    id: 1,
    title: "Product Info & Media",
    subtitle: "Basic details and images",
  },
  {
    id: 2,
    title: "Variants & Compatibility",
    subtitle: "Product variants and vehicles",
  },
  {
    id: 3,
    title: "Pricing & Shipping",
    subtitle: "Price and shipping details",
  },
  { id: 4, title: "Inventory", subtitle: "Stock and warehouse details" },
  {
    id: 5,
    title: "Review & Submit",
    subtitle: "Category, tags and final review",
  },
];

export const Stepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const renderSectionContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <ProductInfoCard />
            <ProductImagesCard />
          </div>
        );
      case 2:
        return (
          <div className="bg-white shadow p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">
              Variants & Compatibility
            </h2>
            <p>Fields to select product variants and compatible vehicles.</p>
          </div>
        );
      case 3:
        return (
          <div className="bg-white shadow p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Pricing & Shipping</h2>
            <p>Form to set price, discounts, and shipping rules.</p>
          </div>
        );
      case 4:
        return (
          <div className="bg-white shadow p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Inventory</h2>
            <p>Stock level and warehouse management.</p>
          </div>
        );
      case 5:
        return (
          <div className="bg-white shadow p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Review & Submit</h2>
            <p>Final check before publishing the product.</p>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="max-w-5xl mx-auto">
      {/* Stepper */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        {steps.map((step, index) => (
          <StepItem
            key={step.id}
            number={step.id}
            title={step.title}
            subtitle={step.subtitle}
            isActive={currentStep === step.id}
            isCompleted={currentStep > step.id}
            onClick={() => setCurrentStep(step.id)}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>

      {/* Section Content */}
      {renderSectionContent()}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={currentStep === steps.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};
