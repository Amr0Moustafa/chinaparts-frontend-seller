"use client";

import { FC } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputField } from "@/components/atoms/input";
import SelectField from "@/components/atoms/SelectField";
import { Car, Plus, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

export const VehicleForm: FC = () => {
  const { t } = useTranslation();
  const methods = useForm(); // ✅ initialize RHF

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Main Vehicle */}
        <Card className="bg-white border border-gray-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <Car className="text-orange-500" />
              <h5 className="font-bold">{t("createproduct.vehicleForm.mainVehicle.title")}</h5>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="vehicleType"
                label={t("createproduct.vehicleForm.mainVehicle.fields.vehicleType")}
                options={[
                  { label: "Car", value: "car" },
                  { label: "Truck", value: "truck" },
                ]}
                placeholder={t("createproduct.vehicleForm.mainVehicle.placeholders.vehicleType")}
                className="bg-[var(--theme-light-gray)]"
              />
              <SelectField
                name="brand"
                label={t("createproduct.vehicleForm.mainVehicle.fields.brand")}
                options={[
                  { label: "Toyota", value: "toyota" },
                  { label: "Honda", value: "honda" },
                ]}
                placeholder={t("createproduct.vehicleForm.mainVehicle.placeholders.brand")}
                className="bg-[var(--theme-light-gray)]"
              />
              <SelectField
                name="model"
                label={t("createproduct.vehicleForm.mainVehicle.fields.model")}
                options={[
                  { label: "Camry", value: "camry" },
                  { label: "Civic", value: "civic" },
                ]}
                placeholder={t("createproduct.vehicleForm.mainVehicle.placeholders.model")}
                className="bg-[var(--theme-light-gray)]"
              />
              <SelectField
                name="year"
                label={t("createproduct.vehicleForm.mainVehicle.fields.year")}
                options={[
                  { label: "2020", value: "2020" },
                  { label: "2021", value: "2021" },
                ]}
                placeholder={t("createproduct.vehicleForm.mainVehicle.placeholders.year")}
                className="bg-[var(--theme-light-gray)]"
              />
              <InputField
                name="partNumber"
                label={t("createproduct.vehicleForm.mainVehicle.fields.partNumber")}
                placeholder={t("createproduct.vehicleForm.mainVehicle.placeholders.partNumber")}
                className="bg-[var(--theme-light-gray)]"
              />
              <SelectField
                name="bodyType"
                label={t("createproduct.vehicleForm.mainVehicle.fields.bodyType")}
                options={[
                  { label: "SUV", value: "suv" },
                  { label: "Sedan", value: "sedan" },
                ]}
                placeholder={t("createproduct.vehicleForm.mainVehicle.placeholders.bodyType")}
                className="bg-[var(--theme-light-gray)]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Compatibility */}
        <Card className="bg-white border border-gray-300">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1">
              <Truck className="text-orange-500" />
              <h5 className="font-bold">{t("createproduct.vehicleForm.compatibility.title")}</h5>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="py-2 px-4 font-bold text-gray-900 bg-white border border-gray-300"
            >
              <Plus className="text-orange-500" /> {t("createproduct.vehicleForm.compatibility.addButton")}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="compatVehicleType"
                label={t("createproduct.vehicleForm.compatibility.fields.vehicleType")}
                options={[
                  { label: "Car", value: "car" },
                  { label: "Truck", value: "truck" },
                ]}
                placeholder={t("createproduct.vehicleForm.compatibility.placeholders.vehicleType")}
                className="bg-[var(--theme-light-gray)]"
              />
              <SelectField
                name="compatBodyType"
                label={t("createproduct.vehicleForm.compatibility.fields.bodyType")}
                options={[
                  { label: "4x4", value: "4x4" },
                  { label: "SUV", value: "suv" },
                ]}
                placeholder={t("createproduct.vehicleForm.compatibility.placeholders.bodyType")}
                className="bg-[var(--theme-light-gray)]"
              />
              <SelectField
                name="compatMake"
                label={t("createproduct.vehicleForm.compatibility.fields.make")}
                options={[
                  { label: "Toyota", value: "toyota" },
                  { label: "Honda", value: "honda" },
                ]}
                placeholder={t("createproduct.vehicleForm.compatibility.placeholders.make")}
                className="bg-[var(--theme-light-gray)]"
              />
              <SelectField
                name="compatModel"
                label={t("createproduct.vehicleForm.compatibility.fields.model")}
                options={[
                  { label: "Camry", value: "camry" },
                  { label: "Corolla", value: "corolla" },
                ]}
                placeholder={t("createproduct.vehicleForm.compatibility.placeholders.model")}
                className="bg-[var(--theme-light-gray)]"
              />
              <SelectField
                name="yearRange"
                label={t("createproduct.vehicleForm.compatibility.fields.yearRange")}
                options={[
                  { label: "2018-2020", value: "2018-2020" },
                  { label: "2021-2023", value: "2021-2023" },
                ]}
                placeholder={t("createproduct.vehicleForm.compatibility.placeholders.yearRange")}
                className="bg-[var(--theme-light-gray)]"
              />
              <InputField
                name="compatPartNumber"
                label={t("createproduct.vehicleForm.compatibility.fields.partNumber")}
                placeholder={t("createproduct.vehicleForm.compatibility.placeholders.partNumber")}
                className="bg-[var(--theme-light-gray)]"
              />
            </div>
            {/* Submit */}
        <Button
          type="submit"
          className="bg-orange-500 mt-4 text-white px-4 py-2 rounded-md"
        >
          {t("createproduct.vehicleForm.submit.saveVehicle")}
        </Button>
          </CardContent>
        </Card>

        
      </form>
    </FormProvider>
  );
};
