"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag, X, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetCategoriesQuery } from "@/features/category";
import { useGetTagsQuery } from "@/features/sellerAttributes";
import { useFormik } from "formik";
import * as Yup from "yup";

interface CategoryTagsCardProps {
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: CategoryTagsData) => void;
  initialValues?: {
    category_id: string;
    sub_category_id: string;
    tags: number[]; // Array of tag IDs
  };
}

export interface CategoryTagsData {
  category_id: string;
  sub_category_id: string;
  tags: number[]; // Array of tag IDs
}

export const CategoryTagsCard = ({
  onValidationChange,
  onDataChange,
  initialValues,
}: CategoryTagsCardProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categoriesData, isLoading } = useGetCategoriesQuery();
  const { data: tagsData, isLoading: isLoadingTags } = useGetTagsQuery();
  const categories = categoriesData?.data || [];
  const availableTags = tagsData?.data || [];

  const validationSchema = Yup.object({
    category_id: Yup.string()
      .required(
        t("createproduct.categoryTags.categoryRequired") ||
          "Category is required"
      ),
    sub_category_id: Yup.string().nullable(),
    tags: Yup.array()
      .of(Yup.number())
      .min(
        1,
        t("createproduct.categoryTags.tagsMinLength") ||
          "At least one tag is required"
      )
      .max(
        10,
        t("createproduct.categoryTags.tagsMaxLength") ||
          "Maximum 10 tags allowed"
      ),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      category_id: "",
      sub_category_id: "",
      tags: [],
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (onDataChange) {
        onDataChange(values);
      }
    },
  });

  const selectedCategoryObj = useMemo(() => {
    return categories.find(
      (cat: any) => String(cat.id) === String(formik.values.category_id)
    );
  }, [categories, formik.values.category_id]);

  const subcategories = useMemo(() => {
    return selectedCategoryObj?.sub_categories || [];
  }, [selectedCategoryObj]);

  // Filter tags based on search query
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return availableTags;
    
    return availableTags.filter((tag: any) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableTags]);

  // Get selected tag objects for display
  const selectedTags = useMemo(() => {
    return availableTags.filter((tag: any) =>
      formik.values.tags.includes(tag.id)
    );
  }, [availableTags, formik.values.tags]);

  // Reset subcategory if category changes
  useEffect(() => {
    if (
      formik.values.sub_category_id &&
      !subcategories.some(
        (sub: any) => String(sub.id) === String(formik.values.sub_category_id)
      )
    ) {
      formik.setFieldValue("sub_category_id", "");
    }
  }, [subcategories, formik.values.sub_category_id]);

  // Notify parent of validation state changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(formik.isValid && formik.dirty);
    }
  }, [formik.isValid, formik.dirty, onValidationChange]);

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formik.values);
    }
  }, [formik.values, onDataChange]);

  const handleToggleTag = (tagId: number) => {
    const currentTags = formik.values.tags;
    
    if (currentTags.includes(tagId)) {
      // Remove tag
      formik.setFieldValue(
        "tags",
        currentTags.filter((id: number) => id !== tagId)
      );
    } else {
      // Add tag (check max limit)
      if (currentTags.length < 10) {
        formik.setFieldValue("tags", [...currentTags, tagId]);
      }
    }
  };

  const handleRemoveTag = (tagId: number) => {
    formik.setFieldValue(
      "tags",
      formik.values.tags.filter((id: number) => id !== tagId)
    );
  };

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Tag className="text-orange-500" />
          <h5 className="font-bold">
            {t("createproduct.categoryTags.title")}
          </h5>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category_id">
              {t("createproduct.categoryTags.categoryLabel")}
            </Label>
            <select
              id="category_id"
              name="category_id"
              value={formik.values.category_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`flex h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm ring-offset-background ${
                formik.touched.category_id && formik.errors.category_id
                  ? "border-red-500"
                  : ""
              }`}
              disabled={isLoading}
            >
              <option value="">
                {isLoading ? "Loading..." : "Select category"}
              </option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>
            {formik.touched.category_id && formik.errors.category_id && (
              <p className="text-sm text-red-500">
                {String(formik.errors.category_id)}
              </p>
            )}
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <Label htmlFor="sub_category_id">
              {t("createproduct.categoryTags.subcategoryLabel")}
            </Label>
            <select
              id="sub_category_id"
              name="sub_category_id"
              value={formik.values.sub_category_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`flex h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm ring-offset-background ${
                !formik.values.category_id ? "opacity-50" : ""
              }`}
              disabled={!formik.values.category_id}
            >
              <option value="">
                {!formik.values.category_id
                  ? "Select category first"
                  : subcategories.length === 0
                  ? "No subcategories"
                  : "Select subcategory"}
              </option>
              {subcategories.map((sub: any) => (
                <option key={sub.id} value={String(sub.id)}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <Label>{t("createproduct.categoryTags.tagsLabel")}</Label>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-orange-50 rounded-md border border-orange-200">
              {selectedTags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag.name}
                  <X
                    className="w-4 h-4 cursor-pointer hover:bg-orange-600 rounded-full"
                    onClick={() => handleRemoveTag(tag.id)}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("createproduct.categoryTags.tagsLabel") || ""}
              className="pl-10"
              disabled={isLoadingTags}
            />
          </div>

          {/* Available Tags List */}
          <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto bg-gray-50">
            {isLoadingTags ? (
              <div className="p-4 text-center text-gray-500">
                Loading tags...
              </div>
            ) : filteredTags.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery ? "No tags found" : "No tags available"}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-3">
                {filteredTags.map((tag: any) => {
                  const isSelected = formik.values.tags.includes(tag.id);
                  const isDisabled = !isSelected && formik.values.tags.length >= 10;

                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleTag(tag.id)}
                      disabled={isDisabled}
                      className={`
                        px-3 py-2 rounded-md text-sm font-medium transition-all
                        ${
                          isSelected
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : isDisabled
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                        }
                      `}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Validation Error */}
          {formik.touched.tags && formik.errors.tags && (
            <p className="text-sm text-red-500">
              {String(formik.errors.tags)}
            </p>
          )}

         
        </div>
      </CardContent>
    </Card>
  );
};