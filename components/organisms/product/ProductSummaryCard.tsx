"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useGetVehicleTypesQuery,
  useGetVehicleBodyTypesQuery,
  useGetVehicleModelsQuery,
  useGetTagsQuery,
} from "@/features/sellerAttributes";
import { useGetCategoriesQuery } from "@/features/category";

/* ==================== Types ==================== */

interface VehicleData {
  year: string;
  type_id: string;
  model_id: string;
  body_type_id: string;
  is_main: boolean;
}

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

interface ProductSummaryCardProps {
  productId: number | null;
  productInfo?: {
    name: string;
    sku: string;
    manufacturer_name: string;
    priority: string;
    quality_type_id?: string;
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
    main_image_url?: string;
    images_url?: string[];
  };
  variants?: VariantCombination[];
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

/* ==================== Component ==================== */

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

  /* ---------- API Queries ---------- */
  const { data: vehicleTypesData } = useGetVehicleTypesQuery();
  const { data: bodyTypesData } = useGetVehicleBodyTypesQuery();
  const { data: modelsData } = useGetVehicleModelsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: tagsData } = useGetTagsQuery();

  /* ---------- Lookup Helpers ---------- */
  const getVehicleTypeName = (typeId: string): string => {
    const found = vehicleTypesData?.data?.find(
      (t: any) => String(t.id) === String(typeId)
    );
    return found?.name || `Type #${typeId}`;
  };

  const getModelName = (modelId: string): string => {
    const found = modelsData?.data?.find(
      (m: any) => String(m.id) === String(modelId)
    );
    return found?.name || `Model #${modelId}`;
  };

  const getBodyTypeName = (bodyTypeId: string): string => {
    const found = bodyTypesData?.data?.find(
      (b: any) => String(b.id) === String(bodyTypeId)
    );
    return found?.name || `Body #${bodyTypeId}`;
  };

  const getCategoryName = (categoryId: string): string => {
    if (!categoriesData?.data) return `Category #${categoryId}`;
    const found = categoriesData.data.find(
      (c: any) => String(c.id) === String(categoryId)
    );
    return found?.name || `Category #${categoryId}`;
  };

  const getSubCategoryName = (
    categoryId: string,
    subCategoryId: string
  ): string => {
    if (!categoriesData?.data) return `Sub-category #${subCategoryId}`;
    const category = categoriesData.data.find(
      (c: any) => String(c.id) === String(categoryId)
    );
    if (!category?.sub_categories) return `Sub-category #${subCategoryId}`;
    const sub = category.sub_categories.find(
      (sc: any) => String(sc.id) === String(subCategoryId)
    );
    return sub?.name || `Sub-category #${subCategoryId}`;
  };

  const getTagNames = (tagIds: number[]): string[] => {
    if (!tagsData?.data || !tagIds?.length) return [];
    return tagIds.map((id) => {
      const tag = tagsData.data.find((t: any) => t.id === id);
      return tag?.name || `Tag #${id}`;
    });
  };

  /* ---------- Derived Values ---------- */
  const categoryName = categoryTags?.category_id
    ? getCategoryName(categoryTags.category_id)
    : "N/A";

  const subCategoryName =
    categoryTags?.category_id && categoryTags?.sub_category_id
      ? getSubCategoryName(
          categoryTags.category_id,
          categoryTags.sub_category_id
        )
      : "N/A";

  const tagNames = categoryTags?.tags ? getTagNames(categoryTags.tags) : [];

  const mainVehicle = vehicles?.find((v) => v.is_main);
  const compatibilityVehicles = vehicles?.filter((v) => !v.is_main) || [];

  const mainVehicleInfo = mainVehicle
    ? `${getVehicleTypeName(mainVehicle.type_id)} — ${getModelName(
        mainVehicle.model_id
      )} (${mainVehicle.year})`
    : "Not specified";

  const dimensions = shipping
    ? `${shipping.length || 0} × ${shipping.width || 0} × ${
        shipping.height || 0
      }`
    : "N/A";

  const totalVariants = variants?.length || 0;
  const defaultVariant = variants?.find((v) => v.is_default) || variants?.[0];

  /* ---------- Render ---------- */
  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
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

          {/* ── 1. Basic Information ── */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="p-4 text-sm">
              <h4 className="font-bold mb-3 text-gray-800">
                {t("createproduct.productSummary.basicInfo.title")}
              </h4>

              <div className="space-y-1">
                <SummaryRow
                  label={t("createproduct.productSummary.basicInfo.name")}
                  value={productInfo?.name}
                />
                <SummaryRow
                  label={t("createproduct.productSummary.basicInfo.sku")}
                  value={productInfo?.sku}
                />
                <SummaryRow
                  label={t(
                    "createproduct.productSummary.basicInfo.manufacturer"
                  )}
                  value={productInfo?.manufacturer_name}
                />
                <SummaryRow
                  label="Priority"
                  value={productInfo?.priority}
                />
                {defaultVariant && (
                  <SummaryRow
                    label="Default Price"
                    value={
                      defaultVariant.selling_price
                        ? `${defaultVariant.selling_price}`
                        : undefined
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── 2. Category & Tags ── */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="p-4 text-sm">
              <h4 className="font-bold mb-3 text-gray-800">
                {t("createproduct.productSummary.categoryTags.title")}
              </h4>

              <div className="space-y-1">
                <SummaryRow
                  label={t(
                    "createproduct.productSummary.categoryTags.category"
                  )}
                  value={categoryName}
                />
                <SummaryRow label="Sub-category" value={subCategoryName} />
              </div>

              {tagNames.length > 0 && (
                <div className="mt-3">
                  <p className="text-[var(--theme-color-accent)] font-semibold mb-1">
                    {t("createproduct.productSummary.categoryTags.tags")}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tagNames.map((name, i) => (
                      <span
                        key={i}
                        className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── 3. Variants ── */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm md:col-span-2">
            <CardContent className="p-4 text-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-800">
                  {t(
                    "createproduct.productSummary.variantsCompatibility.title"
                  )}
                </h4>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">
                  {totalVariants}{" "}
                  {totalVariants === 1 ? "Variant" : "Variants"}
                </span>
              </div>

              {variants && variants.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {variants.map((variant, index) => (
                    <VariantCard
                      key={variant.id || index}
                      variant={variant}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic text-xs">
                  No variants added yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* ── 4. Shipping Information ── */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="p-4 text-sm">
              <h4 className="font-bold mb-3 text-gray-800">
                {t("createproduct.productSummary.shippingInfo.title")}
              </h4>

              <div className="space-y-1">
                <SummaryRow
                  label={t(
                    "createproduct.productSummary.shippingInfo.dimensions"
                  )}
                  value={dimensions}
                />
                <SummaryRow
                  label={t("createproduct.productSummary.shippingInfo.weight")}
                  value={
                    shipping?.weight ? `${shipping.weight} lbs` : undefined
                  }
                />
                <SummaryRow
                  label={t(
                    "createproduct.productSummary.shippingInfo.fragile"
                  )}
                  value={shipping?.is_fragile ? "Yes" : "No"}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── 5. Vehicle Compatibility ── */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="p-4 text-sm">
              <h4 className="font-bold mb-3 text-gray-800">
                {t(
                  "createproduct.productSummary.variantsCompatibility.mainVehicle"
                )}
              </h4>

              <SummaryRow label="Main Vehicle" value={mainVehicleInfo} />

              {compatibilityVehicles.length > 0 && (
                <div className="mt-3">
                  <p className="text-[var(--theme-color-accent)] font-semibold mb-1">
                    Compatible Vehicles ({compatibilityVehicles.length}):
                  </p>
                  <div className="space-y-1">
                    {compatibilityVehicles.map((vehicle, i) => (
                      <p key={i} className="text-xs text-gray-600">
                        •{" "}
                        <span className="font-medium">
                          {getVehicleTypeName(vehicle.type_id)}
                        </span>{" "}
                        — {getModelName(vehicle.model_id)}{" "}
                        {vehicle.body_type_id &&
                          `(${getBodyTypeName(vehicle.body_type_id)})`}{" "}
                        · {vehicle.year}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── 6. Description ── */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm md:col-span-2">
            <CardContent className="p-4 text-sm">
              <h4 className="font-bold mb-2 text-gray-800">Description</h4>
              <p className="text-gray-600 line-clamp-3">
                {description?.description || (
                  <span className="italic text-gray-400">
                    No description provided
                  </span>
                )}
              </p>
              {description?.details_info && (
                <p className="mt-2 text-xs text-gray-500">
                  <span className="font-semibold text-[var(--theme-color-accent)]">
                    Details:
                  </span>{" "}
                  {description.details_info.substring(0, 150)}
                  {description.details_info.length > 150 ? "…" : ""}
                </p>
              )}
            </CardContent>
          </Card>

          {/* ── 7. Images ── */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm md:col-span-2">
            <CardContent className="p-4 text-sm">
              <h4 className="font-bold mb-3 text-gray-800">Images</h4>
              <div className="flex gap-3 flex-wrap">
                {/* New file uploads */}
                {images?.main_image && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(images.main_image)}
                      alt="Main"
                      className="w-20 h-20 object-cover rounded border-2 border-orange-500"
                    />
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Main
                    </span>
                  </div>
                )}

                {images?.images?.map((img, i) => (
                  <img
                    key={`new-${i}`}
                    src={URL.createObjectURL(img)}
                    alt={`Product ${i + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}

                {/* Existing URLs (edit mode) */}
                {!images?.main_image && images?.main_image_url && (
                  <div className="relative">
                    <img
                      src={images.main_image_url}
                      alt="Main"
                      className="w-20 h-20 object-cover rounded border-2 border-orange-500"
                    />
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Main
                    </span>
                  </div>
                )}

                {!images?.images?.length &&
                  images?.images_url?.map((url, i) => (
                    <img
                      key={`url-${i}`}
                      src={url}
                      alt={`Product ${i + 1}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}

                {!images?.main_image &&
                  !images?.main_image_url &&
                  !images?.images?.length &&
                  !images?.images_url?.length && (
                    <p className="text-gray-400 italic text-xs">
                      No images uploaded
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>

        </div>
      </CardContent>
    </Card>
  );
};

/* ==================== Sub-components ==================== */

/** Simple label: value row */
const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <p className="text-xs text-gray-700">
    <span className="font-semibold text-[var(--theme-color-accent)]">
      {label}:
    </span>{" "}
    <span>{value ?? "N/A"}</span>
  </p>
);

/** Single variant card */
const VariantCard = ({
  variant,
  index,
}: {
  variant: VariantCombination;
  index: number;
}) => {
  const hasCombinations =
    variant.combinations && Object.keys(variant.combinations).length > 0;

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm text-xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-semibold text-gray-800 leading-snug">
          {variant.variant_name || `Variant ${index + 1}`}
        </p>
        <div className="flex gap-1 flex-shrink-0">
          {variant.is_default && (
            <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded font-medium">
              Default
            </span>
          )}
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
              variant.status === 1
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {variant.status === 1 ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Attribute Combination Badges */}
      {hasCombinations && (
        <div className="flex flex-wrap gap-1 mb-2">
          {Object.entries(variant.combinations).map(([attrName, attrVal]) => (
            <span
              key={attrName}
              className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded border border-blue-100"
            >
              {attrName}: {attrVal.value}
            </span>
          ))}
        </div>
      )}

      {/* Pricing */}
      <div className="grid grid-cols-3 gap-x-2 gap-y-1 border-t border-gray-100 pt-2">
        <div>
          <p className="text-[10px] text-gray-400">Cost</p>
          <p className="font-medium text-gray-700">
            {variant.cost_price || "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400">Selling</p>
          <p className="font-medium text-gray-700">
            {variant.selling_price || "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400">Discount</p>
          <p className="font-medium text-gray-700">
            {variant.discount_price || "—"}
          </p>
        </div>
      </div>

      {/* Stock */}
      <div className="mt-2 border-t border-gray-100 pt-2 flex items-center justify-between">
        <p className="text-gray-500">
          Stock:{" "}
          <span className="font-semibold text-gray-700">
            {variant.stock_quantity} units
          </span>
        </p>
        {variant.attribute_value_ids?.length > 0 && (
          <p className="text-[10px] text-gray-400">
            IDs: [{variant.attribute_value_ids.join(", ")}]
          </p>
        )}
      </div>
    </div>
  );
};