"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

/* ==================== Types ==================== */
interface ProductImagesData {
  main_image: File | null;
  images: File[];
  main_image_url?: string;
  images_url?: string[];
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
  main_image_url: "",
  images_url: [],
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

  // ✅ Track existing URLs from server
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<string>(
    initialData.main_image_url || ""
  );
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    initialData.images_url || []
  );

  /* ------------------ Load Initial Data ------------------ */
  useEffect(() => {
    console.log("🔄 ProductImagesCard received initialData:", initialData);
    
    // Set existing URLs
    if (initialData.main_image_url) {
      setExistingMainImageUrl(initialData.main_image_url);
      console.log("🖼️ Main image URL loaded:", initialData.main_image_url);
    }
    
    if (initialData.images_url && initialData.images_url.length > 0) {
      setExistingImageUrls(initialData.images_url);
      console.log("🖼️ Additional image URLs loaded:", initialData.images_url);
    }

    // Set Files if provided (for edit mode with pre-loaded files)
    if (initialData.main_image) {
      setMainImage(initialData.main_image);
    }
    
    if (initialData.images && initialData.images.length > 0) {
      setAdditionalImages(initialData.images);
    }
  }, [initialData]);

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
    // Valid if we have either a new main image OR an existing main image URL
    return mainImage !== null || (existingMainImageUrl !== null && existingMainImageUrl !== "");
  }, [mainImage, existingMainImageUrl]);

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
  }, [mainImage, existingMainImageUrl, validateForm, onValidationChange]);

  useEffect(() => {
    onDataChange?.({
      main_image: mainImage,
      images: additionalImages,
      main_image_url: existingMainImageUrl,
      images_url: existingImageUrls,
    });
  }, [mainImage, additionalImages, existingMainImageUrl, existingImageUrls, onDataChange]);

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
    // Clear existing URL when new file is selected
    setExistingMainImageUrl("");
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

  const handleRemoveExistingMainImageUrl = useCallback(() => {
    setExistingMainImageUrl("");
    setError(null);
  }, []);

  const handleRemoveExistingImageUrl = useCallback((index: number) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    setError(null);
  }, []);

  /* ------------------ Render ------------------ */
  const remainingSlots = MAX_ADDITIONAL_IMAGES - additionalImages.length;

  // Determine which main image to show (new file takes precedence over URL)
  const displayMainImage = mainImagePreview || existingMainImageUrl;
  const hasExistingImages = existingMainImageUrl || existingImageUrls.length > 0;

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Upload className="text-orange-500" />
          <h5 className="font-bold">{t("createproduct.images.title")}</h5>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div>
          <h6 className="text-sm font-semibold text-gray-700 mb-3">
            Upload New Images
          </h6>
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
                    {t("createproduct.images.mainimage")} (New)
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="main-image-upload"
                  className="flex flex-col h-full min-h-[160px] items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition text-center"
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

            {/* New Additional Images (Files) */}
            {additionalImages.map((file, index) => (
              <div key={`new-file-${index}`} className="relative">
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
                  <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1 rounded">
                    New
                  </div>
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
        </div>

        {/* Existing Images Section (URLs) */}
        {hasExistingImages && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="text-orange-500" size={18} />
              <h6 className="text-sm font-semibold text-gray-700">
                Existing Images (Saved)
              </h6>
            </div>

            <div className="space-y-3">
              {/* Existing Main Image URL */}
              {existingMainImageUrl && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded overflow-hidden border-2 border-orange-300">
                      <img
                        src={existingMainImageUrl}
                        alt="Existing main"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        Main Image
                      </span>
                      <LinkIcon size={14} className="text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {existingMainImageUrl}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveExistingMainImageUrl}
                    className="flex-shrink-0 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                    aria-label="Remove existing main image"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Existing Additional Image URLs */}
              {existingImageUrls.map((url, index) => (
                <div
                  key={`existing-url-${index}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded overflow-hidden border-2 border-gray-300">
                      <img
                        src={url}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Image {index + 1}
                      </span>
                      <LinkIcon size={14} className="text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {url}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImageUrl(index)}
                    className="flex-shrink-0 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                    aria-label={`Remove existing image ${index + 1}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-2 italic">
              💡 These images are currently saved on the server. Upload new images above to replace them.
            </p>
          </div>
        )}

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