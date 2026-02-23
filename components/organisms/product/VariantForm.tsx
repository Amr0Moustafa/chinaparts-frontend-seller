"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InputField } from "@/components/atoms/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Copy, Search, AlertCircle, Trash2, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useGetCategoriesQuery } from "@/features/category";
import {
  useGetVariantsQuery,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useCreateVariantMutation,
} from "@/features/variants";

/* ==================== Types ==================== */

interface AttributeValue {
  id: number;
  value: string;
}

interface Attribute {
  id: number;
  name: string;
  values: AttributeValue[];
}

interface VariationType {
  id: number;
  name: string;
  selectedValues: number[];
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

interface BulkPriceForm {
  costPrice: string;
  sellingPrice: string;
  discountPrice: string;
  quantity: string;
}

interface VariantCardProps {
  productId: string | null;
  categoryId: number | null;
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: any) => void;
  initialValues?: {
    variationTypes?: VariationType[];
    variants?: VariantCombination[];
  };
}

/* ==================== Helpers ==================== */

const generateCombinations = (
  types: VariationType[],
  attributes: Attribute[]
): Array<{
  valuesByName: { [key: string]: { id: number; value: string } };
  valueIds: number[];
}> => {
  if (types.length === 0) return [];

  const generate = (
    index: number,
    currentValuesByName: { [key: string]: { id: number; value: string } },
    currentValueIds: number[]
  ): Array<{
    valuesByName: { [key: string]: { id: number; value: string } };
    valueIds: number[];
  }> => {
    if (index === types.length)
      return [{ valuesByName: { ...currentValuesByName }, valueIds: [...currentValueIds] }];

    const type = types[index];
    const attribute = attributes.find((a) => a.id === type.id);
    if (!attribute) return [];

    return type.selectedValues.flatMap((valueId) => {
      const attributeValue = attribute.values.find((v) => v.id === valueId);
      if (!attributeValue) return [];
      return generate(
        index + 1,
        { ...currentValuesByName, [attribute.name]: { id: valueId, value: attributeValue.value } },
        [...currentValueIds, valueId]
      );
    });
  };

  return generate(0, {}, []);
};

/* ==================== Spinner ==================== */

const Spinner = ({ className = "h-3 w-3" }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/* ==================== Component ==================== */

export default function VariantFormCard({
  productId,
  categoryId,
  onValidationChange,
  onDataChange,
  initialValues,
}: VariantCardProps) {
  const { t } = useTranslation();
  const isEditMode = !!productId;

  /* ── Bulk price form ── */
  const priceForm = useForm<BulkPriceForm>({
    defaultValues: { costPrice: "", sellingPrice: "", discountPrice: "", quantity: "" },
  });

  /* ── UI state ── */
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [debugMode, setDebugMode] = useState(false);
  const [hasLoadedVariants, setHasLoadedVariants] = useState(false);
  const isInitializingRef = useRef(false);

  /* ── Per-row loading state ── */
  const [updatingVariants, setUpdatingVariants] = useState<Set<string>>(new Set());
  const [deletingVariants, setDeletingVariants] = useState<Set<string>>(new Set());
  const [savingNewVariants, setSavingNewVariants] = useState<Set<string>>(new Set());

  /* ── Search ── */
  const [attributeSearchQueries, setAttributeSearchQueries] = useState<{ [key: number]: string }>({});

  /* ── Core data state ── */
  const [variationTypes, setVariationTypes] = useState<VariationType[]>(
    initialValues?.variationTypes || []
  );
  const [variants, setVariants] = useState<VariantCombination[]>(
    initialValues?.variants || []
  );

  /* ── API ── */
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  const {
    data: existingVariants,
    isLoading: isFetchingVariants,
    error: variantsError,
  } = useGetVariantsQuery(
    { productId: String(productId) },
    { skip: !productId, refetchOnMountOrArgChange: true }
  );

  const [updateVariant] = useUpdateVariantMutation();
  const [deleteVariant] = useDeleteVariantMutation();
  const [createVariant] = useCreateVariantMutation();

  /* ── Attributes from selected category ── */
  const availableAttributes: Attribute[] = useMemo(() => {
    if (!categoriesData?.data || !categoryId) return [];
    const findCategory = (categories: any[]): any => {
      for (const cat of categories) {
        if (cat.id === categoryId) return cat;
        if (cat.sub_categories) {
          const found = findCategory(cat.sub_categories);
          if (found) return found;
        }
      }
      return null;
    };
    const selectedCategory = findCategory(categoriesData.data);
    return selectedCategory?.attributes || [];
  }, [categoriesData, categoryId]);

  /* ── Load variants from API (edit mode) ── */
  useEffect(() => {
    if (hasLoadedVariants) return;
    if (!availableAttributes || availableAttributes.length === 0) return;
    if (!existingVariants?.data || !Array.isArray(existingVariants.data)) return;
    if (!productId) return;

    if (existingVariants.data.length === 0) {
      setHasLoadedVariants(true);
      return;
    }

    try {
      isInitializingRef.current = true;

      const transformedVariants: VariantCombination[] = existingVariants.data.map((v: any) => {
        const combinations: { [key: string]: { id: number; value: string } } = {};
        const attribute_value_ids: number[] = [];

        if (v.attributes && Array.isArray(v.attributes)) {
          v.attributes.forEach((attr: any) => {
            combinations[attr.attribute_name] = { id: attr.id, value: attr.value };
            attribute_value_ids.push(attr.id);
          });
        }

        return {
          id: String(v.id),
          combinations,
          attribute_value_ids,
          variant_name: v.variant_name || "",
          cost_price: String(v.cost_price || ""),
          selling_price: String(v.selling_price || ""),
          discount_price: String(v.discount_price || ""),
          stock_quantity: Number(v.stock_quantity || 0),
          is_default: Boolean(v.is_default),
          status: Number(v.status ?? 1),
        };
      });

      /* Reconstruct variationTypes from loaded variant data */
      if (transformedVariants.length > 0 && availableAttributes.length > 0) {
        const attributeValueMap: { [attributeId: number]: Set<number> } = {};

        transformedVariants.forEach((variant) => {
          Object.keys(variant.combinations).forEach((attributeName) => {
            const attribute = availableAttributes.find((attr) => attr.name === attributeName);
            if (attribute) {
              if (!attributeValueMap[attribute.id]) {
                attributeValueMap[attribute.id] = new Set();
              }
              attributeValueMap[attribute.id].add(variant.combinations[attributeName].id);
            }
          });
        });

        const extractedVariationTypes: VariationType[] = Object.keys(attributeValueMap).map(
          (attributeIdStr) => {
            const attributeId = Number(attributeIdStr);
            const attribute = availableAttributes.find((attr) => attr.id === attributeId)!;
            return {
              id: attributeId,
              name: attribute.name,
              selectedValues: Array.from(attributeValueMap[attributeId]),
            };
          }
        );

        setVariationTypes(extractedVariationTypes);
      }

      setVariants(transformedVariants);
      setHasLoadedVariants(true);

      setTimeout(() => {
        isInitializingRef.current = false;
      }, 100);
    } catch (error) {
      console.error("❌ Error loading variants:", error);
      isInitializingRef.current = false;
    }
  }, [existingVariants, hasLoadedVariants, productId, availableAttributes]);

  /* ── Load initial values (create mode) ── */
  useEffect(() => {
    if (initialValues && !hasLoadedVariants && !productId) {
      if (initialValues.variationTypes) setVariationTypes(initialValues.variationTypes);
      if (initialValues.variants) setVariants(initialValues.variants);
    }
  }, [initialValues, hasLoadedVariants, productId]);

  /* ── Generate combinations — CREATE mode only ── */
  useEffect(() => {
    if (isEditMode) return; // ✅ Never runs in edit mode
    if (hasLoadedVariants) return;

    if (
      variationTypes.length > 0 &&
      variationTypes.every((vt) => vt.selectedValues.length > 0)
    ) {
      const combinations = generateCombinations(variationTypes, availableAttributes);
      setVariants(
        combinations.map((combo) => ({
          id: Math.random().toString(36).substr(2, 9),
          combinations: combo.valuesByName,
          attribute_value_ids: combo.valueIds,
          variant_name: Object.values(combo.valuesByName).map((v) => v.value).join(" - "),
          cost_price: "",
          selling_price: "",
          discount_price: "",
          stock_quantity: 0,
          is_default: false,
          status: 1,
        }))
      );
    } else {
      setVariants([]);
    }
  }, [variationTypes, availableAttributes, hasLoadedVariants, isEditMode]);

  /* ── Notify parent ── */
  useEffect(() => {
    if (isInitializingRef.current) return;
    if (!isEditMode && !variationTypes.length && !variants.length) return;

    onDataChange?.({ variants, variation_types: variationTypes });

    const isValid =
      variationTypes.length > 0 &&
      variationTypes.every((vt) => vt.selectedValues.length > 0) &&
      variants.length > 0 &&
      variants.every(
        (v) => v.selling_price && parseFloat(v.selling_price) > 0 && v.stock_quantity >= 0
      );
    onValidationChange?.(isValid);
  }, [variationTypes, variants, isEditMode, onDataChange, onValidationChange]);

  /* ==================== Helpers ==================== */

  const getFilteredAttributeValues = (attributeId: number) => {
    const attribute = availableAttributes.find((attr) => attr.id === attributeId);
    if (!attribute) return [];
    const q = attributeSearchQueries[attributeId]?.toLowerCase() || "";
    return q ? attribute.values.filter((v) => v.value.toLowerCase().includes(q)) : attribute.values;
  };

  const getSelectedAttributeValues = (attributeId: number) => {
    const vt = variationTypes.find((v) => v.id === attributeId);
    const attr = availableAttributes.find((a) => a.id === attributeId);
    if (!vt || !attr) return [];
    return vt.selectedValues
      .map((id) => attr.values.find((v) => v.id === id))
      .filter(Boolean) as AttributeValue[];
  };

  const isExistingVariant = (variantId: string): boolean => !variantId.startsWith("new_");

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  /* ==================== Attribute Handlers ==================== */

  /**
   * Toggle entire attribute checkbox.
   * ✅ No setHasLoadedVariants(false) — never wipes loaded data in edit mode.
   */
  const handleToggleAttribute = (attributeId: number) => {
    const exists = variationTypes.find((vt) => vt.id === attributeId);
    if (exists) {
      setVariationTypes((prev) => prev.filter((vt) => vt.id !== attributeId));
      setAttributeSearchQueries((prev) => {
        const next = { ...prev };
        delete next[attributeId];
        return next;
      });
    } else {
      const attribute = availableAttributes.find((a) => a.id === attributeId);
      if (attribute) {
        setVariationTypes((prev) => [
          ...prev,
          { id: attributeId, name: attribute.name, selectedValues: [] },
        ]);
      }
    }
  };

  /**
   * Toggle a specific attribute value.
   *
   * CREATE mode → marks hasLoadedVariants=false → generate effect re-runs.
   *
   * EDIT mode:
   *   ADDING   → appends new combination rows (preserves all existing data)
   *   REMOVING → filters out rows that used that value
   */
  const handleToggleAttributeValue = (attributeId: number, valueId: number) => {
    const currentType = variationTypes.find((vt) => vt.id === attributeId);
    const isAdding = !currentType?.selectedValues.includes(valueId);

    // 1. Update variationTypes selected values
    setVariationTypes((prev) =>
      prev.map((vt) => {
        if (vt.id !== attributeId) return vt;
        return {
          ...vt,
          selectedValues: isAdding
            ? [...vt.selectedValues, valueId]
            : vt.selectedValues.filter((id) => id !== valueId),
        };
      })
    );

    if (isEditMode) {
      const attribute = availableAttributes.find((a) => a.id === attributeId);
      if (!attribute) return;

      if (isAdding) {
        // ── Append new rows for the newly selected value ──
        const addedValue = attribute.values.find((v) => v.id === valueId);
        if (!addedValue) return;

        // Other attribute types (not the one being toggled)
        const otherTypes = variationTypes.filter((vt) => vt.id !== attributeId);

        let newRows: VariantCombination[] = [];

        if (otherTypes.length === 0) {
          // Single attribute — one new row
          newRows = [
            {
              id: `new_${Math.random().toString(36).substr(2, 9)}`,
              combinations: {
                [attribute.name]: { id: valueId, value: addedValue.value },
              },
              attribute_value_ids: [valueId],
              variant_name: addedValue.value,
              cost_price: "",
              selling_price: "",
              discount_price: "",
              stock_quantity: 0,
              is_default: false,
              status: 1,
            },
          ];
        } else {
          // Multiple attributes — cross new value with all existing combos
          const otherCombos = generateCombinations(otherTypes, availableAttributes);

          newRows = otherCombos.map((combo) => {
            const allCombinations = {
              ...combo.valuesByName,
              [attribute.name]: { id: valueId, value: addedValue.value },
            };
            const allValueIds = [...combo.valueIds, valueId];

            return {
              id: `new_${Math.random().toString(36).substr(2, 9)}`,
              combinations: allCombinations,
              attribute_value_ids: allValueIds,
              variant_name: Object.values(allCombinations).map((v) => v.value).join(" - "),
              cost_price: "",
              selling_price: "",
              discount_price: "",
              stock_quantity: 0,
              is_default: false,
              status: 1,
            };
          });
        }

        // Append only truly new combinations (dedup by sorted value-id key)
        setVariants((prevVariants) => {
          const existingKeys = new Set(
            prevVariants.map((v) =>
              JSON.stringify(
                Object.values(v.combinations).map((c) => c.id).sort()
              )
            )
          );

          const uniqueNewRows = newRows.filter((row) => {
            const key = JSON.stringify(
              Object.values(row.combinations).map((c) => c.id).sort()
            );
            return !existingKeys.has(key);
          });

          return [...prevVariants, ...uniqueNewRows];
        });
      } else {
        // ── Remove rows that used this deselected value ──
        setVariants((prevVariants) =>
          prevVariants.filter((v) => {
            const combo = v.combinations[attribute.name];
            return !combo || combo.id !== valueId;
          })
        );
      }
    } else {
      // Create mode — let generate effect handle it
      setHasLoadedVariants(false);
    }
  };

  /** Remove badge = same as deselecting the value */
  const handleRemoveAttributeValue = (attributeId: number, valueId: number) => {
    handleToggleAttributeValue(attributeId, valueId);
  };

  const handleAttributeSearch = (attributeId: number, query: string) => {
    setAttributeSearchQueries((prev) => ({ ...prev, [attributeId]: query }));
  };

  /* ==================== Variant Field Handlers ==================== */

  const handleUpdateVariant = (
    variantId: string,
    field: keyof VariantCombination,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((variant) => {
        if (field === "is_default" && value === true) {
          return variant.id === variantId
            ? { ...variant, [field]: value }
            : { ...variant, is_default: false };
        }
        return variant.id === variantId ? { ...variant, [field]: value } : variant;
      })
    );
  };

  const handleApplyFieldToAll = (field: keyof VariantCombination, sourceVariantId: string) => {
    const sourceVariant = variants.find((v) => v.id === sourceVariantId);
    if (!sourceVariant) return;
    const value = sourceVariant[field];
    setVariants((prev) => prev.map((v) => ({ ...v, [field]: value })));
    showSuccessToast(`"${String(field)}" applied to all variants`);
  };

  /* ==================== Bulk Price Handler ==================== */

  const handleApplyPriceToAll = () => {
    const { costPrice, sellingPrice, discountPrice, quantity } = priceForm.getValues();
    const hasAnyValue = [costPrice, sellingPrice, discountPrice, quantity].some((v) => v !== "");
    if (!hasAnyValue) return;

    setIsApplying(true);
    setVariants((prev) =>
      prev.map((variant) => ({
        ...variant,
        ...(costPrice !== "" && { cost_price: costPrice }),
        ...(sellingPrice !== "" && { selling_price: sellingPrice }),
        ...(discountPrice !== "" && { discount_price: discountPrice }),
        ...(quantity !== "" && { stock_quantity: parseInt(quantity) || 0 }),
      }))
    );
    showSuccessToast("Prices applied to all variants!");
    setTimeout(() => setIsApplying(false), 500);
  };

  const handleClearBulkForm = () => {
    priceForm.reset({ costPrice: "", sellingPrice: "", discountPrice: "", quantity: "" });
  };

  /* ==================== API Handlers ==================== */

  /** Update an already-saved variant */
  const handleSaveVariant = async (variantId: string) => {
    if (!productId) return;
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) return;

    setUpdatingVariants((prev) => new Set(prev).add(variantId));
    try {
      await updateVariant({
        productId: String(productId),
        variantId,
        data: {
          attribute_value_ids: variant.attribute_value_ids,
          variant_name: variant.variant_name,
          cost_price: parseFloat(variant.cost_price) || 0,
          selling_price: parseFloat(variant.selling_price) || 0,
          discount_price: parseFloat(variant.discount_price) || 0,
          stock_quantity: variant.stock_quantity,
          is_default: variant.is_default,
          status: variant.status,
        },
      }).unwrap();
      showSuccessToast("Variant saved!");
    } catch (error) {
      console.error(`❌ Error updating variant ${variantId}:`, error);
      alert(`Failed to update variant: ${error}`);
    } finally {
      setUpdatingVariants((prev) => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
    }
  };

  /** Create a new (unsaved new_ row) via API */
  const handleCreateNewVariant = async (variantId: string) => {
    if (!productId) return;
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) return;

    setSavingNewVariants((prev) => new Set(prev).add(variantId));
    try {
      const response = await createVariant({
        productId: String(productId),
        data: {
          attribute_value_ids: variant.attribute_value_ids,
          variant_name: variant.variant_name,
          cost_price: parseFloat(variant.cost_price) || 0,
          selling_price: parseFloat(variant.selling_price) || 0,
          discount_price: parseFloat(variant.discount_price) || 0,
          stock_quantity: variant.stock_quantity,
          is_default: variant.is_default,
          status: variant.status,
        },
      }).unwrap();

      // Replace temp id with real server id
      const newId = String(response?.data?.id || variantId);
      setVariants((prev) =>
        prev.map((v) => (v.id === variantId ? { ...v, id: newId } : v))
      );
      showSuccessToast("New variant created!");
    } catch (error) {
      console.error(`❌ Error creating variant:`, error);
      alert(`Failed to create variant: ${error}`);
    } finally {
      setSavingNewVariants((prev) => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
    }
  };

  /** Delete variant (API call if existing, local-only if new_) */
  const handleDeleteVariant = async (variantId: string) => {
    const existing = isExistingVariant(variantId);

    if (existing) {
      if (!productId) return;
      if (!confirm("Are you sure you want to delete this variant?")) return;

      setDeletingVariants((prev) => new Set(prev).add(variantId));
      try {
        await deleteVariant({ productId: String(productId), variantId }).unwrap();

        const remaining = variants.filter((v) => v.id !== variantId);
        setVariants(remaining);

        // Clean up variationTypes selected values if no remaining variant uses them
        setVariationTypes((prev) =>
          prev.map((vt) => {
            const attribute = availableAttributes.find((a) => a.id === vt.id);
            if (!attribute) return vt;
            const usedValueIds = new Set(
              remaining.map((v) => v.combinations[attribute.name]?.id).filter(Boolean)
            );
            return {
              ...vt,
              selectedValues: vt.selectedValues.filter((id) => usedValueIds.has(id)),
            };
          })
        );

        showSuccessToast("Variant deleted.");
      } catch (error) {
        console.error(`❌ Error deleting variant ${variantId}:`, error);
        alert(`Failed to delete variant: ${error}`);
      } finally {
        setDeletingVariants((prev) => {
          const next = new Set(prev);
          next.delete(variantId);
          return next;
        });
      }
    } else {
      // Unsaved row — just remove from local state
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
    }
  };

  /* ==================== Guards ==================== */

  if (isCategoriesLoading || isFetchingVariants) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="py-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="h-8 w-8 text-orange-500" />
            <p className="text-gray-500">
              {isFetchingVariants ? "Loading variants..." : "Loading attributes..."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!categoryId) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Please select a category first</p>
        </CardContent>
      </Card>
    );
  }

  if (availableAttributes.length === 0) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No attributes available for this category</p>
        </CardContent>
      </Card>
    );
  }

  /* ==================== Render ==================== */

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">

      {/* ── Header ── */}
      <CardHeader className="border-b border-gray-200 pb-4">
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs">◆</span>
            </div>
            <h5 className="font-semibold text-base">Choose Variation Attributes:</h5>
          </div>
          <div className="flex items-center gap-2">
            {hasLoadedVariants && variants.length > 0 && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                ✓ {variants.length} variant(s) loaded
              </span>
            )}
            <button
              type="button"
              onClick={() => setDebugMode(!debugMode)}
              className="p-1 text-gray-400 hover:text-gray-700 rounded"
              title="Toggle debug"
            >
              <AlertCircle className="w-4 h-4" />
            </button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">

        {/* ── Debug Panel ── */}
        {debugMode && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-1 text-xs">
            <p className="font-semibold text-blue-900">🔍 Debug Info</p>
            <p><b>Mode:</b> {isEditMode ? "Edit" : "Create"}</p>
            <p><b>Product ID:</b> {productId || "None"}</p>
            <p><b>Category ID:</b> {categoryId || "None"}</p>
            <p><b>Has Loaded Variants:</b> {hasLoadedVariants ? "Yes" : "No"}</p>
            <p><b>Variation Types:</b> {variationTypes.length}</p>
            <p><b>Variants:</b> {variants.length}</p>
            <p><b>Available Attributes:</b> {availableAttributes.length}</p>
          </div>
        )}

        {/* ── Error Banner ── */}
        {variantsError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-900">❌ Error loading variants</p>
          </div>
        )}

        {/* ── Success Toast ── */}
        {showSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-semibold text-green-800">✅ {successMessage}</p>
          </div>
        )}

        {/* ── Attribute Checkboxes ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {availableAttributes.map((attribute) => {
            const isSelected = variationTypes.some((vt) => vt.id === attribute.id);
            return (
              <label key={attribute.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleAttribute(attribute.id)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {attribute.name}
                </span>
              </label>
            );
          })}
        </div>

        {/* ── Value Selectors ── */}
        {variationTypes.length > 0 && (
          <div className="space-y-6 border-t border-gray-200 pt-6">
            <h6 className="font-semibold text-sm text-gray-900">
              Select values for each attribute:
            </h6>

            {variationTypes.map((variationType) => {
              const attribute = availableAttributes.find((a) => a.id === variationType.id);
              if (!attribute) return null;

              const selectedValues = getSelectedAttributeValues(variationType.id);
              const filteredValues = getFilteredAttributeValues(variationType.id);
              const searchQuery = attributeSearchQueries[variationType.id] || "";

              return (
                <div key={variationType.id} className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {attribute.name}
                  </Label>

                  {/* Selected value badges */}
                  {selectedValues.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-orange-50 rounded-md border border-orange-200">
                      {selectedValues.map((value) => (
                        <span
                          key={value.id}
                          className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {value.value}
                          <X
                            className="w-4 h-4 cursor-pointer hover:bg-orange-600 rounded-full p-0.5"
                            onClick={() => handleRemoveAttributeValue(variationType.id, value.id)}
                          />
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => handleAttributeSearch(variationType.id, e.target.value)}
                      placeholder={`Search ${attribute.name.toLowerCase()}...`}
                      className="pl-10"
                    />
                  </div>

                  {/* Value grid */}
                  <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto bg-gray-50">
                    {filteredValues.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        {searchQuery
                          ? `No ${attribute.name.toLowerCase()} found`
                          : `No ${attribute.name.toLowerCase()} available`}
                      </div>
                    ) : (
                      <div className="grid grid-cols-7 gap-2 p-3">
                        {filteredValues.map((value) => {
                          const isValueSelected = variationType.selectedValues.includes(value.id);
                          return (
                            <button
                              key={value.id}
                              type="button"
                              onClick={() => handleToggleAttributeValue(variationType.id, value.id)}
                              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                                isValueSelected
                                  ? "bg-orange-500 text-white hover:bg-orange-600"
                                  : "bg-white text-gray-700 border border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                              }`}
                            >
                              {value.value}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {selectedValues.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {selectedValues.length} value(s) selected
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Bulk Price Setter ── */}
        {variants.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h6 className="font-semibold text-sm flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs">◆</span>
                </div>
                Set Price for All Variants
              </h6>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleClearBulkForm}
                  variant="outline"
                  className="text-gray-700 text-xs px-4 py-1.5 rounded border-gray-300"
                >
                  Clear Form
                </Button>
                <Button
                  type="button"
                  onClick={handleApplyPriceToAll}
                  disabled={isApplying}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-1.5 rounded disabled:opacity-50"
                >
                  {isApplying ? (
                    <span className="flex items-center gap-1">
                      <Spinner />
                      Applying...
                    </span>
                  ) : (
                    "Apply to All"
                  )}
                </Button>
              </div>
            </div>

            <FormProvider {...priceForm}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-white p-4 rounded-md">
                <div className="space-y-3">
                  <p className="text-gray-600 text-xs mb-3">
                    Pricing ({variants.length} variants)
                  </p>
                  {[
                    { label: "Cost Price", name: "costPrice", placeholder: "50.00" },
                    { label: "Selling Price", name: "sellingPrice", placeholder: "80.00" },
                    { label: "Discount Price", name: "discountPrice", placeholder: "70.00" },
                  ].map(({ label, name, placeholder }) => (
                    <div key={name} className="flex items-center gap-2">
                      <label className="min-w-[120px] text-xs text-gray-600">{label}</label>
                      <InputField
                        name={name}
                        placeholder={placeholder}
                        type="number"
                        step="0.01"
                        className="flex-1 text-sm h-8"
                      />
                      <span className="text-xs text-gray-500">$</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <label className="min-w-[120px] text-xs text-gray-600">Stock Quantity</label>
                    <InputField
                      name="quantity"
                      placeholder="25"
                      type="number"
                      className="flex-1 text-sm h-8"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 text-xs mb-3">Quick Info</p>
                  <div className="p-3 bg-orange-50 rounded-md border border-orange-200 space-y-2">
                    <p className="text-xs text-orange-800">
                      💡 Fill in prices and click <b>"Apply to All"</b> to set them on every variant.
                    </p>
                    <p className="text-xs text-orange-700">
                      Use <b>💾 Save</b> on each row to push individual changes to the server.
                    </p>
                    {isEditMode && (
                      <p className="text-xs text-orange-700">
                        Select a new size/color value above to add new variant rows automatically.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </FormProvider>
          </div>
        )}

        {/* ── Variants Table ── */}
        {variants.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Variant Name</th>
                    {variationTypes.map((type) => (
                      <th key={type.id} className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                        {type.name}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Cost Price</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Selling Price</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Discount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Stock</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Default</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {variants.map((variant, index) => {
                    if (!variant?.combinations) return null;

                    const isUpdating = updatingVariants.has(variant.id);
                    const isDeleting = deletingVariants.has(variant.id);
                    const isSavingNew = savingNewVariants.has(variant.id);
                    const existingOnServer = isExistingVariant(variant.id);

                    return (
                      <tr
                        key={`${variant.id}-${index}`}
                        className={`hover:bg-gray-50 transition-colors ${isDeleting ? "opacity-40" : ""} ${
                          !existingOnServer ? "bg-blue-50/40" : ""
                        }`}
                      >
                        {/* Variant Name */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={variant.variant_name}
                            onChange={(e) => handleUpdateVariant(variant.id, "variant_name", e.target.value)}
                            disabled={isDeleting}
                            placeholder="e.g. Red / XL"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
                          />
                        </td>

                        {/* Attribute value columns */}
                        {variationTypes.map((type) => (
                          <td key={type.id} className="px-4 py-3 text-gray-700 font-medium">
                            {variant.combinations?.[type.name]?.value || (
                              <span className="text-gray-300 italic">—</span>
                            )}
                          </td>
                        ))}

                        {/* Cost Price */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              value={variant.cost_price}
                              onChange={(e) => handleUpdateVariant(variant.id, "cost_price", e.target.value)}
                              disabled={isDeleting}
                              placeholder="50.00"
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyFieldToAll("cost_price", variant.id)}
                              disabled={isDeleting}
                              className="p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded disabled:opacity-50"
                              title="Apply to all"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Selling Price */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              value={variant.selling_price}
                              onChange={(e) => handleUpdateVariant(variant.id, "selling_price", e.target.value)}
                              disabled={isDeleting}
                              placeholder="80.00"
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyFieldToAll("selling_price", variant.id)}
                              disabled={isDeleting}
                              className="p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded disabled:opacity-50"
                              title="Apply to all"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Discount Price */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              value={variant.discount_price}
                              onChange={(e) => handleUpdateVariant(variant.id, "discount_price", e.target.value)}
                              disabled={isDeleting}
                              placeholder="70.00"
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
                            />
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={0}
                            value={variant.stock_quantity}
                            onChange={(e) =>
                              handleUpdateVariant(variant.id, "stock_quantity", parseInt(e.target.value) || 0)
                            }
                            disabled={isDeleting}
                            placeholder="25"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
                          />
                        </td>

                        {/* Default */}
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={variant.is_default}
                            onChange={(e) => handleUpdateVariant(variant.id, "is_default", e.target.checked)}
                            disabled={isDeleting}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 disabled:opacity-50"
                          />
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <select
                            value={variant.status}
                            onChange={(e) => handleUpdateVariant(variant.id, "status", parseInt(e.target.value))}
                            disabled={isDeleting}
                            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
                          >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {/* 💾 Save existing variant */}
                            {isEditMode && existingOnServer && (
                              <button
                                type="button"
                                onClick={() => handleSaveVariant(variant.id)}
                                disabled={isUpdating || isDeleting}
                                className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Save changes"
                              >
                                {isUpdating ? <Spinner /> : <Save className="w-3 h-3" />}
                              </button>
                            )}

                            {/* ➕ Create new (unsaved) variant via API */}
                            {isEditMode && !existingOnServer && (
                              <button
                                type="button"
                                onClick={() => handleCreateNewVariant(variant.id)}
                                disabled={isSavingNew || isDeleting}
                                className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Save new variant to server"
                              >
                                {isSavingNew ? <Spinner /> : <Plus className="w-3 h-3" />}
                              </button>
                            )}

                            {/* 🗑️ Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteVariant(variant.id)}
                              disabled={isUpdating || isDeleting || isSavingNew}
                              className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                              title={existingOnServer ? "Delete variant" : "Remove row"}
                            >
                              {isDeleting ? <Spinner /> : <Trash2 className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="flex items-center justify-end px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                {variants.length} variant(s) total
                {variants.filter((v) => !isExistingVariant(v.id)).length > 0 && (
                  <span className="ml-2 text-blue-600 font-medium">
                    ({variants.filter((v) => !isExistingVariant(v.id)).length} unsaved — click ➕ to save)
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {variants.length === 0 && variationTypes.length > 0 && (
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 text-sm">
              Select values for each attribute above to generate variants.
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  );
}