import React from "react";
import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "@/components/atoms/input";
import SelectField from "@/components/atoms/SelectField";
import { toast } from "react-hot-toast";
import { createProductOfferSchema } from "@/lib/validation";
import { useTranslation } from "react-i18next";

type FormValues = {
  offerName: string;
  productName: string;
  originalPrice: number;
  offerPrice: number;
  startDate: string;
  endDate: string;
};

interface  ProductOfferProps{
  formData?:FormValues
}
// Dropdown options
const offerNameOptions = [
  { value: "all", label: "All Products" },
  { value: "summer-sale", label: "Summer Sale" },
  { value: "clearance", label: "Clearance" },
];

const productOptions = [
  { value: "all", label: "All Products" },
  { value: "car", label: "Car Accessories" },
  { value: "laptop", label: "Laptop" },
];
export const Createproductoffer = ({formData}:ProductOfferProps) => {
  const { t } = useTranslation();
  const methods = useForm<FormValues>({
    resolver: yupResolver(createProductOfferSchema),
    defaultValues: {
      offerName: "",
      productName: "",
      originalPrice: 0,
      offerPrice: 0,
      startDate: "",
      endDate: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FieldValues) => {
    console.log("Offer submitted:", data);
    toast.success("Offer created successfully!");
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      <div className="bg-white rounded-xl  p-6">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Dropdowns */}
            <SelectField
              name="offerName"
              label={t("offers.form.offerName")}
              options={offerNameOptions}
              placeholder="Select offer"
              className="bg-[var(--theme-light-gray)] py-3"
            />

            <SelectField
              name="productName"
              label={t("offers.form.productName")}
              options={productOptions}
              placeholder="Select product"
              className="bg-[var(--theme-light-gray)] py-3"
            />

            {/* Grid for inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="originalPrice"
                label={t("offers.form.originalPrice")}
                placeholder="86.99"
                type="number"
                step="0.01"
                className="bg-[var(--theme-light-gray)] py-3"
              />

              <InputField
                name="offerPrice"
                label={t("offers.form.offerPrice")}
                placeholder="56.99"
                type="number"
                step="0.01"
                className="bg-[var(--theme-light-gray)] py-3"
              />

              <InputField
                name="startDate"
                label={t("offers.form.startDate")}
                type="date"
                className="bg-[var(--theme-light-gray)] py-3"
              />

              <InputField
                name="endDate"
                label={t("offers.form.endDate")}
                type="date"
                className="bg-[var(--theme-light-gray)] py-3"
              />
            </div>

            {/* Button outside grid */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
              >
                {formData ? t("offers.form.updateOffer") : t("offers.form.createOffer")}
                
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Createproductoffer;
