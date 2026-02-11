"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InputField } from "@/components/atoms/input";
import SelectField from "@/components/atoms/SelectField";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Palette, Plus, X } from "lucide-react";
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

interface VariationType {
  id: string;
  name: string;
  values: string[];
}

interface VariantCombination {
  id: string;
  combinations: { [key: string]: string };
  price: string;
  discountPrice: string;
  quantity: number;
}

interface VariantCardProps {
  productId: string | null;
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: any) => void;
  initialValues?: {
    variationTypes?: VariationType[];
    variants?: VariantCombination[];
  };
}

const PRESET_VARIATION_TYPES = [
  { label: "Pattern", value: "Pattern" },
  { label: "Color", value: "Color" },
  { label: "Style", value: "Style" },
  { label: "Special Size Type", value: "Special Size Type" },
  { label: "Size", value: "Size" },
  { label: "Number of Items", value: "Number of Items" },
  { label: "Cup Size", value: "Cup Size" },
  { label: "Material", value: "Material" },
  { label: "FX Type", value: "FX Type" },
  { label: "Item Weight", value: "Item Weight" },
  { label: "Style Choice Type", value: "Style Choice Type" },
  { label: "Manufacture Part Number", value: "Manufacture Part Number" },
  { label: "Unit Count", value: "Unit Count" },
  { label: "Team Name", value: "Team Name" },
  { label: "Shape", value: "Shape" },
];

export default function VariantFormCard({
  productId,
  onValidationChange,
  onDataChange,
  initialValues,
}: VariantCardProps) {
  const { t } = useTranslation();
  const priceForm = useForm();

  const [variationTypes, setVariationTypes] = useState<VariationType[]>(
    initialValues?.variationTypes || []
  );
  const [variants, setVariants] = useState<VariantCombination[]>(
    initialValues?.variants || []
  );
  const [selectedVariationType, setSelectedVariationType] = useState<string | null>(null);
  const [newVariantValue, setNewVariantValue] = useState("");

  // Notify parent when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        product_id: productId,
        variation_types: variationTypes,
        variants: variants,
      });
    }

    if (onValidationChange) {
      onValidationChange(variationTypes.length > 0 && variants.length > 0);
    }
  }, [variationTypes, variants, productId, onDataChange, onValidationChange]);

  // Generate all possible variant combinations when variation types change
  useEffect(() => {
    if (variationTypes.length > 0 && variationTypes.every(vt => vt.values.length > 0)) {
      const combinations = generateCombinations(variationTypes);
      const newVariants = combinations.map((combo) => ({
        id: Math.random().toString(36).substr(2, 9),
        combinations: combo,
        price: "",
        discountPrice: "",
        quantity: 0,
      }));
      setVariants(newVariants);
    } else {
      setVariants([]);
    }
  }, [variationTypes]);

  // Generate all combinations from variation types
  const generateCombinations = (types: VariationType[]) => {
    if (types.length === 0) return [];

    const generate = (
      index: number,
      current: { [key: string]: string }
    ): { [key: string]: string }[] => {
      if (index === types.length) {
        return [{ ...current }];
      }

      const type = types[index];
      const results: { [key: string]: string }[] = [];

      type.values.forEach((value) => {
        const newCurrent = { ...current, [type.name]: value };
        results.push(...generate(index + 1, newCurrent));
      });

      return results;
    };

    return generate(0, {});
  };

  // Add value to variation type
  const handleAddVariantValue = (typeName: string, value: string) => {
    if (!value.trim()) return;

    setVariationTypes((prev) =>
      prev.map((type) =>
        type.name === typeName
          ? { ...type, values: [...type.values, value.trim()] }
          : type
      )
    );
    setNewVariantValue("");
  };

  // Remove value from variation type
  const handleRemoveVariantValue = (typeName: string, value: string) => {
    setVariationTypes((prev) =>
      prev.map((type) =>
        type.name === typeName
          ? { ...type, values: type.values.filter((v) => v !== value) }
          : type
      )
    );
  };

  // Update variant price and quantity
  const handleUpdateVariant = (
    variantId: string,
    field: "price" | "discountPrice" | "quantity",
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      )
    );
  };

  // Apply price to all variants
  const handleApplyPriceToAll = (data: any) => {
    const { costPerItem, quantity } = data;
    
    setVariants((prev) =>
      prev.map((variant) => ({
        ...variant,
        price: costPerItem || "",
        discountPrice: costPerItem || "",
        quantity: parseInt(quantity) || 0,
      }))
    );
  };

  // Handle variation type selection (radio-like behavior)
  const handleSelectVariationType = (typeName: string) => {
    const exists = variationTypes.find((vt) => vt.name === typeName);
    
    if (exists) {
      // Remove if already selected
      setVariationTypes((prev) => prev.filter((vt) => vt.name !== typeName));
    } else {
      // Add new type
      setVariationTypes((prev) => [
        ...prev,
        { id: Math.random().toString(36).substr(2, 9), name: typeName, values: [] },
      ]);
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-200 pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">◆</span>
          </div>
          <h5 className="font-semibold text-base">
            Choose Variation type:
          </h5>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Display variation types in grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {PRESET_VARIATION_TYPES.map((type) => {
            const isSelected = variationTypes.some((vt) => vt.name === type.value);
            return (
              <label
                key={type.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectVariationType(type.value)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {type.label}
                </span>
              </label>
            );
          })}
        </div>

        {/* List all variants for the variation types */}
        {variationTypes.length > 0 && (
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h6 className="font-semibold text-sm text-gray-900">
              List all your variants for the variation types below.
            </h6>

            {variationTypes.map((type) => (
              <div key={type.id} className="space-y-2">
                <div className="flex items-start gap-2">
                  <label className="font-medium text-sm min-w-[70px] pt-2">
                    {type.name} :
                  </label>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Example: ${
                          type.name === "Color"
                            ? "Navy, Red (Striped), Cherry Red, Black"
                            : type.name === "Size"
                            ? "Large"
                            : "Enter value"
                        }`}
                        value={
                          selectedVariationType === type.name
                            ? newVariantValue
                            : ""
                        }
                        onFocus={() => setSelectedVariationType(type.name)}
                        onChange={(e) => setNewVariantValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddVariantValue(type.name, newVariantValue);
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          handleAddVariantValue(type.name, newVariantValue)
                        }
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2"
                      >
                        Add
                      </Button>
                    </div>

                    {/* Display added values */}
                    {type.values.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {type.values.map((value, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded text-sm border border-red-200"
                          >
                            {value}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveVariantValue(type.name, value)
                              }
                              className="text-red-700 hover:text-red-900"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
                Set Price for All
              </h6>
              <Button
                type="button"
                onClick={priceForm.handleSubmit(handleApplyPriceToAll)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-1.5 rounded"
              >
                Apply Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-white p-4 rounded-md">
              <div className="space-y-3">
                <p className="text-gray-600 text-xs mb-3">
                  Set the default price for all categories ({variants.length})
                </p>
                <FormProvider {...priceForm}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="min-w-[100px] text-xs text-gray-600">
                        Cost per item
                      </label>
                      <InputField
                        name="costPerItem"
                        placeholder="65.25"
                        className="flex-1 text-sm h-8"
                      />
                      <span className="text-xs text-gray-500">$</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="min-w-[100px] text-xs text-gray-600">Quantity</label>
                      <InputField
                        name="quantity"
                        placeholder="5"
                        type="number"
                        className="flex-1 text-sm h-8"
                      />
                      <span className="text-xs text-gray-500">$</span>
                    </div>
                  </div>
                </FormProvider>
              </div>

              <div className="space-y-3">
                <p className="text-gray-600 text-xs mb-3">
                  Set the discount price for all categories ({variants.length})
                </p>
                <FormProvider {...priceForm}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="min-w-[100px] text-xs text-gray-600">
                        (Used to calculate profit)
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="min-w-[100px] text-xs text-gray-600">Profit</label>
                      <InputField
                        name="profit"
                        placeholder="455"
                        className="flex-1 text-sm h-8"
                        disabled
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="min-w-[100px] text-xs text-gray-600">Margin</label>
                      <InputField
                        name="margin"
                        placeholder="75%"
                        className="flex-1 text-sm h-8"
                        disabled
                      />
                    </div>
                  </div>
                </FormProvider>
              </div>
            </div>
          </div>
        )}

        {/* Variants Table */}
        {variants.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {variationTypes.map((type) => (
                      <th
                        key={type.id}
                        className="px-4 py-3 text-left font-semibold text-gray-700 text-xs"
                      >
                        * {type.name}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                      * Your Price
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                      * Your Price
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                      * Quantity
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {variants.map((variant, index) => (
                    <tr key={variant.id} className="hover:bg-gray-50">
                      {variationTypes.map((type) => (
                        <td key={type.id} className="px-4 py-3 text-gray-900">
                          {variant.combinations[type.name] || "-"}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-xs">USD($)</span>
                          <input
                            type="text"
                            value={variant.price}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="32.99"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-xs">USD($)</span>
                          <input
                            type="text"
                            value={variant.discountPrice}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "discountPrice",
                                e.target.value
                              )
                            }
                            placeholder="32.99"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={variant.quantity}
                          onChange={(e) =>
                            handleUpdateVariant(
                              variant.id,
                              "quantity",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600"
                >
                  ◀
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50"
                >
                  1
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50"
                >
                  ▶
                </button>
              </div>
              <p className="text-xs text-gray-600">
                Showing 1 - 10 of {variants.length} products
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}