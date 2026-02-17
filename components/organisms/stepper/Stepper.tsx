"use client";

import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StepItem } from "@/components/molecules/stepper/StepItem";
import { ProductInfoCard } from "../product/ProductInfoCard";
import { ProductImagesCard } from "../product/ProductImagesCard";
import { ShippingInfoCard } from "../product/ShippingInfoCard";
import { PricingInventoryCard } from "../product/PricingInventoryCard";

import { VehicleData, VehicleForm } from "../product/VehicleCompatibilityForm";
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
  useGetProductByIdQuery,
} from "@/features/products";
import {
  useCreateVariantMutation,
  useUpdateVariantMutation,
} from "@/features/variants";
import VariantFormCard from "../product/VariantForm";
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
  main_image_url?: string;
  images_url?: string[];
};

type ShippingData = {
  weight: number;
  height: number;
  width: number;
  length: number;
  is_fragile: boolean;
};

interface VariantCombination {
  id: string;
  combinations: { [attributeName: string]: { id: number; value: string } };
  attribute_value_ids: number[];
  variant_name: string;
  cost_price: string;
  selling_price: string;
  discount_price: string;
  stock_quantity: number;
  is_default: boolean;
  status: number;
}

interface VariantData {
  variants: VariantCombination[];
}

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
  main_image_url: "",
  images_url: [],
};

const INITIAL_SHIPPING_DATA: ShippingData = {
  weight: 0,
  height: 0,
  width: 0,
  length: 0,
  is_fragile: false,
};

const INITIAL_VARIANT_DATA: VariantData = {
  variants: [],
};

/* ==================== Helpers ==================== */

/** Deep-compare two values by serialising to JSON */
const isEqual = (a: unknown, b: unknown): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

/**
 * Returns true when images data has changed.
 * A new File object means the user picked a new file.
 * URL changes (removed images) also count as a change.
 */
const hasImagesChanged = (
  current: ProductImagesData,
  original: ProductImagesData,
): boolean => {
  if (current.main_image !== null) return true; // new file selected
  if (current.images.length > 0) return true; // new files selected
  if (current.main_image_url !== original.main_image_url) return true;
  if (!isEqual(current.images_url, original.images_url)) return true;
  return false;
};

/* ==================== Component ==================== */
interface StepperProps {
  product_id?: string | number;
}

export const Stepper: React.FC<StepperProps> = ({ product_id }) => {
  const { t } = useTranslation();
  const isEditMode = !!product_id;
  const router = useRouter();

  const isInitializingRef = useRef(false);
  const prevProductDataRef = useRef<string>("");

  /* ---- Refs that hold the "original" data loaded from the API ---- */
  const originalStep1Ref = useRef<{
    productInfo: ProductInfoData;
    categoryTags: StepperFormValues;
    productDescription: ProductDescriptionData;
    productImages: ProductImagesData;
  } | null>(null);

  const originalVariantRef = useRef<VariantData | null>(null);

  const originalStep3Ref = useRef<{
    shipping: ShippingData;
    vehicles: VehicleData[];
  } | null>(null);

  /* ------------------ State ------------------ */
  const [currentStep, setCurrentStep] = useState(1);
  const [stepValidation, setStepValidation] = useState<StepValidationState>(
    INITIAL_STEP_VALIDATION,
  );
  const [step1Validation, setStep1Validation] = useState<Step1ValidationState>(
    INITIAL_STEP1_VALIDATION,
  );

  // Step 1 Data
  const [productInfoData, setProductInfoData] =
    useState<ProductInfoData>(INITIAL_PRODUCT_INFO);
  const [productDescriptionData, setProductDescriptionData] =
    useState<ProductDescriptionData>(INITIAL_PRODUCT_DESCRIPTION);
  const [categoryTagsData, setCategoryTagsData] = useState<StepperFormValues>(
    INITIAL_CATEGORY_TAGS,
  );
  const [productImagesData, setProductImagesData] = useState<ProductImagesData>(
    INITIAL_PRODUCT_IMAGES,
  );

  // Step 2 Data
  const [variantData, setVariantData] =
    useState<VariantData>(INITIAL_VARIANT_DATA);

  // Step 3 Data
  const [vehicleData, setVehicleData] = useState<VehicleData[]>([]);
  const [shippingData, setShippingData] = useState<ShippingData>(
    INITIAL_SHIPPING_DATA,
  );

  const [productId, setProductId] = useState<number | null>(
    product_id ? Number(product_id) : null,
  );

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  /* ------------------ API Hooks ------------------ */
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [createVariant] = useCreateVariantMutation();
  const [updateVariant] = useUpdateVariantMutation();

  const {
    data: existingProduct,
    isLoading: isLoadingProduct,
    error: productError,
  } = useGetProductByIdQuery(product_id ?? 0, {
    skip: !product_id,
  });

  /* ------------------ React Hook Form ------------------ */
  const formMethods = useForm<StepperFormValues>({
    defaultValues: INITIAL_CATEGORY_TAGS,
    mode: "onChange",
  });

  /* ------------------ Load Existing Product Data ------------------ */
  useEffect(() => {
    if (!existingProduct?.data) {
      if (!isEditMode && !isDataLoaded) {
        setIsDataLoaded(true);
      }
      return;
    }

    const currentProductDataStr = JSON.stringify(existingProduct.data);
    if (currentProductDataStr === prevProductDataRef.current) return;

    console.log("📦 Loading product data...");
    prevProductDataRef.current = currentProductDataStr;
    isInitializingRef.current = true;

    const product = existingProduct.data;

    if (product.id && !productId) {
      setProductId(product.id);
    }

    // ---- Step 1 data ----
    const newProductInfo: ProductInfoData = {
      name: product.name || "",
      sku: product.sku || "",
      manufacturer_name: product.manufacturer_name || "",
      priority: product.priority || "",
    };
    setProductInfoData(newProductInfo);

    const newCategoryTags: StepperFormValues = {
      category_id: product.category_id?.toString() || "",
      sub_category_id: product.sub_category_id?.toString() || "",
      tags: product.tags?.map((tag: any) => tag.id) || [],
    };
    setCategoryTagsData(newCategoryTags);

    const newDescription: ProductDescriptionData = {
      description: product.description || "",
      details_info: product.details_info || "",
      shipping_info: product.shipping_info || "",
      return_info: product.return_info || "",
    };
    setProductDescriptionData(newDescription);

    const newImages: ProductImagesData = {
      main_image: null,
      images: [],
      main_image_url: product.main_image || "",
      images_url:
        product.images?.map((img: any) => img.image || img.url || img) || [],
    };
    setProductImagesData(newImages);

    // Snapshot original step 1 data
    originalStep1Ref.current = {
      productInfo: newProductInfo,
      categoryTags: newCategoryTags,
      productDescription: newDescription,
      productImages: newImages,
    };

    // ---- Step 3 data ----
    const newShipping: ShippingData = {
      weight: Number(product.weight) || 0,
      height: Number(product.height) || 0,
      width: Number(product.width) || 0,
      length: Number(product.length) || 0,
      is_fragile: product.is_fragile || false,
    };
    setShippingData(newShipping);

    const transformedVehicles: VehicleData[] = [];
    if (product.main_vehicle) {
      transformedVehicles.push({
        year: product.main_vehicle.year,
        type_id: String(product.main_vehicle.type?.id || ""),
        model_id: String(product.main_vehicle.model?.id || ""),
        body_type_id: String(product.main_vehicle.body_type?.id || ""),
        is_main: true,
      });
    }
    if (product.compatible_vehicles && Array.isArray(product.compatible_vehicles)) {
      product.compatible_vehicles.forEach((vehicle: any) => {
        transformedVehicles.push({
          year: vehicle.year,
          type_id: String(vehicle.type?.id || ""),
          model_id: String(vehicle.model?.id || ""),
          body_type_id: String(vehicle.body_type?.id || ""),
          is_main: false,
        });
      });
    }
    setVehicleData(transformedVehicles);

    // Snapshot original step 3 data
    originalStep3Ref.current = {
      shipping: newShipping,
      vehicles: transformedVehicles,
    };

    // ---- Step 2 data (variants) ----
    if (product.variants && Array.isArray(product.variants)) {
      const transformedVariantData: VariantData = {
        variants: product.variants.map((v: any) => ({
          id: String(v.id) || Math.random().toString(36).substr(2, 9),
          combinations: v.combinations || {},
          attribute_value_ids: v.attribute_value_ids || [],
          variant_name: v.variant_name || v.name || "",
          cost_price: String(v.cost_price || ""),
          selling_price: String(v.selling_price || v.price || ""),
          discount_price: String(v.discount_price || ""),
          stock_quantity: Number(v.stock_quantity || v.quantity || 0),
          is_default: Boolean(v.is_default),
          status: Number(v.status ?? 1),
        })),
      };
      setVariantData(transformedVariantData);
      // Snapshot original variant data
      originalVariantRef.current = transformedVariantData;
    }

    setTimeout(() => {
      setIsDataLoaded(true);
      isInitializingRef.current = false;
      console.log("✅ Product data loaded");
    }, 100);
  }, [existingProduct, isEditMode, productId]);

  /* ==================== Change Detection Helpers ==================== */

  /**
   * Returns true if step 1 data has changed compared to the originally
   * loaded snapshot. In create mode it always returns true.
   */
  const hasStep1Changed = useCallback((): boolean => {
    if (!isEditMode || !originalStep1Ref.current) return true;

    const orig = originalStep1Ref.current;

    return (
      !isEqual(productInfoData, orig.productInfo) ||
      !isEqual(categoryTagsData, orig.categoryTags) ||
      !isEqual(productDescriptionData, orig.productDescription) ||
      hasImagesChanged(productImagesData, orig.productImages)
    );
  }, [
    isEditMode,
    productInfoData,
    categoryTagsData,
    productDescriptionData,
    productImagesData,
  ]);

  /**
   * Returns true if variant data has changed compared to the originally
   * loaded snapshot. In create mode it always returns true.
   */
  const hasStep2Changed = useCallback((): boolean => {
    if (!isEditMode || !originalVariantRef.current) return true;
    return !isEqual(variantData, originalVariantRef.current);
  }, [isEditMode, variantData]);

  /**
   * Returns true if step 3 (shipping + vehicles) data has changed.
   */
  const hasStep3Changed = useCallback((): boolean => {
    if (!isEditMode || !originalStep3Ref.current) return true;
    const orig = originalStep3Ref.current;
    return (
      !isEqual(shippingData, orig.shipping) ||
      !isEqual(vehicleData, orig.vehicles)
    );
  }, [isEditMode, shippingData, vehicleData]);

  /* ==================== API Functions ==================== */

  const submitStep1Data = async (data: {
    productInfo: ProductInfoData;
    categoryTags: StepperFormValues;
    productDescription: ProductDescriptionData;
    productImages: ProductImagesData;
  }) => {
    const formData = new FormData();

    formData.append("store_step", "1");
    formData.append("name", data.productInfo.name);
    formData.append("sku", data.productInfo.sku);
    formData.append("manufacturer_name", data.productInfo.manufacturer_name);
    formData.append("priority", data.productInfo.priority);
    formData.append("category_id", data.categoryTags.category_id);
    formData.append("sub_category_id", data.categoryTags.sub_category_id);
    data.categoryTags.tags.forEach((tagId, index) => {
      formData.append(`tags[${index}]`, String(tagId));
    });
    formData.append("description", data.productDescription.description);
    formData.append("details_info", data.productDescription.details_info);
    formData.append("shipping_info", data.productDescription.shipping_info);
    formData.append("return_info", data.productDescription.return_info);

    if (data.productImages.main_image) {
      formData.append("main_image", data.productImages.main_image);
    }
    data.productImages.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    let response;

    if (isEditMode && productId) {
      response = await updateProduct({ id: productId, data: formData }).unwrap();
      setMessage("Product updated successfully!");

      // Update snapshot so subsequent navigation doesn't re-send
      originalStep1Ref.current = {
        productInfo: data.productInfo,
        categoryTags: data.categoryTags,
        productDescription: data.productDescription,
        productImages: {
          ...data.productImages,
          main_image: null,  // reset file after upload
          images: [],
        },
      };
    } else {
      response = await createProduct(formData).unwrap();
      setMessage("Product created successfully!");
      if (response?.data?.id) {
        setProductId(response.data.id);
      }
    }

    return response;
  };

  const submitStep2Data = async (data: VariantData) => {
    if (!productId) throw new Error("Product ID is missing");

    if (!data?.variants?.length) {
      console.warn("⚠️ No variants to submit");
      return { success: true, message: "No variants to create" };
    }

    const variantsPayload = data.variants.map((v) => ({
      attribute_value_ids: v.attribute_value_ids,
      variant_name: v.variant_name,
      cost_price: parseFloat(v.cost_price) || 0,
      selling_price: parseFloat(v.selling_price) || 0,
      discount_price: parseFloat(v.discount_price) || 0,
      stock_quantity: v.stock_quantity,
      is_default: v.is_default,
      status: v.status,
    }));

    let response;

    if (isEditMode && data.variants[0]?.id) {
      const updatePromises = data.variants.map((variant, index) =>
        updateVariant({
          productId: String(productId),
          variantId: variant.id,
          data: variantsPayload[index],
        }).unwrap(),
      );
      response = await Promise.all(updatePromises);
      setMessage(`${data.variants.length} variant(s) updated successfully!`);
    } else {
      const createPromises = variantsPayload.map((payload) =>
        createVariant({ productId: String(productId), data: payload }).unwrap(),
      );
      response = await Promise.all(createPromises);
      setMessage(`${data.variants.length} variant(s) created successfully!`);
    }

    // Update snapshot
    originalVariantRef.current = data;

    return response;
  };

  const submitStep3Data = async () => {
    if (!productId) throw new Error("Product ID is missing");

    const body = {
      store_step: "3",
      vehicles: vehicleData,
      weight: shippingData.weight,
      height: shippingData.height,
      width: shippingData.width,
      length: shippingData.length,
      is_fragile: shippingData.is_fragile,
    };

    const response = await updateProduct({ id: productId, data: body }).unwrap();
    setMessage("Product updated successfully!");
    setSubmitError(null);

    // Update snapshot
    originalStep3Ref.current = {
      shipping: shippingData,
      vehicles: vehicleData,
    };

    return response;
  };

  const submitStep4Data = async () => {
    if (!productId) throw new Error("Product ID is missing");
    const body = { store_step: "4", status: "published" };
    return await updateProduct({ id: productId, data: body }).unwrap();
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
    [t],
  );

  /* ------------------ Effects ------------------ */
  useEffect(() => {
    if (isInitializingRef.current) return;
    const allValid = Object.values(step1Validation).every(Boolean);
    setStepValidation((prev) => {
      if (prev[1] === allValid) return prev;
      return { ...prev, 1: allValid };
    });
  }, [step1Validation]);

  /* ------------------ Handlers ------------------ */
  const handleValidationChange = useCallback(
    (step: number, isValid: boolean, formName?: string) => {
      if (isInitializingRef.current) return;
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
    [],
  );

  const handleProductInfoChange = useCallback((data: ProductInfoData) => {
    if (isInitializingRef.current) return;
    setProductInfoData(data);
  }, []);

  const handleProductDescriptionChange = useCallback(
    (data: ProductDescriptionData) => {
      if (isInitializingRef.current) return;
      setProductDescriptionData(data);
    },
    [],
  );

  const handleCategoryChange = useCallback((data: StepperFormValues) => {
    if (isInitializingRef.current) return;
    setCategoryTagsData(data);
  }, []);

  const handleProductImagesChange = useCallback((data: ProductImagesData) => {
    if (isInitializingRef.current) return;
    setProductImagesData(data);
  }, []);

  const handleVariantDataChange = useCallback((data: any) => {
    if (isInitializingRef.current) return;
    if (data?.variants) {
      setVariantData({ variants: data.variants });
    } else if (Array.isArray(data)) {
      setVariantData({ variants: data });
    } else {
      setVariantData(data);
    }
  }, []);

  const handleShippingDataChange = useCallback((data: any) => {
    if (isInitializingRef.current) return;
    if (data) {
      setShippingData({
        weight: Number(data.weight) || 0,
        height: Number(data.height) || 0,
        width: Number(data.width) || 0,
        length: Number(data.length) || 0,
        is_fragile: Boolean(data.is_fragile),
      });
    }
  }, []);

  const handleVehicleDataChange = useCallback((data: VehicleData[]) => {
    if (isInitializingRef.current) return;
    setVehicleData(data);
  }, []);

  const handleStepClick = useCallback((stepId: number) => {
    setCurrentStep(stepId);
  }, []);

  const handlePreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }, []);

  /* ------------------ Submit Logic for Each Step ------------------ */
  const handleNextStep = useCallback(async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      switch (currentStep) {
        case 1: {
          if (hasStep1Changed()) {
            console.log("🔄 Step 1 data changed — calling API");
            await submitStep1Data({
              productInfo: productInfoData,
              categoryTags: categoryTagsData,
              productDescription: productDescriptionData,
              productImages: productImagesData,
            });
          } else {
            console.log("✅ Step 1 data unchanged — skipping API call");
            setMessage(null); // clear any previous message
          }
          break;
        }

        case 2: {
          if (hasStep2Changed()) {
            console.log("🔄 Step 2 data changed — calling API");
            await submitStep2Data(variantData);
          } else {
            console.log("✅ Step 2 data unchanged — skipping API call");
            setMessage(null);
          }
          break;
        }

        case 3: {
          if (hasStep3Changed()) {
            console.log("🔄 Step 3 data changed — calling API");
            await submitStep3Data();
          } else {
            console.log("✅ Step 3 data unchanged — skipping API call");
            setMessage(null);
          }
          break;
        }

        default:
          break;
      }

      setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
    } catch (error) {
      console.error(`Error submitting step ${currentStep}:`, error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : `Failed to submit step ${currentStep} data`,
      );
      setMessage(null);
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
    isEditMode,
    hasStep1Changed,
    hasStep2Changed,
    hasStep3Changed,
  ]);

  const handleFinalSubmit = useCallback(async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    router.push(`/dashboard/products/${productId}/show`);
  }, [productId, isEditMode, router]);

  /* ------------------ Computed Values ------------------ */
  const canProceedToNextStep = stepValidation[currentStep];
  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;

  const memoizedShippingData = useMemo(
    () => shippingData,
    [
      shippingData.weight,
      shippingData.height,
      shippingData.width,
      shippingData.length,
      shippingData.is_fragile,
    ],
  );

  const selectedCategoryId = useMemo(() => {
    const catId =
      categoryTagsData.sub_category_id || categoryTagsData.category_id;
    return catId ? Number(catId) : null;
  }, [categoryTagsData.category_id, categoryTagsData.sub_category_id]);

  /* ------------------ Render Content ------------------ */
  const renderSectionContent = useCallback(() => {
    const dataKey = isEditMode ? String(productId) : "new";

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <ProductInfoCard
              key={`product-info-${dataKey}`}
              onValidationChange={(isValid) =>
                handleValidationChange(1, isValid, "productInfo")
              }
              onDataChange={handleProductInfoChange}
              initialValues={productInfoData}
            />
            <CategoryTagsCard
              key={`category-tags-${dataKey}`}
              onValidationChange={(isValid) =>
                handleValidationChange(1, isValid, "categoryTags")
              }
              onDataChange={handleCategoryChange}
              initialValues={categoryTagsData}
            />
            <ProductDescriptionCard
              key={`description-${dataKey}`}
              onValidationChange={(isValid) =>
                handleValidationChange(1, isValid, "productDescription")
              }
              onDataChange={handleProductDescriptionChange}
              initialValues={productDescriptionData}
            />
            <ProductImagesCard
              key={`images-${dataKey}`}
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
            <VariantFormCard
              key={`variants-${dataKey}`}
              productId={productId ? String(productId) : null}
              categoryId={selectedCategoryId}
              onDataChange={(data) => handleVariantDataChange(data)}
              onValidationChange={(isValid) =>
                handleValidationChange(2, isValid)
              }
              initialValues={{
                variants: variantData?.variants || [],
              }}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <VehicleForm
              key={`vehicle-${dataKey}`}
              onDataChange={handleVehicleDataChange}
              onValidationChange={(isValid) =>
                handleValidationChange(3, isValid)
              }
              initialData={vehicleData}
            />
            <ShippingInfoCard
              key={`shipping-${dataKey}`}
              productId={productId}
              onDataChange={handleShippingDataChange}
              onValidationChange={(isValid) =>
                handleValidationChange(3, isValid)
              }
              initialData={memoizedShippingData}
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
              shipping={{
                productId: productId,
                weight: String(memoizedShippingData.weight),
                length: String(memoizedShippingData.length),
                width: String(memoizedShippingData.width),
                height: String(memoizedShippingData.height),
                is_fragile: memoizedShippingData.is_fragile,
              }}
            />
          </div>
        );

      default:
        return null;
    }
  }, [
    currentStep,
    productId,
    selectedCategoryId,
    isEditMode,
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
    memoizedShippingData,
    vehicleData,
  ]);

  /* ------------------ Loading State ------------------ */
  if (isLoadingProduct && isEditMode) {
    return (
      <div className="max-w-7xl mx-auto mt-5 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-orange-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (isEditMode && !isDataLoaded) {
    return (
      <div className="max-w-7xl mx-auto mt-5 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-orange-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Preparing form...</p>
        </div>
      </div>
    );
  }

  if (productError && isEditMode) {
    return (
      <div className="max-w-7xl mx-auto mt-5">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">Error loading product data. Please try again.</p>
        </div>
      </div>
    );
  }

  /* ------------------ JSX ------------------ */
  return (
    <FormProvider {...formMethods}>
      <div className="max-w-7xl mx-auto mt-5">
        {/* Stepper Navigation */}
        <nav className="flex lg:items-center justify-center gap-4 md:gap-0 pb-4 mb-6" aria-label="Progress">
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
        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{message}</p>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{submitError}</p>
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
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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