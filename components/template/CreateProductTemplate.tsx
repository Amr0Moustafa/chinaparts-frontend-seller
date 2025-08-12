"use client";

import { ArrowLeft ,ArrowRight } from "lucide-react";
import { Button } from "../atoms/Button";

import { ProductInfoCard } from "@/components/organisms/product/ProductInfoCard";
import { ProductImagesCard } from "@/components/organisms/product/ProductImagesCard";
// import { MainVehicleCard } from "@/components/organisms/product/MainVehicleCard";
// import { VehicleCompatibilityCard } from "@/components/organisms/product/VehicleCompatibilityCard";
import { PricingInventoryCard } from "@/components/organisms/product/PricingInventoryCard";
import { CategoryTagsCard } from "@/components/organisms/product/CategoryTagsCard";
import { ShippingInfoCard } from "@/components/organisms/product/ShippingInfoCard";
// import { VariantCard } from "@/components/organisms/product/VariantCard";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
export const CreateProductTemplate = () => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const direction = i18n.dir();
    return(
        <div>
            <div className="headerpage flex space-y-4 flex-col md:flex-row  ">
              {/* back to products */}
              <div className="flex items-center w-3/4  ">
{direction === "rtl" ? (
            <ArrowRight
              onClick={() => router.back()}
              className="text-orange-500"
            />
          ) : (
            <ArrowLeft
              onClick={() => router.back()}
              className="text-orange-500"
            />
          )}
                 <h5 className="text-xl font-bold text-slate-800">Add New Product</h5>
              </div>
              {/* publish product */}
              <div className="flex justify-center  w-full md:w-1/3  gap-3">
                 <Button
                        text="Save as Draft"
                        className="md:py-2 md:px-3 font-bold text-gray-900 bg-white border border-gray-300 w-auto"
                        
                      />
                    <Button
                           text="Add New Product"
                           className="md:py-2 md:px-3 font-bold text-gray-900 w-auto"
                           
                         />
              </div>
            </div>

            {/* form  add product */}
            <div className="mt-5 grid grid-cols-1 xl:grid-cols-12 gap-6 px-6 pb-12">
      <div className="md:col-span-8 flex flex-col gap-6">
        <ProductInfoCard />
        <ProductImagesCard />
        {/* <MainVehicleCard />
        <VehicleCompatibilityCard /> */}
      </div>
      <div className="flex flex-col gap-6 md:col-span-4">
        <PricingInventoryCard />
         <CategoryTagsCard />
         <ShippingInfoCard />
        {/* 
       
        
        <VariantCard /> */}
      </div>
    </div>
        </div>
    )
};