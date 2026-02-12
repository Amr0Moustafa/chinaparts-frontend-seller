"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InputField } from "@/components/atoms/input";
import SelectField from "@/components/atoms/SelectField";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Plus, X, Copy, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useGetCategoriesQuery } from "@/features/category";

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
  selectedValues: number[]; // IDs of selected attribute values
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

interface VariantCardProps {
  productId: string | null;
  categoryId: number | null; // Category ID to fetch attributes
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: any) => void;
  initialValues?: {
    variationTypes?: VariationType[];
    variants?: VariantCombination[];
  };
}

export default function VariantFormCard({
  productId,
  categoryId,
  onValidationChange,
  onDataChange,
  initialValues,
}: VariantCardProps) {
  const { t } = useTranslation();
  const priceForm = useForm({
    defaultValues: {
      costPrice: "",
      sellingPrice: "",
      discountPrice: "",
      quantity: "",
    },
  });
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: categoriesData, isLoading } = useGetCategoriesQuery();

  const [variationTypes, setVariationTypes] = useState<VariationType[]>(
    initialValues?.variationTypes || []
  );
  const [variants, setVariants] = useState<VariantCombination[]>(
    initialValues?.variants || []
  );

  // Search states for each attribute
  const [attributeSearchQueries, setAttributeSearchQueries] = useState<{
    [key: number]: string;
  }>({});

  // Extract attributes based on selected category
  const availableAttributes: Attribute[] = useMemo(() => {
    if (!categoriesData?.data || !categoryId) return [];

    // Find the category (could be main category or sub-category)
    const findCategory = (categories: any[]): any => {
      for (const category of categories) {
        if (category.id === categoryId) {
          return category;
        }
        if (category.sub_categories) {
          const found = findCategory(category.sub_categories);
          if (found) return found;
        }
      }
      return null;
    };

    const selectedCategory = findCategory(categoriesData.data);
    return selectedCategory?.attributes || [];
  }, [categoriesData, categoryId]);

  // Get filtered values for an attribute based on search
  const getFilteredAttributeValues = (attributeId: number) => {
    const attribute = availableAttributes.find((attr) => attr.id === attributeId);
    if (!attribute) return [];

    const searchQuery = attributeSearchQueries[attributeId]?.toLowerCase() || "";
    if (!searchQuery) return attribute.values;

    return attribute.values.filter((value) =>
      value.value.toLowerCase().includes(searchQuery)
    );
  };

  // Get selected attribute values for display
  const getSelectedAttributeValues = (attributeId: number) => {
    const variationType = variationTypes.find((vt) => vt.id === attributeId);
    if (!variationType) return [];

    const attribute = availableAttributes.find((attr) => attr.id === attributeId);
    if (!attribute) return [];

    return variationType.selectedValues
      .map((valueId) => attribute.values.find((v) => v.id === valueId))
      .filter(Boolean) as AttributeValue[];
  };

  // Notify parent when data changes
  useEffect(() => {
    if (onDataChange) {
      // Format variants for API
      const formattedVariants = variants.map((variant) => ({
        attribute_value_ids: variant.attribute_value_ids,
        variant_name: variant.variant_name,
        cost_price: parseFloat(variant.cost_price) || 0,
        selling_price: parseFloat(variant.selling_price) || 0,
        discount_price: parseFloat(variant.discount_price) || 0,
        stock_quantity: variant.stock_quantity,
        is_default: variant.is_default,
        status: variant.status,
      }));

      onDataChange({
        product_id: productId,
        variation_types: variationTypes,
        variants: formattedVariants,
      });
    }

    if (onValidationChange) {
      const isValid =
        variationTypes.length > 0 &&
        variationTypes.every((vt) => vt.selectedValues.length > 0) &&
        variants.length > 0 &&
        variants.every(
          (v) =>
            v.selling_price &&
            parseFloat(v.selling_price) > 0 &&
            v.stock_quantity >= 0
        );
      onValidationChange(isValid);
    }
  }, [variationTypes, variants, productId, onDataChange, onValidationChange]);

  // Generate all possible variant combinations when variation types change
  useEffect(() => {
    if (
      variationTypes.length > 0 &&
      variationTypes.every((vt) => vt.selectedValues.length > 0)
    ) {
      console.log("🔄 Generating combinations for variation types:", variationTypes);
      
      const combinations = generateCombinations(variationTypes, availableAttributes);
      console.log("✅ Generated combinations:", combinations);
      
      const newVariants = combinations.map((combo) => {
        // Generate variant name from combination
        const variantName = Object.values(combo.valuesByName)
          .map((v) => v.value)
          .join(" - ");

        const newVariant = {
          id: Math.random().toString(36).substr(2, 9),
          combinations: combo.valuesByName,
          attribute_value_ids: combo.valueIds,
          variant_name: variantName,
          cost_price: "",
          selling_price: "",
          discount_price: "",
          stock_quantity: 0,
          is_default: false,
          status: 1,
        };
        
        console.log("📦 Created variant:", newVariant);
        return newVariant;
      });
      
      console.log("🎯 Setting variants:", newVariants);
      setVariants(newVariants);
    } else {
      console.log("⚠️ Clearing variants - variation types not ready");
      setVariants([]);
    }
  }, [variationTypes, availableAttributes]);

  // Generate all combinations from variation types
  const generateCombinations = (
    types: VariationType[],
    attributes: Attribute[]
  ) => {
    if (types.length === 0) {
      console.log("⚠️ No variation types provided");
      return [];
    }

    console.log("🔧 Generating combinations with types:", types);
    console.log("🔧 Available attributes:", attributes);

    const generate = (
      index: number,
      currentValuesByName: { [key: string]: { id: number; value: string } },
      currentValueIds: number[]
    ): Array<{
      valuesByName: { [key: string]: { id: number; value: string } };
      valueIds: number[];
    }> => {
      if (index === types.length) {
        return [
          {
            valuesByName: { ...currentValuesByName },
            valueIds: [...currentValueIds],
          },
        ];
      }

      const type = types[index];
      const attribute = attributes.find((attr) => attr.id === type.id);
      
      if (!attribute) {
        console.error(`❌ Attribute not found for type:`, type);
        return [];
      }

      console.log(`🔍 Processing attribute: ${attribute.name} (ID: ${attribute.id})`);
      console.log(`   Selected values:`, type.selectedValues);

      const results: Array<{
        valuesByName: { [key: string]: { id: number; value: string } };
        valueIds: number[];
      }> = [];

      type.selectedValues.forEach((valueId) => {
        const attributeValue = attribute.values.find((v) => v.id === valueId);
        if (attributeValue) {
          console.log(`   ✅ Adding value: ${attributeValue.value} (ID: ${valueId})`);
          
          const newValuesByName = {
            ...currentValuesByName,
            [attribute.name]: { id: valueId, value: attributeValue.value },
          };
          const newValueIds = [...currentValueIds, valueId];
          results.push(...generate(index + 1, newValuesByName, newValueIds));
        } else {
          console.warn(`   ⚠️ Value not found: ID ${valueId}`);
        }
      });

      return results;
    };

    const combinations = generate(0, {}, []);
    console.log(`✅ Generated ${combinations.length} total combinations`);
    return combinations;
  };

  // Handle attribute selection toggle
  const handleToggleAttribute = (attributeId: number) => {
    const exists = variationTypes.find((vt) => vt.id === attributeId);

    if (exists) {
      // Remove attribute
      setVariationTypes((prev) => prev.filter((vt) => vt.id !== attributeId));
      // Clear search query for this attribute
      setAttributeSearchQueries((prev) => {
        const newQueries = { ...prev };
        delete newQueries[attributeId];
        return newQueries;
      });
    } else {
      // Add attribute
      const attribute = availableAttributes.find((attr) => attr.id === attributeId);
      if (attribute) {
        setVariationTypes((prev) => [
          ...prev,
          {
            id: attributeId,
            name: attribute.name,
            selectedValues: [],
          },
        ]);
      }
    }
  };

  // Handle attribute value selection (like tag toggle)
  const handleToggleAttributeValue = (attributeId: number, valueId: number) => {
    setVariationTypes((prev) =>
      prev.map((vt) => {
        if (vt.id !== attributeId) return vt;

        const isSelected = vt.selectedValues.includes(valueId);
        return {
          ...vt,
          selectedValues: isSelected
            ? vt.selectedValues.filter((id) => id !== valueId)
            : [...vt.selectedValues, valueId],
        };
      })
    );
  };

  // Remove attribute value (like removing a tag)
  const handleRemoveAttributeValue = (attributeId: number, valueId: number) => {
    setVariationTypes((prev) =>
      prev.map((vt) => {
        if (vt.id !== attributeId) return vt;
        return {
          ...vt,
          selectedValues: vt.selectedValues.filter((id) => id !== valueId),
        };
      })
    );
  };

  // Update search query for an attribute
  const handleAttributeSearch = (attributeId: number, query: string) => {
    setAttributeSearchQueries((prev) => ({
      ...prev,
      [attributeId]: query,
    }));
  };

  // Update variant fields
  const handleUpdateVariant = (
    variantId: string,
    field: keyof VariantCombination,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((variant) => {
        // If setting is_default to true, unset all others
        if (field === "is_default" && value === true) {
          return variant.id === variantId
            ? { ...variant, [field]: value }
            : { ...variant, is_default: false };
        }

        return variant.id === variantId ? { ...variant, [field]: value } : variant;
      })
    );
  };

  // Apply a specific field value to all variants
  const handleApplyFieldToAll = (field: keyof VariantCombination, sourceVariantId: string) => {
    const sourceVariant = variants.find((v) => v.id === sourceVariantId);
    if (!sourceVariant) return;

    const value = sourceVariant[field];
    
    setVariants((prev) =>
      prev.map((variant) => ({
        ...variant,
        [field]: value,
      }))
    );
  };

  // Apply price to all variants
  const handleApplyPriceToAll = (data: any) => {
    console.log("📝 Form data:", data);

    setIsApplying(true);

    // Get values from form, only apply if they exist
    const updates: Partial<VariantCombination> = {};
    
    if (data.costPrice !== undefined && data.costPrice !== "") {
      updates.cost_price = String(data.costPrice);
      console.log("✅ Will update cost_price to:", updates.cost_price);
    }
    if (data.sellingPrice !== undefined && data.sellingPrice !== "") {
      updates.selling_price = String(data.sellingPrice);
      console.log("✅ Will update selling_price to:", updates.selling_price);
    }
    if (data.discountPrice !== undefined && data.discountPrice !== "") {
      updates.discount_price = String(data.discountPrice);
      console.log("✅ Will update discount_price to:", updates.discount_price);
    }
    if (data.quantity !== undefined && data.quantity !== "") {
      updates.stock_quantity = parseInt(data.quantity);
      console.log("✅ Will update stock_quantity to:", updates.stock_quantity);
    }

    console.log("📦 Total updates to apply:", updates);
    console.log("📊 Number of variants to update:", variants.length);

    // Apply updates to all variants
    setVariants((prev) => {
      const updated = prev.map((variant) => ({
        ...variant,
        ...updates,
      }));
      console.log("🔄 Updated variants:", updated);
      return updated;
    });

    // Show success message and reset applying state
    setShowSuccess(true);
    setTimeout(() => {
      setIsApplying(false);
      setShowSuccess(false);
      console.log("✅ Applied prices to all variants:", updates);
    }, 2000);
  };

  // Clear all form fields
  const handleClearAll = () => {
    priceForm.reset({
      costPrice: "",
      sellingPrice: "",
      discountPrice: "",
      quantity: "",
    });
  };

  // Calculate profit and margin
  const calculateProfitMargin = (costPrice: string, sellingPrice: string) => {
    const cost = parseFloat(costPrice) || 0;
    const selling = parseFloat(sellingPrice) || 0;
    const profit = selling - cost;
    const margin = cost > 0 ? ((profit / cost) * 100).toFixed(2) : "0";
    return { profit: profit.toFixed(2), margin };
  };

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Loading attributes...</p>
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
          <p className="text-gray-500">
            No attributes available for this category
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-200 pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">◆</span>
          </div>
          <h5 className="font-semibold text-base">Choose Variation Attributes:</h5>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Display available attributes as checkboxes */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-3">
          {availableAttributes.map((attribute) => {
            const isSelected = variationTypes.some((vt) => vt.id === attribute.id);
            return (
              <label
                key={attribute.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
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

        {/* Select values for each chosen attribute - Tags Style */}
        {variationTypes.length > 0 && (
          <div className="space-y-6 border-t border-gray-200 pt-6">
            <h6 className="font-semibold text-sm text-gray-900">
              Select values for each attribute:
            </h6>

            {variationTypes.map((variationType) => {
              const attribute = availableAttributes.find(
                (attr) => attr.id === variationType.id
              );
              if (!attribute) return null;

              const selectedValues = getSelectedAttributeValues(variationType.id);
              const filteredValues = getFilteredAttributeValues(variationType.id);
              const searchQuery = attributeSearchQueries[variationType.id] || "";

              return (
                <div key={variationType.id} className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {attribute.name}
                  </Label>

                  {/* Selected Values Display (like selected tags) */}
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
                            onClick={() =>
                              handleRemoveAttributeValue(variationType.id, value.id)
                            }
                          />
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) =>
                        handleAttributeSearch(variationType.id, e.target.value)
                      }
                      placeholder={`Search ${attribute.name.toLowerCase()}...`}
                      className="pl-10"
                    />
                  </div>

                  {/* Available Values List (like available tags) */}
                  <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto bg-gray-50">
                    {filteredValues.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        {searchQuery
                          ? `No ${attribute.name.toLowerCase()} found`
                          : `No ${attribute.name.toLowerCase()} available`}
                      </div>
                    ) : (
                      <div className="grid grid-cols-7 md:grid-cols-7 gap-2 p-3">
                        {filteredValues.map((value) => {
                          const isSelected = variationType.selectedValues.includes(
                            value.id
                          );

                          return (
                            <button
                              key={value.id}
                              type="button"
                              onClick={() =>
                                handleToggleAttributeValue(variationType.id, value.id)
                              }
                              className={`
                                px-3 py-2 rounded-md text-sm font-medium transition-all
                                ${
                                  isSelected
                                    ? "bg-orange-500 text-white hover:bg-orange-600"
                                    : "bg-white text-gray-700 border border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                                }
                              `}
                            >
                              {value.value}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Show selected count */}
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

        {/* Set Price for All Section */}
        {variants.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <h6 className="font-semibold text-sm flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs">◆</span>
                </div>
                Set Price for All Variants
              </h6>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleClearAll}
                  variant="outline"
                  className="text-gray-700 text-xs px-4 py-1.5 rounded border-gray-300"
                >
                  Clear Form
                </Button>
                <Button
                  type="button"
                  onClick={priceForm.handleSubmit(handleApplyPriceToAll)}
                  disabled={isApplying}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-1.5 rounded disabled:opacity-50"
                >
                  {isApplying ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-3 w-3 text-white inline"
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
                      Applying...
                    </>
                  ) : (
                    "Apply to All"
                  )}
                </Button>
              </div>
            </div>

            <FormProvider {...priceForm}>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-white p-4 rounded-md">
                <div className="space-y-3">
                  <p className="text-gray-600 text-xs mb-3">
                    Pricing ({variants.length} variants)
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="min-w-[120px] text-xs text-gray-600">
                      Cost Price
                    </label>
                    <InputField
                      name="costPrice"
                      placeholder="50.00"
                      type="number"
                      step="0.01"
                      className="flex-1 text-sm h-8"
                    />
                    <span className="text-xs text-gray-500">$</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="min-w-[120px] text-xs text-gray-600">
                      Selling Price
                    </label>
                    <InputField
                      name="sellingPrice"
                      placeholder="80.00"
                      type="number"
                      step="0.01"
                      className="flex-1 text-sm h-8"
                    />
                    <span className="text-xs text-gray-500">$</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="min-w-[120px] text-xs text-gray-600">
                      Discount Price
                    </label>
                    <InputField
                      name="discountPrice"
                      placeholder="70.00"
                      type="number"
                      step="0.01"
                      className="flex-1 text-sm h-8"
                    />
                    <span className="text-xs text-gray-500">$</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="min-w-[120px] text-xs text-gray-600">
                      Stock Quantity
                    </label>
                    <InputField
                      name="quantity"
                      placeholder="25"
                      type="number"
                      className="flex-1 text-sm h-8"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 text-xs mb-3">
                    Quick Info
                  </p>
                  
                  {/* Success Message */}
                  {showSuccess && (
                    <div className="p-3 bg-green-50 rounded-md border border-green-200 animate-pulse">
                      <p className="text-xs text-green-800 font-medium">
                        ✅ Successfully applied to all {variants.length} variants!
                      </p>
                    </div>
                  )}
                  
                  {/* Instructions */}
                  {!showSuccess && (
                    <div className="p-3 bg-orange-50 rounded-md border border-orange-200">
                      <p className="text-xs text-orange-800 mb-2">
                        💡 Fill in the prices above and click "Apply to All" to set the same values for all {variants.length} variants.
                      </p>
                      <p className="text-xs text-orange-700">
                        You can also use the copy icons (📋) in the table to apply individual values to all variants.
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        )}

        {/* Variants Table */}
        {variants.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                      Variant Name
                    </th>
                    {variationTypes.map((type) => (
                      <th
                        key={type.id}
                        className="px-4 py-3 text-left font-semibold text-gray-700 text-xs"
                      >
                        * {type.name}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                      * Cost Price
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                      * Selling Price
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                      Discount Price
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                      * Stock
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                      Default
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {variants.map((variant, index) => {
                    // Safety check - ensure variant has all required properties
                    if (!variant || !variant.combinations) {
                      console.error("❌ Invalid variant:", variant);
                      return null;
                    }
                    
                    return (
                    <tr key={`${variant.id}-${index}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={variant.variant_name}
                          onChange={(e) =>
                            handleUpdateVariant(
                              variant.id,
                              "variant_name",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </td>
                      {variationTypes.map((type) => {
                        const attributeName = type.name;
                        const combination = variant.combinations?.[attributeName];
                        return (
                          <td key={type.id} className="px-4 py-3 text-gray-900">
                            {combination?.value || "-"}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={variant.cost_price || ""}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "cost_price",
                                e.target.value
                              )
                            }
                            placeholder="50.00"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyFieldToAll("cost_price", variant.id)}
                            className="ml-1 p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors"
                            title="Apply this cost price to all variants"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={variant.selling_price || ""}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "selling_price",
                                e.target.value
                              )
                            }
                            placeholder="80.00"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyFieldToAll("selling_price", variant.id)}
                            className="ml-1 p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors"
                            title="Apply this selling price to all variants"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={variant.discount_price || ""}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "discount_price",
                                e.target.value
                              )
                            }
                            placeholder="70.00"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyFieldToAll("discount_price", variant.id)}
                            className="ml-1 p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors"
                            title="Apply this discount price to all variants"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={variant.stock_quantity ?? ""}
                            min={0}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "stock_quantity",
                                parseInt(e.target.value) 
                              )
                            }
                            placeholder="25"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyFieldToAll("stock_quantity", variant.id)}
                            className="ml-1 p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors"
                            title="Apply this stock quantity to all variants"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={variant.is_default}
                          onChange={(e) =>
                            handleUpdateVariant(
                              variant.id,
                              "is_default",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <select
                            value={variant.status}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "status",
                                parseInt(e.target.value)
                              )
                            }
                            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                          >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleApplyFieldToAll("status", variant.id)}
                            className="ml-1 p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors"
                            title="Apply this status to all variants"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 disabled:opacity-50"
                  disabled
                >
                  ◀
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded text-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 disabled:opacity-50"
                  disabled
                >
                  ▶
                </button>
              </div>
              <p className="text-xs text-gray-600">
                Showing all {variants.length} variant(s)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}