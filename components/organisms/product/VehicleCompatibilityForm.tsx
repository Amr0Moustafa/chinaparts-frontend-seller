"use client";

import { FC, useEffect, useRef, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SelectField from "@/components/atoms/SelectField";
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  useGetBrandsQuery,
  useGetVehicleTypesQuery,
  useGetVehicleModelsByBrandQuery,
  useGetVehicleBodyTypesQuery,
} from "@/features/sellerAttributes";

/* ===============================
   Types
================================ */
interface SelectOption {
  label: string;
  value: string;
}

interface CompatibilityItem {
  type_id?: string;
  body_type_id?: string;
  brand?: string;
  model_id?: string;
  year?: string;
}

interface MainVehicle {
  type_id: string;
  body_type_id: string;
  brand: string;
  model_id: string;
  year: string;
}

interface VehicleFormValues {
  mainVehicle: MainVehicle;
  compatibility: CompatibilityItem[];
}

interface VehiclePayload {
  vehicles: {
    year: string;
    type_id: string;
    model_id: string;
    body_type_id: string;
    is_main: boolean;
  }[];
}
export interface VehicleData {
  year: string;
  type_id: string;
  model_id: string;
  body_type_id: string;
  is_main: boolean;
}
interface VehicleFormProps {
  onDataChange?: (data: VehicleData[]) => void;
  onValidationChange?: (isValid: boolean) => void;
}

interface CompatibilityFormItemProps {
  index: number;
  brandOptions: SelectOption[];
  vehicleTypeOptions: SelectOption[];
  bodyTypeOptions: SelectOption[];
  yearOptions: SelectOption[];
  onRemove: () => void;
  canRemove: boolean;
}

/* ===============================
   Validation Schema
================================ */
const vehicleSchema = yup.object({
  mainVehicle: yup.object({
    type_id: yup.string().required("Vehicle type is required"),
    body_type_id: yup.string().required("Body type is required"),
    brand: yup.string().required("Brand is required"),
    model_id: yup.string().required("Model is required"),
    year: yup.string().required("Year is required"),
  }),
  compatibility: yup
    .array()
    .of(
      yup.object({
        type_id: yup.string().optional(),
        body_type_id: yup.string().optional(),
        brand: yup.string().optional(),
        model_id: yup.string().optional(),
        year: yup.string().optional(),
      }),
    )
    .required(),
});

/* ===============================
   Compatibility Item Component
================================ */
const CompatibilityFormItem: FC<CompatibilityFormItemProps> = ({
  index,
  brandOptions,
  vehicleTypeOptions,
  bodyTypeOptions,
  yearOptions,
  onRemove,
  canRemove,
}) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext<VehicleFormValues>();
  // State to hold the selected brand
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  // Reset model when brand changes
  useEffect(() => {
    if (selectedBrand) {
      setValue(`compatibility.${index}.model_id`, "");
    }
  }, [selectedBrand, index, setValue]);

  // Only fetch models if brand is selected and valid
  const shouldFetchModels = Boolean(
    selectedBrand && selectedBrand.trim() !== "",
  );

  // Fetch models using RTK Query
  const { data: modelsData, isLoading: modelsLoading } =
    useGetVehicleModelsByBrandQuery(selectedBrand || "", {
      skip: !shouldFetchModels,
    });
  const modelOptions: SelectOption[] =
    modelsData?.data?.map((m: any) => ({
      label: m.name,
      value: String(m.id),
    })) || [];

  return (
    <div className="border border-gray-300 rounded-lg p-4 relative space-y-4">
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="absolute top-2 right-2 text-red-500"
          aria-label="Remove compatibility item"
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          name={`compatibility.${index}.type_id`}
          label={t(
            "createproduct.vehicleForm.compatibility.fields.vehicleType",
          )}
          options={vehicleTypeOptions}
        />

        <SelectField
          name={`compatibility.${index}.body_type_id`}
          label={t("createproduct.vehicleForm.compatibility.fields.bodyType")}
          options={bodyTypeOptions}
        />

        <SelectField
          name={`compatibility.${index}.brand`}
          label={t("createproduct.vehicleForm.mainVehicle.fields.brand")}
          options={brandOptions}
          onChange={(e: any) => setSelectedBrand(e.target.value)} // update state
        />

        <SelectField
          name={`compatibility.${index}.model_id`}
          label={t("createproduct.vehicleForm.compatibility.fields.model")}
          options={modelOptions}
          disabled={!shouldFetchModels || modelsLoading}
        />

        <SelectField
          name={`compatibility.${index}.year`}
          label={t("createproduct.vehicleForm.compatibility.fields.yearRange")}
          options={yearOptions}
        />
      </div>
    </div>
  );
};

/* ===============================
   Main Vehicle Form Component
================================ */
export const VehicleForm: FC<VehicleFormProps> = ({
  onDataChange,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const onDataChangeRef = useRef(onDataChange);
  const onValidationChangeRef = useRef(onValidationChange);

  // Keep refs updated
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
    onValidationChangeRef.current = onValidationChange;
  }, [onDataChange, onValidationChange]);

  /* ===============================
     Form Setup
  ================================ */
  const methods = useForm<VehicleFormValues>({
    resolver: yupResolver(vehicleSchema),
    mode: "onChange",
    defaultValues: {
      mainVehicle: {
        type_id: "",
        body_type_id: "",
        brand: "",
        model_id: "",
        year: "",
      },
      compatibility: [
        {
          type_id: "",
          body_type_id: "",
          brand: "",
          model_id: "",
          year: "",
        },
      ],
    },
  });

  const { watch, formState, setValue } = methods;
  const mainVehicle = watch("mainVehicle");
  /* ===============================
     Data Fetching
  ================================ */
  const { data: brandsData } = useGetBrandsQuery();
  const { data: vehicleTypesData } = useGetVehicleTypesQuery();
  const { data: bodyTypesData } = useGetVehicleBodyTypesQuery();
  const [selectBrand, setselectBrand] = useState<string>("");
  console.log(selectBrand);
  const { data: mainModelsData, isLoading: mainModelsLoading } =
    useGetVehicleModelsByBrandQuery(selectBrand || "", {
      refetchOnMountOrArgChange: true,
    });

  // Reset main vehicle model when brand changes
  useEffect(() => {
    if (selectBrand) {
      setValue("mainVehicle.model_id", "");
    }
  }, [selectBrand, setValue]);

  /* ===============================
     Options Mapping
  ================================ */
  const brandOptions: SelectOption[] =
    brandsData?.data?.map((b: any) => ({
      label: b.name,
      value: String(b.id),
    })) || [];

  const vehicleTypeOptions: SelectOption[] =
    vehicleTypesData?.data?.map((t: any) => ({
      label: t.name,
      value: String(t.id),
    })) || [];

  const bodyTypeOptions: SelectOption[] =
    bodyTypesData?.data?.map((b: any) => ({
      label: b.name,
      value: String(b.id),
    })) || [];

  const mainModelOptions: SelectOption[] =
    mainModelsData?.data?.map((m: any) => ({
      label: m.name,
      value: String(m.id),
    })) || [];
  const yearOptions: SelectOption[] = Array.from({ length: 30 }).map((_, i) => {
    const year = 1995 + i; // just the year
    return {
      label: `${year}`,
      value: `${year}`,
    };
  });

  /* ===============================
     Payload Builder
  ================================ */
  const buildVehiclesPayload = (values: VehicleFormValues): VehicleData[] => {
    const vehicles: VehicleData[] = [];

    const main = values.mainVehicle;
    if (main?.year && main?.type_id && main?.model_id && main?.body_type_id) {
      const year = main.year.includes("-")
        ? main.year.split("-")[0]
        : main.year;
      vehicles.push({
        year,
        type_id: main.type_id,
        model_id: main.model_id,
        body_type_id: main.body_type_id,
        is_main: true,
      });
    }

    values.compatibility?.forEach((c) => {
      if (c?.year && c?.type_id && c?.model_id && c?.body_type_id) {
        const year = c.year.includes("-") ? c.year.split("-")[0] : c.year;
        vehicles.push({
          year,
          type_id: c.type_id,
          model_id: c.model_id,
          body_type_id: c.body_type_id,
          is_main: false,
        });
      }
    });

    return vehicles; // ✅ Returns array directly
  };

  /* ===============================
     Effects
  ================================ */

  useEffect(() => {
    if (!mainVehicle) return;

    // Only save if all required fields are filled
    const { year, type_id, model_id, body_type_id } = mainVehicle;
    if (year && type_id && model_id && body_type_id) {
      // Build payload as array with just the main vehicle
      const payload: VehicleData[] = [
        {
          year,
          type_id,
          model_id,
          body_type_id,
          is_main: true,
        },
      ];

      console.log("Auto-saving main vehicle:", payload);
      onDataChangeRef.current?.(payload);
    }
  }, [mainVehicle]);

  // Watch form changes and notify parent
  useEffect(() => {
    const subscription = watch((values) => {
      const payload = buildVehiclesPayload(values as VehicleFormValues);
      onDataChangeRef.current?.(payload); // ✅ payload is VehicleData[]
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Notify parent of validation state changes
  useEffect(() => {
    onValidationChangeRef.current?.(formState.isValid);
  }, [formState.isValid]);

  const compatibility = watch("compatibility") ?? [];

  /* ===============================
     Handlers
  ================================ */
  const handleAddCompatibility = () => {
    setValue("compatibility", [
      ...compatibility,
      {
        type_id: "",
        body_type_id: "",
        brand: "",
        model_id: "",
        year: "",
      },
    ]);
  };

  const handleSaveCompatibility = () => {
    // Get current form values
    const values = methods.getValues();

    // Build payload using your existing builder
    const payload = buildVehiclesPayload(values);

    // Call parent callback if provided
    onDataChange?.(payload);
  };

  const handleRemoveCompatibility = (index: number) => {
    setValue(
      "compatibility",
      compatibility.filter((_, i) => i !== index),
    );
  };

  /* ===============================
     Render
  ================================ */
  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        {/* MAIN VEHICLE */}
        <Card className="border border-gray-300">
          <CardHeader>
            <CardTitle>
              {t("createproduct.vehicleForm.mainVehicle.title")}
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="mainVehicle.type_id"
              label={t(
                "createproduct.vehicleForm.mainVehicle.fields.vehicleType",
              )}
              options={vehicleTypeOptions}
            />

            <SelectField
              name="mainVehicle.body_type_id"
              label={t("createproduct.vehicleForm.mainVehicle.fields.bodyType")}
              options={bodyTypeOptions}
            />

            <SelectField
              name="mainVehicle.brand"
              label={t("createproduct.vehicleForm.mainVehicle.fields.brand")}
              options={brandOptions}
              onChange={(e: any) => setselectBrand(e.target.value)}
            />

            <SelectField
              name="mainVehicle.model_id"
              label={t("createproduct.vehicleForm.mainVehicle.fields.model")}
              options={mainModelOptions}
              disabled={mainModelsLoading}
            />

            <SelectField
              name="mainVehicle.year"
              label={t("createproduct.vehicleForm.mainVehicle.fields.year")}
              options={yearOptions}
            />
          </CardContent>
        </Card>

        {/* COMPATIBILITY */}
        <Card className="border border-gray-300">
          <CardHeader>
            <CardTitle>
              {t("createproduct.vehicleForm.compatibility.title")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCompatibility}
                className="flex items-center border border-gray-300"
              >
                <Plus className="w-4 h-4 mr-2 text-[var(--theme-color-accent)]" />
                {t("createproduct.vehicleForm.compatibility.addButton")}
              </Button>
            </div>

            {compatibility.map((_, index) => (
              <CompatibilityFormItem
                key={index}
                index={index}
                brandOptions={brandOptions}
                vehicleTypeOptions={vehicleTypeOptions}
                bodyTypeOptions={bodyTypeOptions}
                yearOptions={yearOptions}
                canRemove={compatibility.length > 1}
                onRemove={() => handleRemoveCompatibility(index)}
              />
            ))}
            <Button
              type="button"
              className="bg-[var(--theme-color-accent)] text-white "
              onClick={handleSaveCompatibility}
            >
              {t("createproduct.vehicleForm.submit.saveVehicle")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};
