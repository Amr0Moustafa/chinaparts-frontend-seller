"use client";

import Createproductoffer from "../molecules/offers/Createproductoffer";
import { t } from "i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
export const CreateproductOfferTemplate = () => {
    const { i18n, t } = useTranslation();
  const router = useRouter();
  const direction = i18n.dir();
    return(
        <div>
            <div className="headerpage flex space-y-4 flex-col md:flex-row  ">
              {/* back to products offers */}
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
                 <h5 className="text-xl font-bold text-slate-800">{t("offers.createOffer")}</h5>
              </div>
              
            </div>

            {/* create offer Form */}
            <div className="mt-5">
             <Createproductoffer/>

            </div>
            
          
        </div>
    )
};