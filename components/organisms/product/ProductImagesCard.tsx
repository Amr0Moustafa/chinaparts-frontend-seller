import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ProductImagesCard = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files);
    const maxFiles = 4;
    const combined = [...images, ...selectedFiles].slice(0, maxFiles);
    setImages(combined);
  };

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center  gap-1">
          <Upload className="text-orange-500" />
          <h5 className="font-bold">{t("createproduct.images.title")}</h5>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main image */}
          <div className="col-span-2 row-span-2">
            <label
              htmlFor="image-upload"
              className="flex flex-col h-full items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition text-center"
            >
              <Upload className="text-[40px] text-gray-500" />
              <span className="text-sm text-gray-500 font-medium">
                {t("createproduct.images.mainimage")}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                {t("createproduct.images.recommended")}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {t("createproduct.images.formatNote")}
              </span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Image slots */}
          {[1, 2, 3, 4].map((num) => (
            <div key={num}>
              <label
                htmlFor={`image-upload-${num}`}
                className="flex flex-col h-20 items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition text-center"
              >
                <Upload className="text-[40px] text-gray-500" />
                <span className="text-sm text-gray-500 font-medium">
                  {t(`createproduct.images.image${num}`)}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {t("createproduct.images.formatNote")}
                </span>
              </label>
              <input
                id={`image-upload-${num}`}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
