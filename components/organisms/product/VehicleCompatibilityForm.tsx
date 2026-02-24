"use client";

import { FC, useEffect, useRef, useState, useCallback } from "react";
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
  brand: string;
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
  // ✅ Pass initial values directly as props so no guessing needed
  initialBrandId: string;
  initialModelId: string;
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
  initialBrandId,
  initialModelId,
}) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext<VehicleFormValues>();

  // ✅ Initialize directly from props — no useEffect sync needed
  const [selectedBrandId, setSelectedBrandId] = useState(initialBrandId);

  // ✅ Track whether this is the initial render to avoid resetting model on mount
  const isFirstRenderRef = useRef(true);
  const prevBrandIdRef = useRef(initialBrandId);

  // Fetch models for the selected brand
  const { data: modelsData, isLoading: modelsLoading } =
    useGetVehicleModelsByBrandQuery(selectedBrandId, {
      skip: !selectedBrandId,
      refetchOnMountOrArgChange: true,
    });

  // ✅ Once models load, re-apply the initialModelId (only on first load)
  useEffect(() => {
    if (!initialModelId) return;
    if (modelsLoading || !modelsData?.data?.length) return;
    if (!isFirstRenderRef.current) return;

    const modelExists = modelsData.data.some(
      (m: any) => String(m.id) === initialModelId,
    );

    if (modelExists) {
      setValue(`compatibility.${index}.model_id`, initialModelId, {
        shouldValidate: false,
      });
    }

    // Mark as done so we never overwrite a user selection
    isFirstRenderRef.current = false;
  }, [modelsData, modelsLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBrandChange = useCallback(
    (value: any) => {
      const brandId =
        typeof value === "string" ? value : value?.target?.value || value;

      // Only clear model if brand actually changed from what was there before
      if (brandId !== prevBrandIdRef.current) {
        // Not the initial load anymore — user is actively changing brand
        isFirstRenderRef.current = false;
        setValue(`compatibility.${index}.model_id`, "", { shouldValidate: false });
        prevBrandIdRef.current = brandId;
      }

      setSelectedBrandId(brandId);
    },
    [index, setValue],
  );

  // model options: value = m.id from API
  const modelOptions: SelectOption[] =
    modelsData?.data?.map((m: any) => ({
      label: m.name,
      value: String(m.id),
    })) || [];

  return (
    <div className="border border-gray-300 mt-5 mb-5 rounded-lg p-4 relative space-y-4">
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
          label={t("createproduct.vehicleForm.compatibility.fields.vehicleType")}
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
          onChange={handleBrandChange}
        />

        {/* model_id value = m.id from API (vehicle.model?.id) */}
        <SelectField
          name={`compatibility.${index}.model_id`}
          label={t("createproduct.vehicleForm.compatibility.fields.model")}
          options={modelOptions}
          disabled={!selectedBrandId || modelsLoading}
        />

        <SelectField
          name={`compatibility.${index}.year`}
          label={t("createproduct.vehicleForm.mainVehicle.fields.year")}
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
  const isInitializingRef = useRef(false);
  const prevInitialDataRef = useRef<string>("");

  useEffect(() => {
    onDataChangeRef.current = onDataChange;
    onValidationChangeRef.current = onValidationChange;
  }, [onDataChange, onValidationChange]);

  /* ===============================
     Data Fetching
  ================================ */
  const { data: brandsData } = useGetBrandsQuery();
  const { data: vehicleTypesData } = useGetVehicleTypesQuery();
  const { data: bodyTypesData } = useGetVehicleBodyTypesQuery();

  /* ===============================
     Process Initial Data
  ================================ */
  const getInitialValues = useCallback((): VehicleFormValues => {
    if (!initialData || initialData.length === 0) {
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

    const mainVehicle = initialData.find((v) => v.is_main);
    const compatibilityVehicles = initialData.filter((v) => !v.is_main);

    return {
      mainVehicle: mainVehicle
        ? {
            type_id: mainVehicle.type_id || "",
            body_type_id: mainVehicle.body_type_id || "",
            brand: mainVehicle.brand || "",
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
              brand: v.brand || "",
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
  }, [initialData]);

  /* ===============================
     Form Setup
  ================================ */
  const methods = useForm<VehicleFormValues>({
    resolver: yupResolver(vehicleSchema) as any,
    mode: "onChange",
    defaultValues: getInitialValues(),
  });

  const { watch, formState, setValue, reset } = methods;

  // ✅ Initialize main brand from initialData directly
  const [mainVehicleBrandId, setMainVehicleBrandId] = useState(
    () => initialData?.find((v) => v.is_main)?.brand || "",
  );
  const prevMainBrandIdRef = useRef(
    initialData?.find((v) => v.is_main)?.brand || "",
  );
  const mainIsFirstRenderRef = useRef(true);

  /* ===============================
     Main Vehicle Models Fetching
  ================================ */
  const { data: mainModelsData, isLoading: mainModelsLoading } =
    useGetVehicleModelsByBrandQuery(mainVehicleBrandId, {
      skip: !mainVehicleBrandId,
      refetchOnMountOrArgChange: true,
    });

  // ✅ Re-apply main vehicle model_id once models load (first render only)
  const initialMainModelId = initialData?.find((v) => v.is_main)?.model_id || "";
  useEffect(() => {
    if (!initialMainModelId) return;
    if (mainModelsLoading || !mainModelsData?.data?.length) return;
    if (!mainIsFirstRenderRef.current) return;

    const modelExists = mainModelsData.data.some(
      (m: any) => String(m.id) === initialMainModelId,
    );

    if (modelExists) {
      setValue("mainVehicle.model_id", initialMainModelId, {
        shouldValidate: false,
      });
    }

    mainIsFirstRenderRef.current = false;
  }, [mainModelsData, mainModelsLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMainBrandChange = useCallback((value: any) => {
    const brandId =
      typeof value === "string" ? value : value?.target?.value || value;

    if (brandId !== prevMainBrandIdRef.current) {
      mainIsFirstRenderRef.current = false;
      setValue("mainVehicle.model_id", "", { shouldValidate: false });
      prevMainBrandIdRef.current = brandId;
    }

    setMainVehicleBrandId(brandId);
  }, [setValue]);

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
    return { label: `${year}`, value: `${year}` };
  });

  /* ===============================
     Reset form when initialData changes
  ================================ */
  useEffect(() => {
    const currentInitialDataStr = JSON.stringify(initialData || []);
    if (currentInitialDataStr === prevInitialDataRef.current) return;

    prevInitialDataRef.current = currentInitialDataStr;
    isInitializingRef.current = true;

    if (initialData && initialData.length > 0) {
      const newValues = getInitialValues();
      reset(newValues);

      const mainVehicleData = initialData.find((v) => v.is_main);
      if (mainVehicleData?.brand) {
        setMainVehicleBrandId(mainVehicleData.brand);
        prevMainBrandIdRef.current = mainVehicleData.brand;
        mainIsFirstRenderRef.current = true; // allow re-apply after reset
      }

      setTimeout(() => {
        setIsInitialized(true);
        isInitializingRef.current = false;
      }, 100);
    } else if (!isInitialized) {
      setIsInitialized(true);
      isInitializingRef.current = false;
    } else {
      isInitializingRef.current = false;
    }
  }, [initialData, reset, getInitialValues, isInitialized]);

  /* ===============================
     Payload Builder
  ================================ */
  const buildVehiclesPayload = useCallback(
    (values: VehicleFormValues): VehicleData[] => {
      const vehicles: VehicleData[] = [];

      const main = values.mainVehicle;
      if (main?.year && main?.type_id && main?.model_id && main?.body_type_id) {
        const year = main.year.includes("-") ? main.year.split("-")[0] : main.year;
        vehicles.push({
          year,
          type_id: main.type_id,
          model_id: main.model_id,
          body_type_id: main.body_type_id,
          is_main: true,
          brand: main.brand || "",
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
            brand: c.brand || "",
          });
        }
      });

      return vehicles;
    },
    [],
  );

  /* ===============================
     Watch form changes and notify parent
  ================================ */
  useEffect(() => {
    if (!isInitialized || isInitializingRef.current) return;

    const subscription = watch((values) => {
      const payload = buildVehiclesPayload(values as VehicleFormValues);
      onDataChangeRef.current?.(payload);
    });
    return () => subscription.unsubscribe();
  }, [watch, isInitialized, buildVehiclesPayload]);

  useEffect(() => {
    if (!isInitializingRef.current) {
      onValidationChangeRef.current?.(formState.isValid);
    }
  }, [formState.isValid]);

  const compatibility = watch("compatibility") ?? [];

  // ✅ Build a stable list of compatibility initial values to pass as props
  const compatibilityInitialData = initialData?.filter((v) => !v.is_main) || [];

  /* ===============================
     Handlers
  ================================ */
  const handleAddCompatibility = useCallback(() => {
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
  }, [compatibility, setValue]);

  const handleSaveCompatibility = useCallback(() => {
    const values = methods.getValues();
    const payload = buildVehiclesPayload(values);
    onDataChange?.(payload);
  }, [methods, buildVehiclesPayload, onDataChange]);

  const handleRemoveCompatibility = useCallback(
    (index: number) => {
      setValue(
        "compatibility",
        compatibility.filter((_, i) => i !== index),
      );
    },
    [compatibility, setValue],
  );

  /* ===============================
     Render
  ================================ */
  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        {/* MAIN VEHICLE */}
        <Card className="border border-gray-300 bg-white">
          <CardHeader>
            <CardTitle>
              {t("createproduct.vehicleForm.mainVehicle.title")}
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="mainVehicle.type_id"
              label={t("createproduct.vehicleForm.mainVehicle.fields.vehicleType")}
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
              onChange={handleMainBrandChange}
            />

            <SelectField
              name="mainVehicle.model_id"
              label={t("createproduct.vehicleForm.mainVehicle.fields.model")}
              options={mainModelOptions}
              disabled={!mainVehicleBrandId || mainModelsLoading}
            />

            <SelectField
              name="mainVehicle.year"
              label={t("createproduct.vehicleForm.mainVehicle.fields.year")}
              options={yearOptions}
            />
          </CardContent>
        </Card>

        {/* COMPATIBILITY */}
        <Card className="border border-gray-300 bg-white">
          <CardHeader>
            <CardTitle>
              {t("createproduct.vehicleForm.compatibility.title")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-">
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

            {compatibility.map((_, index) => {
              // ✅ Pull initial brand/model from initialData by index
              const initialItem = compatibilityInitialData[index];
              return (
                <CompatibilityFormItem
                  // ✅ Use a stable key based on initial data so React remounts
                  // the component when initialData changes (resets internal state)
                  key={`compat-${initialItem?.brand || ""}-${initialItem?.model_id || ""}-${index}`}
                  index={index}
                  brandOptions={brandOptions}
                  vehicleTypeOptions={vehicleTypeOptions}
                  bodyTypeOptions={bodyTypeOptions}
                  yearOptions={yearOptions}
                  canRemove={compatibility.length > 1}
                  onRemove={() => handleRemoveCompatibility(index)}
                  initialBrandId={initialItem?.brand || ""}
                  initialModelId={initialItem?.model_id || ""}
                />
              );
            })}

            <Button
              type="button"
              className="bg-[var(--theme-color-accent)] text-white"
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