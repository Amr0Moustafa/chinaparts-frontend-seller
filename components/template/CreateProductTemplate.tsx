"use client";

import { ArrowLeft ,ArrowRight } from "lucide-react";
import { Button } from "../atoms/Button";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Stepper } from "../organisms/stepper/Stepper";
export const CreateProductTemplate = () => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const direction = i18n.dir();
    return(
        <div>
            <div className="headerpage flex space-y-4    ">
              {/* back to products */}
              <div className="flex items-center w-full ">
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
                 <h5 className="text-xl font-bold text-slate-800"> {t("createproduct.header.addNewProduct")}</h5>
              </div>
              {/* publish product */}
              <div className="flex-shrink-0">
                 <Button
                        text={t("createproduct.header.saveAsDraft")}
                        className="px-2 md:py-2 md:px-3 font-bold text-gray-900 bg-white border border-gray-300 w-auto"
                        
                      />
                   
              </div>
            </div>

            {/*   add product  steps*/}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-orange-500">{t("createproduct.steps.title")}</h2>
                    <p className="text-md  text-gray-600">{t("createproduct.steps.description")}</p>
                  </div>
                </div>
              <Stepper/>
                    
       
        </div>
    )
};