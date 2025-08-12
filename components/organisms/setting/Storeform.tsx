"use client";

import React from "react";
import {
  useForm,
  FormProvider,
  FieldValues,
  useFieldArray,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "@/components/atoms/input";
import { toast } from "react-hot-toast";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Building, MapPin, Store, Upload, X } from "lucide-react";
import * as yup from "yup";
import { storeSchema } from "@/lib/validation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { StoreFormValues } from "@/types/StoreSetting";

export const StoreForm = () => {
  const { t } = useTranslation();

  const methods = useForm<StoreFormValues>({
    resolver: yupResolver(storeSchema),
    defaultValues: {
      storeName: "",
      storeDescription: "",
      businessAddress: "",
      mainImage: null,
      city: "",
      zipCode: "",
      phoneNumber: "",
      email: "",
      shippingCompanies: [
        { companyName: "", companyContact: "", companyLogo: null },
      ],
    },
  });

  const { handleSubmit, control, setValue } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shippingCompanies",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setValue("mainImage", files[0]);
    }
  };

  const onSubmit = (data: FieldValues) => {
    console.log("Store Form submitted:", data);
    toast.success(t("storeSetting.toast.success"));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Information */}
          <Card className="bg-white border border-gray-300">
            <div className="px-4">
              <SectionHeader
                icon={Store}
                title={t("storeSetting.store.information")}
              />
            </div>
            <CardContent className="pt-0 space-y-3">
              <InputField
                labelColor="text-gray-900"
                className="bg-[var(--theme-light-gray)]"
                label={t("storeSetting.store.name")}
                name="storeName"
                placeholder={t("storeSetting.store.namePlaceholder")}
              />

              <div className="space-y-4">
                <Label>{t("storeSetting.store.description")}</Label>
                <Textarea
                  name="storeDescription"
                  placeholder={t("storeSetting.store.descriptionPlaceholder")}
                />
              </div>

              {/* Store Logo Upload */}
              <div className="space-y-4">
                <label
                  htmlFor="image-upload"
                  className="flex py-2 flex-col h-full items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition text-center"
                >
                  <Upload className="text-[40px] text-gray-500" />
                  <span className="text-sm text-gray-500 font-medium">
                    {t("storeSetting.store.mainImage")}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {t("storeSetting.store.recommended")}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {t("storeSetting.store.formats")}
                  </span>
                </label>

                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Contact */}
          <Card className="bg-white border border-gray-300">
            <div className="px-4">
              <SectionHeader
                icon={MapPin}
                title={t("storeSetting.location.contact")}
              />
            </div>
            <CardContent className="pt-0 space-y-3">
              <InputField
                labelColor="text-gray-900"
                className="bg-[var(--theme-light-gray)]"
                label={t("storeSetting.location.businessAddress")}
                name="businessAddress"
                placeholder={t(
                  "storeSetting.location.businessAddressPlaceholder"
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  labelColor="text-gray-900"
                  className="bg-[var(--theme-light-gray)]"
                  label={t("storeSetting.location.city")}
                  name="city"
                  placeholder={t("storeSetting.location.cityPlaceholder")}
                />
                <InputField
                  labelColor="text-gray-900"
                  className="bg-[var(--theme-light-gray)]"
                  label={t("storeSetting.location.zipCode")}
                  name="zipCode"
                  placeholder={t("storeSetting.location.zipCodePlaceholder")}
                />
              </div>
              <InputField
                labelColor="text-gray-900"
                className="bg-[var(--theme-light-gray)]"
                label={t("storeSetting.location.phoneNumber")}
                name="phoneNumber"
                placeholder={t("storeSetting.location.phoneNumberPlaceholder")}
              />
              <InputField
                labelColor="text-gray-900"
                className="bg-[var(--theme-light-gray)]"
                label={t("storeSetting.location.email")}
                name="email"
                placeholder={t("storeSetting.location.emailPlaceholder")}
                type="email"
              />
            </CardContent>
          </Card>

          {/* Shipping Company Information */}
          <Card className="bg-white border border-gray-300">
            <div className="px-4">
              <SectionHeader
                icon={Building}
                title={t("storeSetting.shipping.information")}
              />
            </div>
            <CardContent className="pt-0 space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-3 border-b border-gray-300 pb-4 last:border-none relative"
                >
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  )}

                  <InputField
                    labelColor="text-gray-900"
                    className="bg-[var(--theme-light-gray)]"
                    label={t("storeSetting.shipping.companyName")}
                    name={`shippingCompanies.${index}.companyName`}
                    placeholder={t(
                      "storeSetting.shipping.companyNamePlaceholder"
                    )}
                  />
                  <InputField
                    labelColor="text-gray-900"
                    className="bg-[var(--theme-light-gray)]"
                    label={t("storeSetting.shipping.companyContact")}
                    name={`shippingCompanies.${index}.companyContact`}
                    placeholder={t(
                      "storeSetting.shipping.companyContactPlaceholder"
                    )}
                  />
                  <InputField
                    labelColor="text-gray-900"
                    className="bg-[var(--theme-light-gray)]"
                    label={t("storeSetting.shipping.companyLogo")}
                    name={`shippingCompanies.${index}.companyLogo`}
                    type="file"
                  />
                </div>
              ))}
              <div className="flex justify-between">
                <button
                  type="button"
                  disabled={fields.length > 2}
                  onClick={() =>
                    append({
                      companyName: "",
                      companyContact: "",
                      companyLogo: null,
                    })
                  }
                  className="disabled:cursor-not-allowed disabled:bg-gray-200 border border-gray-300 px-4 py-2 rounded-lg"
                >
                  {t("storeSetting.shipping.addAnother")}
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                  {t("storeSetting.shipping.saveCompanies")}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </FormProvider>
  );
};
