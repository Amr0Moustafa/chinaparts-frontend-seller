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

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };
  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center  gap-1">
          <Upload className="text-orange-500" />
          <h5 className="font-bold">Product Images</h5>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
          {/* main image */}

          <div className="col-span-2 row-span-2">
            <label
              htmlFor="image-upload"
              className="flex flex-col col-span-2 row-span-2 h-full items-center justify-center w-full  border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition text-center"
            >
              <Upload className="text-[40px] text-gray-500" />
              <span className="text-sm text-gray-500 font-medium ">
                {t("product.mainimage")}{" "}
                
              </span>
              <span className="text-sm text-gray-500 font-medium ">
                {t("product.Recommended")}{" "}
                
              </span>
              
              <span className="text-xs text-gray-500 mt-1">JPG, PNG, WebP</span>
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

          {/* Image 1 */}
         <div className="">
            <label
              htmlFor="image-upload"
              className="flex flex-col  h-20 items-center justify-center w-full  border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition text-center"
            >
              <Upload className="text-[40px] text-gray-500" />
              <span className="text-sm text-gray-500 font-medium">
                {t("product.image1")}{" "}
                
              </span>
              <span className="text-xs text-gray-500 mt-1">JPG, PNG, WebP</span>
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

          {/* Image 2 */}
           <div className="">
            <label
              htmlFor="image-upload"
              className="flex flex-col  h-20 items-center justify-center w-full  border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition text-center"
            >
              <Upload className="text-[40px] text-gray-500" />
              <span className="text-sm text-gray-500 font-medium">
                {t("product.image2")}{" "}
                
              </span>
              <span className="text-xs text-gray-500 mt-1">JPG, PNG, WebP</span>
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

          {/* Image 3 */}
           <div className="">
            <label
              htmlFor="image-upload"
              className="flex flex-col  h-20 items-center justify-center w-full  border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition text-center"
            >
              <Upload className="text-[40px] text-gray-500" />
              <span className="text-sm text-gray-500 font-medium">
                {t("product.image3")}{" "}
                
              </span>
              <span className="text-xs text-gray-500 mt-1">JPG, PNG, WebP</span>
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
          {/* Image 4 */}

          <div className="">
            <label
              htmlFor="image-upload"
              className="flex flex-col  h-20 items-center justify-center w-full  border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition text-center"
            >
              <Upload className="text-[40px] text-gray-500" />
              <span className="text-sm text-gray-500 font-medium">
                {t("product.image4")}{" "}
                
              </span>
              <span className="text-xs text-gray-500 mt-1">JPG, PNG, WebP</span>
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
        </div>
      </CardContent>
    </Card>
  );
};
