"use client";
import { FC } from "react";
import {  ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { StoreForm } from "../organisms/setting/Storeform";
import { Button } from "../atoms/Button";

export const StoreSettingsTemplate: FC = () => {
  const { i18n, t } = useTranslation();
 

  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-3">
      </div>
       <div className="flex items-center justify-between gap-4 mb-3">
                     <h3 className="text-lg  md:text-2xl font-bold">{t("storeSetting.title") || "Store Settings"}</h3>

              <div className="flex-shrink-0">
                <Button
                  text={t("storeSetting.saveChanges") || "Save Changes"}
                  className="py-3 px-5 font-bold text-gray-900 w-auto"
                />
              </div>
            </div>
        

        <StoreForm/>
      </div>
    </div>
  );
};
