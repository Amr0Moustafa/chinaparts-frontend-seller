"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";

// ----------------------
// Category & Tags Card
// ----------------------
const CategoryTagsCard = () => {
  const { t } = useTranslation();
  const [tags, setTags] = useState<string[]>([
    "Matches Description: Does not match",
    "Product Quality: Acceptable",
    "Durability: Strong",
    "Ease of Installation: Difficult",
    "Value for Money: Bad",
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Tag className="text-orange-500" />
          <h5 className="font-bold">{t("createproduct.categoryTags.title")}</h5>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category */}
        <div className="space-y-2">
          <Label>{t("createproduct.categoryTags.categoryLabel")}</Label>
          <Input placeholder={t("createproduct.categoryTags.categoryLabel")} />
        </div>

        {/* Subcategory */}
        <div className="space-y-2">
          <Label>{t("createproduct.categoryTags.subcategoryLabel")}</Label>
          <Input
            placeholder={t("createproduct.categoryTags.subcategoryLabel")}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>{t("createproduct.categoryTags.tagsLabel")}</Label>
          <div className="flex gap-2">
            <Input
              placeholder={t("createproduct.categoryTags.tagsPlaceholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              {t("createproduct.categoryTags.addButton")}
            </button>
          </div>

          {/* Tags list */}
          <div className="overflow-y-auto p-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm"
              >
                {tag}
                <X
                  className="w-4 h-4 cursor-pointer hover:text-red-500"
                  onClick={() => handleRemoveTag(tag)}
                />
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ----------------------
// Product Summary Card
// ----------------------
const ProductSummaryCard = () => {
  const { t } = useTranslation();
  const summaryTags = [ "Matches Description: Does not match", "Product Quality: Acceptable", "Durability: Strong", "Ease of Installation: Difficult", ];

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Info className="text-orange-500" />
          <h5 className="font-bold">
            {t("createproduct.productSummary.title")}
          </h5>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4 text-sm">
              <h6 className="font-semibold mb-2">
                {t("createproduct.productSummary.basicInfo.title")}
              </h6>
              <p>
                <b>{t("createproduct.productSummary.basicInfo.name")}:</b> sa
              </p>
              <p>
                <b>{t("createproduct.productSummary.basicInfo.sku")}:</b> sc
              </p>
              <p>
                <b>
                  {t("createproduct.productSummary.basicInfo.manufacturer")}:
                </b>{" "}
                sa
              </p>
              <p>
                <b>{t("createproduct.productSummary.basicInfo.price")}:</b> $535
              </p>
            </CardContent>
          </Card>

          {/* Variants & Compatibility */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4 text-sm">
              <h6 className="font-semibold mb-2">
                {t("createproduct.productSummary.variantsCompatibility.title")}
              </h6>
              productSummary.
              <p>
                <b>
                  {t(
                    "createproduct.productSummary.variantsCompatibility.variants"
                  )}
                  :
                </b>{" "}
                1
              </p>
              <p>
                <b>
                  {t(
                    "createproduct.productSummary.variantsCompatibility.mainVehicle"
                  )}
                  :
                </b>{" "}
                honda fg
              </p>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4 text-sm">
              <h6 className="font-semibold mb-2">
                {t("createproduct.productSummary.shippingInfo.title")}
              </h6>
              <p>
                <b>
                  {t("createproduct.productSummary.shippingInfo.dimensions")}:
                </b>{" "}
                453”×453”×0”
              </p>
              <p>
                <b>{t("createproduct.productSummary.shippingInfo.weight")}:</b>{" "}
                453 lbs
              </p>
              <p>
                <b>{t("createproduct.productSummary.shippingInfo.fragile")}:</b>{" "}
                No
              </p>
            </CardContent>
          </Card>

          {/* Category & Tags Summary */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4 text-sm">
              <h6 className="font-semibold mb-2">
                {t("createproduct.productSummary.categoryTags.title")}
              </h6>
              <p>
                <b>
                  {t("createproduct.productSummary.categoryTags.category")}:
                </b>{" "}
                Interior
              </p>
              <p className="mt-2">
                <b>{t("createproduct.productSummary.categoryTags.tags")}:</b>{" "}
                {summaryTags.join(", ")}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

// ----------------------
// Main Page Component
// ----------------------
export default function CategoryTags() {
  return (
    <div className="space-y-6">
      <CategoryTagsCard />
      <ProductSummaryCard />
    </div>
  );
}
