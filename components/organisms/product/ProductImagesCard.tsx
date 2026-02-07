"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

/* ==================== Types ==================== */
interface ProductImagesData {
  main_image: File | null;
  images: File[];
}

interface ProductImagesCardProps {
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: ProductImagesData) => void;
  initialData?: ProductImagesData;
}

/* ==================== Constants ==================== */
const MAX_ADDITIONAL_IMAGES = 3;
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const INITIAL_DATA: ProductImagesData = {
  main_image: null,
  images: [],
};

/* ==================== Component ==================== */
export const ProductImagesCard = ({
  onValidationChange,
  onDataChange,
  initialData = INITIAL_DATA,
}: ProductImagesCardProps) => {
  const { t } = useTranslation();
  
  const [mainImage, setMainImage] = useState<File | null>(initialData.main_image);
  const [additionalImages, setAdditionalImages] = useState<File[]>(initialData.images);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* ------------------ Validation ------------------ */
  const validateImage = useCallback((file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return t("createproduct.images.validation.type");
    }

    if (file.size > MAX_SIZE_BYTES) {
      return t("createproduct.images.validation.size", {
        size: MAX_SIZE_MB,
      });
    }

    return null;
  }, [t]);

  const validateForm = useCallback((): boolean => {
    return mainImage !== null;
  }, [mainImage]);

  /* ------------------ Image Previews ------------------ */
  useEffect(() => {
    if (mainImage) {
      const url = URL.createObjectURL(mainImage);
      setMainImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setMainImagePreview(null);
    }
  }, [mainImage]);

  useEffect(() => {
    const urls = additionalImages.map(file => URL.createObjectURL(file));
    setAdditionalImagePreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [additionalImages]);

  /* ------------------ Sync with Parent ------------------ */
  useEffect(() => {
    const isValid = validateForm();
    onValidationChange?.(isValid);
  }, [mainImage, validateForm, onValidationChange]);

  useEffect(() => {
    onDataChange?.({
      main_image: mainImage,
      images: additionalImages,
    });
  }, [mainImage, additionalImages, onDataChange]);

  /* ------------------ Handlers ------------------ */
  const handleMainImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setMainImage(file);
    // Reset the input
    e.target.value = '';
  }, [validateImage]);

  const handleAdditionalImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    // Validate each file
    for (const file of newFiles) {
      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);
        e.target.value = '';
        return;
      }
    }

    // Check total count
    const totalImages = additionalImages.length + newFiles.length;
    if (totalImages > MAX_ADDITIONAL_IMAGES) {
      setError(t("createproduct.images.validation.max", { max: MAX_ADDITIONAL_IMAGES }));
      e.target.value = '';
      return;
    }

    setError(null);
    setAdditionalImages(prev => [...prev, ...newFiles]);
    // Reset the input
    e.target.value = '';
  }, [additionalImages.length, validateImage, t]);

  const handleRemoveMainImage = useCallback(() => {
    setMainImage(null);
    setError(null);
  }, []);

  const handleRemoveAdditionalImage = useCallback((index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setError(null);
  }, []);

  /* ------------------ Render ------------------ */
  const remainingSlots = MAX_ADDITIONAL_IMAGES - additionalImages.length;

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Upload className="text-orange-500" />
          <h5 className="font-bold">{t("createproduct.images.title")}</h5>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Image */}
          <div className="col-span-2 row-span-2 relative">
            {mainImagePreview ? (
              <div className="relative h-full w-full rounded-lg overflow-hidden border-2 border-gray-300">
                <img
                  src={mainImagePreview}
                  alt="Main product"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveMainImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  aria-label="Remove main image"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  {t("createproduct.images.mainimage")}
                </div>
              </div>
            ) : (
              <label
                htmlFor="main-image-upload"
                className="flex flex-col h-full items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition text-center"
              >
                <Upload className="text-[40px] text-gray-500" />
                <span className="text-sm text-gray-500 font-medium">
                  {t("createproduct.images.mainimage")} *
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {t("createproduct.images.formatNote")}
                </span>
              </label>
            )}

            <input
              id="main-image-upload"
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="hidden"
            />
          </div>

          {/* Additional Images */}
          {additionalImages.map((file, index) => (
            <div key={`existing-${index}`} className="relative">
              <div className="relative h-20 w-full rounded-lg overflow-hidden border-2 border-gray-300">
                <img
                  src={additionalImagePreviews[index]}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAdditionalImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}

          {/* Empty Slots for Additional Images */}
          {Array.from({ length: remainingSlots }).map((_, index) => (
            <div key={`slot-${index}`}>
              <label
                htmlFor={`additional-image-upload-${index}`}
                className="flex flex-col h-20 items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition text-center"
              >
                <Upload className="text-[32px] text-gray-500" />
                <span className="text-xs text-gray-500">
                  {t("createproduct.images.formatNote")}
                </span>
              </label>
              <input
                id={`additional-image-upload-${index}`}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImageChange}
                className="hidden"
              />
            </div>
          ))}
        </div>

        {/* Validation/Info Message */}
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <p className="text-sm text-gray-500">
            {t("createproduct.images.hint")} (Max {MAX_ADDITIONAL_IMAGES} additional images, {MAX_SIZE_MB}MB each)
          </p>
        )}
      </CardContent>
    </Card>
  );
};