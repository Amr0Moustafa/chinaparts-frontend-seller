"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StepItem } from "@/components/molecules/stepper/StepItem";
import { ProductInfoCard } from "../product/ProductInfoCard";
import { ProductImagesCard } from "../product/ProductImagesCard";
import { ShippingInfoCard } from "../product/ShippingInfoCard";
import { PricingInventoryCard } from "../product/PricingInventoryCard";
import VariantForm from "../product/VariantForm";
import { VehicleForm, VehicleData } from "../product/VehicleCompatibilityForm";
import { useTranslation } from "react-i18next";
import { CategoryTagsCard } from "../product/CategoryTagsCard";
import {
  ProductDescriptionCard,
  ProductDescriptionData,
} from "../product/ProductDescription";
import { ProductInfoData } from "../product/ProductInfoCard";
import { ProductSummaryCard } from "../product/ProductSummaryCard";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/features/products";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";

/* ==================== Types ==================== */
type StepperFormValues = {
  category_id: string;
  sub_category_id: string;
  tags: number[];
};

type Step1ValidationKeys =
  | "productInfo"
  | "categoryTags"
  | "productDescription"
  | "images";

type Step1ValidationState = Record<Step1ValidationKeys, boolean>;

type StepValidationState = Record<number, boolean>;

type ProductImagesData = {
  main_image: File | null;
  images: File[];
};

type ShippingData = {
  weight: number;
  height: number;
  width: number;
  length: number;
  is_fragile: boolean;
};

/* ==================== Constants ==================== */
const TOTAL_STEPS = 4;

const INITIAL_STEP_VALIDATION: StepValidationState = {
  1: false,
  2: false,
  3: false,
  4: false,
};

const INITIAL_STEP1_VALIDATION: Step1ValidationState = {
  productInfo: false,
  categoryTags: false,
  productDescription: false,
  images: false,
};

const INITIAL_PRODUCT_INFO: ProductInfoData = {
  name: "",
  sku: "",
  manufacturer_name: "",
  priority: "",
};

const INITIAL_PRODUCT_DESCRIPTION: ProductDescriptionData = {
  description: "",
  details_info: "",
  shipping_info: "",
  return_info: "",
};

const INITIAL_CATEGORY_TAGS: StepperFormValues = {
  category_id: "",
  sub_category_id: "",
  tags: [],
};

const INITIAL_PRODUCT_IMAGES: ProductImagesData = {
  main_image: null,
  images: [],
};

const INITIAL_SHIPPING_DATA: ShippingData = {
  weight: 0,
  height: 0,
  width: 0,
  length: 0,
  is_fragile: false,
};

/* ==================== Component ==================== */
export const Stepper: React.FC = () => {
  const { t } = useTranslation();
  const router=useRouter()
  /* ------------------ State ------------------ */
  const [currentStep, setCurrentStep] = useState(1);
  const [stepValidation, setStepValidation] = useState<StepValidationState>(
    INITIAL_STEP_VALIDATION
  );
  const [step1Validation, setStep1Validation] = useState<Step1ValidationState>(
    INITIAL_STEP1_VALIDATION
  );

  // Step 1 Data
  const [productInfoData, setProductInfoData] =
    useState<ProductInfoData>(INITIAL_PRODUCT_INFO);
  const [productDescriptionData, setProductDescriptionData] =
    useState<ProductDescriptionData>(INITIAL_PRODUCT_DESCRIPTION);
  const [categoryTagsData, setCategoryTagsData] = useState<StepperFormValues>(
    INITIAL_CATEGORY_TAGS
  );
  const [productImagesData, setProductImagesData] =
    useState<ProductImagesData>(INITIAL_PRODUCT_IMAGES);

  // Step 2 Data
  const [variantData, setVariantData] = useState<any>(null);

  // Step 3 Data
  const [vehicleData, setVehicleData] = useState<VehicleData[]>([]);
  const [shippingData, setShippingData] =
    useState<ShippingData>(INITIAL_SHIPPING_DATA);

  // Product ID (returned from step 1)
  const [productId, setProductId] = useState<number | null>(null);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ------------------ API Hooks ------------------ */
  const [createProduct, { isLoading: createLoading }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateProductMutation();

  /* ------------------ React Hook Form ------------------ */
  const formMethods = useForm<StepperFormValues>({
    defaultValues: INITIAL_CATEGORY_TAGS,
    mode: "onChange",
  });

  /* ==================== Error Handler ==================== */
  const handleApiError = (error: any) => {
    console.error("API Error:", error);

    // Clear previous messages
    setErrorMessages([]);
    setSuccessMessage(null);

    // Handle different error formats
    if (error?.data?.error?.errors) {
      // Format: { error: { errors: ["msg1", "msg2"] } }
      setErrorMessages(error.data.error.errors);
    } else if (error?.data?.errors) {
      // Format: { errors: ["msg1", "msg2"] }
      setErrorMessages(error.data.errors);
    } else if (error?.data?.error?.message) {
      // Format: { error: { message: "msg" } }
      setErrorMessages([error.data.error.message]);
    } else if (error?.data?.message) {
      // Format: { message: "msg" }
      setErrorMessages([error.data.message]);
    } else if (error?.message) {
      // Standard error object
      setErrorMessages([error.message]);
    } else {
      // Unknown error format
      setErrorMessages(["An unexpected error occurred. Please try again."]);
    }
  };

  /* ==================== API Functions ==================== */

  const submitStep1Data = async (data: {
    productInfo: ProductInfoData;
    categoryTags: StepperFormValues;
    productDescription: ProductDescriptionData;
    productImages: ProductImagesData;
  }) => {
    const formData = new FormData();

    // Add product info
    formData.append("name", data.productInfo.name);
    formData.append("sku", data.productInfo.sku);
    formData.append("manufacturer_name", data.productInfo.manufacturer_name);
    formData.append("priority", data.productInfo.priority);

    // Add category and tags
    formData.append("category_id", data.categoryTags.category_id);
    formData.append("sub_category_id", data.categoryTags.sub_category_id);
    data.categoryTags.tags.forEach((tagId, index) => {
      formData.append(`tags[${index}]`, String(tagId));
    });

    // Add description
    formData.append("description", data.productDescription.description);
    formData.append("details_info", data.productDescription.details_info);
    formData.append("shipping_info", data.productDescription.shipping_info);
    formData.append("return_info", data.productDescription.return_info);

    // Add images
    if (data.productImages.main_image) {
      formData.append("main_image", data.productImages.main_image);
    }
    data.productImages.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      const response = await createProduct(formData).unwrap();
      console.log("Step 1 API Response:", response);

      // Store the product ID from the response
      if (response?.data?.id) {
        setProductId(response.data.id);
      }

      // Clear errors and show success
      setErrorMessages([]);
      setSuccessMessage("Product created successfully!");

      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const submitStep2Data = async (data: any) => {
    console.log("Submitting step 2 data:", data);
    // TODO: Implement variant API call
  };

  const submitStep3Data = async () => {
    if (!productId) {
      throw new Error("Product ID is missing");
    }

    console.log("Submitting step 3 data");
    console.log("Vehicle data:", vehicleData);
    console.log("Shipping data:", shippingData);

    const body = {
      vehicles: vehicleData,
      weight: shippingData.weight,
      height: shippingData.height,
      width: shippingData.width,
      length: shippingData.length,
      is_fragile: shippingData.is_fragile,
    };

    console.log("Request body:", body);

    try {
      const response = await updateProduct({
        id: productId,
        data: body,
      }).unwrap();

      // Clear errors and show success
      setErrorMessages([]);
      setSuccessMessage("Shipping and vehicle information updated successfully!");

      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const submitStep4Data = async () => {
    if (!productId) {
      throw new Error("Product ID is missing");
    }
     router.push('/dashboard/products')
    // console.log("Finalizing product:", productId);
    // TODO: Implement final submission API call
  };

  /* ------------------ Memoized Steps ------------------ */
  const steps = useMemo(
    () => [
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
    ],
    [t]
  );

  /* ------------------ Effects ------------------ */
  // Update step 1 validation based on all sub-forms
  useEffect(() => {
    const allValid = Object.values(step1Validation).every(Boolean);
    setStepValidation((prev) => {
      if (prev[1] === allValid) return prev;
      return { ...prev, 1: allValid };
    });
  }, [step1Validation]);

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Vehicle data changed:", vehicleData);
      console.log("Shipping data changed:", shippingData);
    }
  }, [vehicleData, shippingData]);

  // Clear messages when step changes
  useEffect(() => {
    setErrorMessages([]);
    setSuccessMessage(null);
  }, [currentStep]);

  /* ------------------ Handlers ------------------ */
  const handleValidationChange = useCallback(
    (step: number, isValid: boolean, formName?: string) => {
      if (step === 1 && formName) {
        setStep1Validation((prev) => {
          if (prev[formName as Step1ValidationKeys] === isValid) return prev;
          return { ...prev, [formName]: isValid };
        });
      } else {
        setStepValidation((prev) => {
          if (prev[step] === isValid) return prev;
          return { ...prev, [step]: isValid };
        });
      }
    },
    []
  );

  const handleProductInfoChange = useCallback((data: ProductInfoData) => {
    setProductInfoData(data);
  }, []);

  const handleProductDescriptionChange = useCallback(
    (data: ProductDescriptionData) => {
      setProductDescriptionData(data);
    },
    []
  );

  const handleCategoryChange = useCallback((data: StepperFormValues) => {
    setCategoryTagsData(data);
  }, []);

  const handleProductImagesChange = useCallback((data: ProductImagesData) => {
    setProductImagesData(data);
  }, []);

  const handleVariantDataChange = useCallback((data: any) => {
    setVariantData(data);
  }, []);

  const handleShippingDataChange = useCallback((data: ShippingData | null) => {
    if (data) {
      setShippingData(data);
    }
  }, []);

  const handleVehicleDataChange = useCallback((data: VehicleData[]) => {
    console.log("Vehicle data received in Stepper:", data);
    setVehicleData(data);
  }, []);

  const handleStepClick = useCallback((stepId: number) => {
    setCurrentStep(stepId);
  }, []);

  const handlePreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }, []);

  const dismissError = (index: number) => {
    setErrorMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const dismissSuccess = () => {
    setSuccessMessage(null);
  };

  /* ------------------ Submit Logic for Each Step ------------------ */
  const handleNextStep = useCallback(async () => {
    setIsSubmitting(true);

    try {
      switch (currentStep) {
        case 1: {
          await submitStep1Data({
            productInfo: productInfoData,
            categoryTags: categoryTagsData,
            productDescription: productDescriptionData,
            productImages: productImagesData,
          });
          break;
        }

        case 2: {
          const step2Data = {
            product_id: productId,
            ...variantData,
          };
          await submitStep2Data(step2Data);
          break;
        }

        case 3: {
          await submitStep3Data();
          break;
        }

        default:
          break;
      }

      // Move to next step after successful submission
      setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
    } catch (error) {
      // Error is already handled in submitStepXData functions
      console.error(`Error submitting step ${currentStep}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentStep,
    productInfoData,
    categoryTagsData,
    productDescriptionData,
    productImagesData,
    productId,
    variantData,
    vehicleData,
    shippingData,
  ]);

  const handleFinalSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      await submitStep4Data();
      setSuccessMessage("Product finalized successfully!");
      // TODO: Redirect to product page
      // router.push(`/products/${productId}`);
    } catch (error) {
      // Error is already handled in submitStep4Data
      console.error("Error finalizing product:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [productId]);

  /* ------------------ Computed Values ------------------ */
  const canProceedToNextStep = stepValidation[currentStep];
  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;

  /* ------------------ Render Content ------------------ */
  const renderSectionContent = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <ProductInfoCard
              onValidationChange={(isValid) =>
                handleValidationChange(1, isValid, "productInfo")
              }
              onDataChange={handleProductInfoChange}
              initialValues={productInfoData}
            />

            <CategoryTagsCard
              onValidationChange={(isValid) =>
                handleValidationChange(1, isValid, "categoryTags")
              }
              onDataChange={handleCategoryChange}
              initialValues={categoryTagsData}
            />

            <ProductDescriptionCard
              onValidationChange={(isValid) =>
                handleValidationChange(1, isValid, "productDescription")
              }
              onDataChange={handleProductDescriptionChange}
              initialValues={productDescriptionData}
            />

            <ProductImagesCard
              onValidationChange={(isValid) =>
                handleValidationChange(1, isValid, "images")
              }
              onDataChange={handleProductImagesChange}
              initialData={productImagesData}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="p-8 text-center border rounded-lg">
              <p className="text-gray-500">Variant form coming soon...</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <VehicleForm
              onDataChange={handleVehicleDataChange}
              onValidationChange={(isValid) =>
                handleValidationChange(3, isValid)
              }
            />
            <ShippingInfoCard
              productId={productId}
              onDataChange={handleShippingDataChange}
              onValidationChange={(isValid) =>
                handleValidationChange(3, isValid)
              }
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <ProductSummaryCard
              productId={productId}
              productInfo={productInfoData}
              categoryTags={categoryTagsData}
              description={productDescriptionData}
              images={productImagesData}
              variants={variantData}
              shipping={{
                productId: productId,
                weight: String(shippingData.weight),
                length: String(shippingData.length),
                width: String(shippingData.width),
                height: String(shippingData.height),
                is_fragile: shippingData.is_fragile,
              }}
              vehicles={vehicleData}
            />
          </div>
        );

      default:
        return null;
    }
  }, [
    currentStep,
    productId,
    handleValidationChange,
    handleProductInfoChange,
    handleCategoryChange,
    handleProductDescriptionChange,
    handleProductImagesChange,
    handleVariantDataChange,
    handleShippingDataChange,
    handleVehicleDataChange,
    productInfoData,
    categoryTagsData,
    productDescriptionData,
    productImagesData,
    variantData,
    shippingData,
    vehicleData,
  ]);

  /* ------------------ JSX ------------------ */
  return (
    <FormProvider {...formMethods}>
      <div className="max-w-7xl mx-auto mt-5">
        {/* Stepper Navigation */}
        <nav
          className="flex lg:items-center justify-center gap-4 md:gap-0 pb-4 mb-6"
          aria-label="Progress"
        >
          {steps.map((step, index) => (
            <div key={step.id} className="lg:shrink-0">
              <StepItem
                number={step.id}
                title={step.title}
                subtitle={step.subtitle}
                isActive={currentStep === step.id}
                isCompleted={currentStep > step.id}
                onClick={() => handleStepClick(step.id)}
                isLast={index === steps.length - 1}
              />
            </div>
          ))}
        </nav>

        {/* Mobile Step Title */}
        <div className="md:hidden flex justify-center mb-6">
          <h2 className="text-xl font-semibold text-orange-500">
            {steps[currentStep - 1]?.title}
          </h2>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
            <button
              onClick={dismissSuccess}
              className="text-green-600 hover:text-green-800"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Messages */}
        {errorMessages.length > 0 && (
          <div className="mb-4 space-y-2">
            {errorMessages.map((error, index) => (
              <div
                key={index}
                className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
                <button
                  onClick={() => dismissError(index)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        <main>{renderSectionContent()}</main>

        {/* Navigation Buttons */}
        <footer className="bg-white border-gray-100 p-2 border rounded-md flex flex-col sm:flex-row justify-between mt-6 gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePreviousStep}
            disabled={isFirstStep || isSubmitting}
            aria-label={t("createproduct.stepper.buttons.previous")}
          >
            {t("createproduct.stepper.buttons.previous")}
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={isLastStep ? handleFinalSubmit : handleNextStep}
            disabled={isSubmitting}
            aria-label={
              isLastStep
                ? t("createproduct.stepper.buttons.submit") || "Submit"
                : t("createproduct.stepper.buttons.next")
            }
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>{isLastStep ? "Submitting..." : "Saving..."}</span>
              </>
            ) : (
              <span>
                {isLastStep
                  ? t("createproduct.stepper.buttons.submit") || "Submit"
                  : t("createproduct.stepper.buttons.next")}
              </span>
            )}
          </button>
        </footer>
      </div>
    </FormProvider>
  );
};