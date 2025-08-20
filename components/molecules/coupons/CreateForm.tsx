"use client";

import React from "react";
import { useForm, FormProvider, Field, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {InputField } from "@/components/atoms/input"; 
import SelectField  from "@/components/atoms/SelectField"; 
import { toast } from "react-hot-toast";
import { createCouponSchema } from "@/lib/validation";
import { useTranslation } from "react-i18next";

type FormValues = {
  productName: string;
  couponCode: string;
  couponTitle: string;
  discountType: string;
  discountValue: string;
  minimumOrderValue: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
 
};

interface FormProps {
  formData?: FormValues;
}

const productOptions = [
  { value: "automotive", label: "Automotive" },
  { value: "electronics", label: "Electronics" },
  { value: "home", label: "Home & Kitchen" }
];

const discountOptions = [
  { value: "5", label: "5%" },
  { value: "10", label: "10%" },
  { value: "20", label: "20%" }
];


export const CreateForm = ( {formData}:FormProps) => {
  const { t }=useTranslation()
  const methods = useForm<FormValues>({
    resolver: yupResolver(createCouponSchema),
    defaultValues: {
      productName: "",
      couponCode: "",
      couponTitle: "",
      discountType: "",
      discountValue: "",
      minimumOrderValue: 0,
      usageLimit: 0,
      startDate: "",
      endDate: "",
      
    }
  });

  const { handleSubmit, formState: { errors } } = methods;

  const onSubmit = (data: FieldValues) => {
    console.log("Form submitted:", data);
    toast.success("Coupon created successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField
                 className="bg-[var(--theme-light-gray)] py-3"
                  label={t("coupons.form.productName")}
                  name="productName"
                  options={productOptions}
                  placeholder={t("coupons.form.productName")}
                />
                <InputField className="bg-[var(--theme-light-gray)] py-3"
                  label={t("coupons.form.couponCode")}
                  name="couponCode"
                  placeholder="e.g., SAVE10"
                />
                <InputField className="bg-[var(--theme-light-gray)] py-3"
                  label={t("coupons.form.couponTitle")}
                  name="couponTitle"
                  placeholder="e.g., Automotive Data Science"
                />
                <SelectField
                 className="bg-[var(--theme-light-gray)] py-3"
                  label={t("coupons.form.discountType")}
                  name="discountType"
                  options={discountOptions}
                  placeholder={t("coupons.form.discountType")}
                />
                
                <InputField className="bg-[var(--theme-light-gray)] py-3"
                 label={t("coupons.form.discountValue")}
                  name="discountValue"
                  placeholder="20"
                />
                <InputField className="bg-[var(--theme-light-gray)] py-3"
                  label={t("coupons.form.minimumOrderValue")}
                  name="minimumOrderValue"
                  placeholder="50"
                />
                <InputField className="bg-[var(--theme-light-gray)] py-3"
                  label={t("coupons.form.usageLimit")}
                  name="usageLimit"
                  placeholder="100"
                />
                 <InputField className="bg-[var(--theme-light-gray)] py-3"
                  label={t("coupons.form.startDate")}
                  name="startDate"
                  type="date"
                />
                <InputField className="bg-[var(--theme-light-gray)] py-3"
                  label={t("coupons.form.endDate")}
                  name="endDate"
                  type="date"
                />
               
              </div>

              

              

             
              {/* Submit */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600  font-bold py-3 px-8 rounded-lg transition-all duration-200"
                >
                  {formData ? t("coupons.form.updateCoupon") : t("coupons.form.addCoupon")}
                 
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
