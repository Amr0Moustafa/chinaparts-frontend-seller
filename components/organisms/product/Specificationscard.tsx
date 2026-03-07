"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Settings, Plus, Trash2 } from "lucide-react";

/* ==================== Types ==================== */
export interface SpecItem {
  id: string;
  key: string;
  value: string;
}

export interface SpecificationsData {
  specifications: SpecItem[];
}

interface SpecificationsCardProps {
  initialData?: SpecificationsData;
  onDataChange?: (data: SpecificationsData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

/* ==================== Helpers ==================== */
const generateId = () => Math.random().toString(36).substr(2, 9);

const createEmptySpec = (): SpecItem => ({
  id: generateId(),
  key: "",
  value: "",
});

/* ==================== Component ==================== */
export const SpecificationsCard: React.FC<SpecificationsCardProps> = ({
  initialData,
  onDataChange,
  onValidationChange,
}) => {
  const { t } = useTranslation();

  const [specs, setSpecs] = useState<SpecItem[]>(
    initialData?.specifications?.length
      ? initialData.specifications
      : [createEmptySpec()]
  );

  /* ---- Sync initialData ---- */
  useEffect(() => {
    if (initialData?.specifications?.length) {
      setSpecs(initialData.specifications);
    }
  }, [initialData]);

  /* ---- Notify parent on change ---- */
  useEffect(() => {
    const data: SpecificationsData = { specifications: specs };
    onDataChange?.(data);

    // Valid if every row is either fully empty OR fully filled
    const allValid = specs.every((s) => {
      const bothEmpty = !s.key.trim() && !s.value.trim();
      const bothFilled = s.key.trim() && s.value.trim();
      return bothEmpty || bothFilled;
    });
    onValidationChange?.(allValid);
  }, [specs]);

  /* ==================== Handlers ==================== */

  const addSpec = useCallback(() => {
    setSpecs((prev) => [...prev, createEmptySpec()]);
  }, []);

  const removeSpec = useCallback((id: string) => {
    setSpecs((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSpec = useCallback(
    (id: string, field: "key" | "value", val: string) => {
      setSpecs((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
      );
    },
    []
  );

  /* ==================== Render ==================== */
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Settings size={18} className="text-orange-500" />
        <h3 className="text-base font-semibold text-gray-800">
          {t("specifications.title")}
        </h3>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        {t("specifications.subtitle")}
      </p>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-2 gap-0 bg-gray-50 border-b border-gray-200">
          <div className="px-4 py-2 text-xs font-medium text-gray-500 border-r border-gray-200">
            {t("specifications.attributeLabel")}{" "}
            <span className="text-red-500">*</span>
          </div>
          <div className="px-4 py-2 text-xs font-medium text-gray-500">
            {t("specifications.valueLabel")}{" "}
            <span className="text-red-500">*</span>
          </div>
        </div>

        {/* Spec Rows */}
        <div className="divide-y divide-gray-100">
          {specs.map((spec, index) => (
            <div key={spec.id} className="flex items-center group">
              <div className="grid grid-cols-2 flex-1">
                <div className="border-r border-gray-100">
                  <input
                    type="text"
                    placeholder={t("specifications.attributePlaceholder")}
                    value={spec.key}
                    onChange={(e) => updateSpec(spec.id, "key", e.target.value)}
                    className="w-full text-sm px-4 py-2.5 placeholder-gray-300 outline-none focus:bg-orange-50 transition"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder={t("specifications.valuePlaceholder")}
                    value={spec.value}
                    onChange={(e) =>
                      updateSpec(spec.id, "value", e.target.value)
                    }
                    className="w-full text-sm px-4 py-2.5 placeholder-gray-300 outline-none focus:bg-orange-50 transition"
                  />
                </div>
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => removeSpec(spec.id)}
                disabled={specs.length === 1}
                className="px-3 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0"
                title={t("specifications.removeSpec")}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Row Button */}
        <button
          type="button"
          onClick={addSpec}
          className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 border-t border-dashed border-gray-200 hover:border-orange-300 py-2.5 transition-colors"
        >
          <Plus size={14} />
          {t("specifications.addSpec")}
        </button>
      </div>
    </div>
  );
};