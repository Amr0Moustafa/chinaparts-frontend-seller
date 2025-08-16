"use client";

import React, { useState } from "react";
import { StepItem } from "@/components/molecules/stepper/StepItem";
import { ProductInfoCard } from "../product/ProductInfoCard";
import { ProductImagesCard } from "../product/ProductImagesCard";
import { ShippingInfoCard } from "../product/ShippingInfoCard";
import { PricingInventoryCard } from "../product/PricingInventoryCard";
import VariantForm from "../product/VariantForm";
import { VehicleForm } from "../product/VehicleCompatibilityForm";
import CategoryTags  from "../product/CategoryTagsCard";
import { useTranslation } from "react-i18next";



export const Stepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { t } =useTranslation();
const steps = [
  {
    id: 1,
    title: t("createproduct.stepper.steps.1.title"),
    subtitle: t("createproduct.stepper.steps.1.subtitle"),
  },
  {
    id: 2,
    title: t("createproduct.stepper.steps.2.title"),
    subtitle: t("createproduct.stepper.steps.2.subtitle"),
  },
  {
    id: 3,
    title: t("createproduct.stepper.steps.3.title"),
    subtitle: t("createproduct.stepper.steps.3.subtitle"),
  },
  {
    id: 4,
    title: t("createproduct.stepper.steps.4.title"),
    subtitle: t("createproduct.stepper.steps.4.subtitle"),
  },
  {
    id: 5,
    title: t("createproduct.stepper.steps.5.title"),
    subtitle: t("createproduct.stepper.steps.5.subtitle"),
  },
];

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
          <div className="space-y-5">
              <VariantForm/>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
              <VehicleForm/>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <PricingInventoryCard/>
           <ShippingInfoCard />
          </div>
        );
      case 5:
        return (
          <div className="space-y-5">
           <CategoryTags/>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-5 ">
      {/* Stepper */}
      <div
        className="
          flex 
          md:justify-between 
          items-center 
           
          pb-4 
          mb-6 
          overflow-x-auto 
          md:overflow-visible 
          gap-4
          
        "
      >
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
      <div className="bg-white p-2 border border-gray-300 rounded-md flex flex-col sm:flex-row justify-between mt-6 gap-3">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 w-full sm:w-auto"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          {t("createproduct.stepper.buttons.previous")}
        </button>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50 w-full sm:w-auto"
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={currentStep === steps.length}
        >
           {t("createproduct.stepper.buttons.next")}
        </button>
      </div>
    </div>
  );
};
