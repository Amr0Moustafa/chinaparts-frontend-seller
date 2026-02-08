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
  initialData?: VehicleData[];
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
  const { setValue, watch } = useFormContext<VehicleFormValues>();
  
  // Watch the brand for this compatibility item
  const selectedBrand = watch(`compatibility.${index}.brand`);

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
  initialData,
}) => {
  const { t } = useTranslation();
  const onDataChangeRef = useRef(onDataChange);
  const onValidationChangeRef = useRef(onValidationChange);
  const [isInitialized, setIsInitialized] = useState(false);

  // Keep refs updated
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
    onValidationChangeRef.current = onValidationChange;
  }, [onDataChange, onValidationChange]);

  /* ===============================
     Data Fetching (moved up to get brand data first)
  ================================ */
  const { data: brandsData } = useGetBrandsQuery();
  const { data: vehicleTypesData } = useGetVehicleTypesQuery();
  const { data: bodyTypesData } = useGetVehicleBodyTypesQuery();

  /* ===============================
     Process Initial Data
  ================================ */
  const getInitialValues = () => {
    console.log("🔄 getInitialValues called with initialData:", initialData);

    if (!initialData || initialData.length === 0) {
      console.log("📝 No initial data, using defaults");
      return {
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
      };
    }

    // Find main vehicle
    const mainVehicle = initialData.find((v) => v.is_main);
    // Get compatibility vehicles (non-main)
    const compatibilityVehicles = initialData.filter((v) => !v.is_main);

    console.log("🚗 Main vehicle found:", mainVehicle);
    console.log("🔧 Compatibility vehicles found:", compatibilityVehicles);

    // Helper function to get brand ID from model ID
    const getBrandFromModel = (modelId: string): string => {
      // You'll need to fetch the model details to get the brand
      // For now, return empty string - we'll handle this with useEffect
      return "";
    };

    const result = {
      mainVehicle: mainVehicle
        ? {
            type_id: mainVehicle.type_id || "",
            body_type_id: mainVehicle.body_type_id || "",
            brand: getBrandFromModel(mainVehicle.model_id), // Will be set later
            model_id: mainVehicle.model_id || "",
            year: mainVehicle.year || "",
          }
        : {
            type_id: "",
            body_type_id: "",
            brand: "",
            model_id: "",
            year: "",
          },
      compatibility:
        compatibilityVehicles.length > 0
          ? compatibilityVehicles.map((v) => ({
              type_id: v.type_id || "",
              body_type_id: v.body_type_id || "",
              brand: getBrandFromModel(v.model_id), // Will be set later
              model_id: v.model_id || "",
              year: v.year || "",
            }))
          : [
              {
                type_id: "",
                body_type_id: "",
                brand: "",
                model_id: "",
                year: "",
              },
            ],
    };

    console.log("✅ Initial values prepared:", result);
    return result;
  };

  /* ===============================
     Form Setup
  ================================ */
  const methods = useForm<VehicleFormValues>({
    resolver: yupResolver(vehicleSchema),
    mode: "onChange",
    defaultValues: getInitialValues(),
  });

  const { watch, formState, setValue, reset } = methods;
  const mainVehicle = watch("mainVehicle");

  // Watch main vehicle brand
  const mainVehicleBrand = watch("mainVehicle.brand");

  /* ===============================
     Main Vehicle Models Fetching
  ================================ */
  const { data: mainModelsData, isLoading: mainModelsLoading } =
    useGetVehicleModelsByBrandQuery(mainVehicleBrand || "", {
      skip: !mainVehicleBrand || mainVehicleBrand.trim() === "",
    });

  // Reset main vehicle model when brand changes (but not on initial load)
  useEffect(() => {
    if (mainVehicleBrand && isInitialized) {
      setValue("mainVehicle.model_id", "");
    }
  }, [mainVehicleBrand, setValue, isInitialized]);

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
    const year = 1995 + i;
    return {
      label: `${year}`,
      value: `${year}`,
    };
  });

  /* ===============================
     Reset form when initialData changes
  ================================ */
  useEffect(() => {
    console.log("🔄 initialData changed, resetting form:", initialData);
    
    if (initialData && initialData.length > 0) {
      const newValues = getInitialValues();
      console.log("📝 Resetting form with values:", newValues);
      reset(newValues);
      
      // Mark as initialized after first reset
      setTimeout(() => setIsInitialized(true), 100);
    } else if (!isInitialized) {
      // First render with no data
      setIsInitialized(true);
    }
  }, [initialData]);

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

    return vehicles;
  };

  /* ===============================
     Effects
  ================================ */
  // Watch form changes and notify parent
  useEffect(() => {
    if (!isInitialized) return; // Don't notify during initialization

    const subscription = watch((values) => {
      const payload = buildVehiclesPayload(values as VehicleFormValues);
      console.log("📊 Form values changed, payload:", payload);
      onDataChangeRef.current?.(payload);
    });
    return () => subscription.unsubscribe();
  }, [watch, isInitialized]);

  // Notify parent of validation state changes
  useEffect(() => {
    onValidationChangeRef.current?.(formState.isValid);
  }, [formState.isValid]);

  const compatibility = watch("compatibility") ?? [];

  /* ===============================
     Debug Effect
  ================================ */
  useEffect(() => {
    console.log("📊 Current form state:", {
      mainVehicle,
      compatibility,
      isValid: formState.isValid,
      errors: formState.errors,
    });
  }, [mainVehicle, compatibility, formState.isValid, formState.errors]);

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
    const values = methods.getValues();
    const payload = buildVehiclesPayload(values);
    console.log("💾 Saving compatibility, payload:", payload);
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
            />

            <SelectField
              name="mainVehicle.model_id"
              label={t("createproduct.vehicleForm.mainVehicle.fields.model")}
              options={mainModelOptions}
              disabled={!mainVehicleBrand || mainModelsLoading}
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