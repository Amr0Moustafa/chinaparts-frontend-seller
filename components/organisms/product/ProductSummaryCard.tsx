"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useGetBrandsQuery,
  useGetVehicleTypesQuery,
  useGetVehicleBodyTypesQuery,
  useGetVehicleModelsQuery,
  useGetTagsQuery,
} from "@/features/sellerAttributes";
import { useGetCategoriesQuery } from "@/features/category";

interface VehicleData {
  year: string;
  type_id: string;
  model_id: string;
  body_type_id: string;
  is_main: boolean;
}

interface ProductSummaryCardProps {
  productId: number | null;
  productInfo?: {
    name: string;
    sku: string;
    manufacturer_name: string;
    priority: string;
  };
  categoryTags?: {
    category_id: string;
    sub_category_id: string;
    tags: number[];
  };
  description?: {
    description: string;
    details_info: string;
    shipping_info: string;
    return_info: string;
  };
  images?: {
    main_image: File | null;
    images: File[];
  };
  variants?: {
    productId: number | null;
    variants: Array<{
      id: number;
      type: string;
      value: string;
      price: string;
      quantity: number;
    }>;
  };
  shipping?: {
    productId: number | null;
    weight: string;
    length: string;
    width: string;
    height: string;
    is_fragile: boolean;
  };
  vehicles?: VehicleData[];
}

export const ProductSummaryCard = ({
  productId,
  productInfo,
  categoryTags,
  description,
  images,
  variants,
  shipping,
  vehicles,
}: ProductSummaryCardProps) => {
  const { t } = useTranslation();

  // Fetch vehicle attributes for name lookups
  const { data: brandsData } = useGetBrandsQuery();
  const { data: vehicleTypesData } = useGetVehicleTypesQuery();
  const { data: bodyTypesData } = useGetVehicleBodyTypesQuery();
  const { data: modelsData } = useGetVehicleModelsQuery();
  
  // Fetch categories and tags for name lookups
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: tagsData } = useGetTagsQuery();

  // Helper functions for vehicle attributes
  const getVehicleTypeName = (typeId: string): string => {
    const type = vehicleTypesData?.data?.find(
      (t) => String(t.id) === String(typeId)
    );
    return type?.name || `Type ID: ${typeId}`;
  };

  const getModelName = (modelId: string): string => {
    const model = modelsData?.data?.find(
      (m) => String(m.id) === String(modelId)
    );
    return model?.name || `Model ID: ${modelId}`;
  };

  const getBodyTypeName = (bodyTypeId: string): string => {
    const bodyType = bodyTypesData?.data?.find(
      (b) => String(b.id) === String(bodyTypeId)
    );
    return bodyType?.name || `Body Type ID: ${bodyTypeId}`;
  };

  // Helper function to get category name by ID
  const getCategoryName = (categoryId: string): string => {
    if (!categoriesData?.data) return `Category ID: ${categoryId}`;
    
    // Search through all categories
    const category = categoriesData.data.find(
      (c:any) => String(c.id) === String(categoryId)
    );
    return category?.name || `Category ID: ${categoryId}`;
  };

  // Helper function to get subcategory name by ID
  const getSubCategoryName = (categoryId: string, subCategoryId: string): string => {
    if (!categoriesData?.data) return `Sub-category ID: ${subCategoryId}`;
    
    // Find the parent category first
    const category = categoriesData.data.find(
      (c) => String(c.id) === String(categoryId)
    );
    
    if (!category?.sub_categories) return `Sub-category ID: ${subCategoryId}`;
    
    // Find the subcategory
    const subCategory = category.sub_categories.find(
      (sc) => String(sc.id) === String(subCategoryId)
    );
    
    return subCategory?.name || `Sub-category ID: ${subCategoryId}`;
  };

  // Helper function to get tag names by IDs
  const getTagNames = (tagIds: number[]): string[] => {
    if (!tagsData?.data || !tagIds || tagIds.length === 0) return [];
    
    return tagIds.map((tagId) => {
      const tag = tagsData.data.find((t) => t.id === tagId);
      return tag?.name || `Tag ID: ${tagId}`;
    });
  };

  // Calculate total variants
  const totalVariants = variants?.variants?.length || 0;

  // Extract main vehicle from vehicles array
  const mainVehicle = vehicles?.find((v) => v.is_main);
  const compatibilityVehicles = vehicles?.filter((v) => !v.is_main) || [];

  // Format main vehicle info with names
  const mainVehicleInfo = mainVehicle
    ? `${getVehicleTypeName(mainVehicle.type_id)} - ${getModelName(mainVehicle.model_id)} (${mainVehicle.year})`
    : "Not specified";

  // Format dimensions
  const dimensions = shipping
    ? `${shipping.length || 0}"×${shipping.width || 0}"×${shipping.height || 0}"`
    : "Not specified";

  // Get variant price (first variant or default)
  const variantPrice = variants?.variants?.[0]?.price || "N/A";

  // Get category and tag names
  const categoryName = categoryTags?.category_id
    ? getCategoryName(categoryTags.category_id)
    : "N/A";
  
  const subCategoryName = categoryTags?.category_id && categoryTags?.sub_category_id
    ? getSubCategoryName(categoryTags.category_id, categoryTags.sub_category_id)
    : "N/A";
  
  const tagNames = categoryTags?.tags ? getTagNames(categoryTags.tags) : [];

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Info className="text-orange-500" />
          <h5 className="font-bold">
            {t("createproduct.productSummary.title")}
          </h5>
          {productId && (
            <span className="text-xs text-gray-500 ml-2">
              (Product ID: {productId})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="p-4">
              <h4 className="font-bold mb-2">
                {t("createproduct.productSummary.basicInfo.title")}
              </h4>
              <p>
                <b className="text-[var(--theme-color-accent)]">
                  {t("createproduct.productSummary.basicInfo.name")}:
                </b>{" "}
                {productInfo?.name || "N/A"}
              </p>
              <p>
                <b className="text-[var(--theme-color-accent)]">
                  {t("createproduct.productSummary.basicInfo.sku")}:
                </b>{" "}
                {productInfo?.sku || "N/A"}
              </p>
              <p>
                <b className="text-[var(--theme-color-accent)]">
                  {t("createproduct.productSummary.basicInfo.manufacturer")}:
                </b>{" "}
                {productInfo?.manufacturer_name || "N/A"}
              </p>
              <p>
                <b className="text-[var(--theme-color-accent)]">
                  {t("createproduct.productSummary.basicInfo.price")}:
                </b>{" "}
                {variantPrice}
              </p>
              <p>
                <b className="text-[var(--theme-color-accent)]">Priority:</b>{" "}
                {productInfo?.priority || "N/A"}
              </p>
            </CardContent>
          </Card>

          {/* Variants & Compatibility */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="p-4 text-sm">
              <h4 className="font-bold mb-2">
                {t("createproduct.productSummary.variantsCompatibility.title")}
              </h4>

              <p>
                <b className="text-[var(--theme-color-accent)]">
                  {t(
                    "createproduct.productSummary.variantsCompatibility.variants"
                  )}
                  :
                </b>{" "}
                {totalVariants}
              </p>

              {variants?.variants && variants.variants.length > 0 && (
                <div className="mt-2 space-y-1">
                  {variants.variants.map((variant) => (
                    <p key={variant.id} className="text-xs text-gray-600">
                      • {variant.type}: {variant.value} - {variant.price} (Qty:{" "}
                      {variant.quantity})
                    </p>
                  ))}
                </div>
              )}

              <p className="mt-2">
                <b className="text-[var(--theme-color-accent)]">
                  {t(
                    "createproduct.productSummary.variantsCompatibility.mainVehicle"
                  )}
                  :
                </b>{" "}
                {mainVehicleInfo}
              </p>

              {compatibilityVehicles.length > 0 && (
                <div className="mt-2">
                  <b className="text-[var(--theme-color-accent)]">
                    Compatible Vehicles:
                  </b>
                  {compatibilityVehicles.map((vehicle, index) => (
                    <p key={index} className="text-xs text-gray-600 mt-1">
                      • {getVehicleTypeName(vehicle.type_id)} -{" "}
                      {getModelName(vehicle.model_id)} ({vehicle.year})
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="p-4 text-sm">
              <h4 className="font-bold mb-2">
                {t("createproduct.productSummary.shippingInfo.title")}
              </h4>
              <p>
                <b className="text-[var(--theme-color-accent)]">
                  {t("createproduct.productSummary.shippingInfo.dimensions")}:
                </b>{" "}
                {dimensions}
              </p>
              <p>
                <b className="text-[var(--theme-color-accent)]">
                  {t("createproduct.productSummary.shippingInfo.weight")}:
                </b>{" "}
                {shipping?.weight || "N/A"} lbs
              </p>
              <p>
                <b className="text-[var(--theme-color-accent)]">
                  {t("createproduct.productSummary.shippingInfo.fragile")}:
                </b>{" "}
                {shipping?.is_fragile ? "Yes" : "No"}
              </p>
            </CardContent>
          </Card>

          {/* Category & Tags Summary */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="p-4 text-sm">
              <h4 className="font-bold mb-2">
                {t("createproduct.productSummary.categoryTags.title")}
              </h4>
              <p>
                <b className="text-[var(--theme-color-accent)]">
                  {t("createproduct.productSummary.categoryTags.category")}:
                </b>{" "}
                {categoryName}
              </p>
              <p>
                <b className="text-[var(--theme-color-accent)]">
                  Sub-category:
                </b>{" "}
                {subCategoryName}
              </p>
              {tagNames.length > 0 && (
                <div className="mt-2">
                  <b className="text-[var(--theme-color-accent)]">
                    {t("createproduct.productSummary.categoryTags.tags")}:
                  </b>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tagNames.map((tagName, index) => (
                      <span
                        key={index}
                        className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded"
                      >
                        {tagName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description Summary */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm md:col-span-2">
            <CardContent className="p-4 text-sm">
              <h4 className="font-bold mb-2">Description</h4>
              <p className="text-gray-600 line-clamp-3">
                {description?.description || "No description provided"}
              </p>
              {description?.details_info && (
                <p className="mt-2 text-xs text-gray-500">
                  <b>Details:</b> {description.details_info.substring(0, 100)}
                  ...
                </p>
              )}
            </CardContent>
          </Card>

          {/* Images Summary */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm md:col-span-2">
            <CardContent className="p-4 text-sm">
              <h4 className="font-bold mb-2">Images</h4>
              <div className="flex gap-2 flex-wrap">
                {images?.main_image && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(images.main_image)}
                      alt="Main"
                      className="w-20 h-20 object-cover rounded border-2 border-orange-500"
                    />
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1 rounded">
                      Main
                    </span>
                  </div>
                )}
                {images?.images?.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Product ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
                {!images?.main_image && !images?.images?.length && (
                  <p className="text-gray-500">No images uploaded</p>
                )}
              </div>
            </CardContent>
          </Card>

         
          
        </div>
      </CardContent>
    </Card>
  );
};