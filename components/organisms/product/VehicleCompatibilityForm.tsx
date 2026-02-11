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
  useGetVehicleModelsQuery,
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
  
  // State for brand tracking
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [prevBrandId, setPrevBrandId] = useState("");
  const isInitializedRef = useRef(false);

  // Watch form value to sync with state (for initialData)
  const formBrandValue = watch(`compatibility.${index}.brand`);

  // Sync state with form value when it changes from outside (initialData)
  useEffect(() => {
    if (formBrandValue && formBrandValue !== selectedBrandId) {
      console.log(`📥 Syncing compatibility[${index}] brand state from form:`, formBrandValue);
      setSelectedBrandId(formBrandValue);
      if (!isInitializedRef.current) {
        setPrevBrandId(formBrandValue);
        isInitializedRef.current = true;
      }
    }
  }, [formBrandValue, selectedBrandId, index]);

  // Fetch models using RTK Query - will auto fetch when selectedBrandId changes
  const { data: modelsData, isLoading: modelsLoading } =
    useGetVehicleModelsByBrandQuery(selectedBrandId, {
      skip: !selectedBrandId,
      refetchOnMountOrArgChange: true,
    });

  // Reset model when brand actually changes (not during initialization)
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    // Use a small timeout to debounce and avoid cascading updates
    const timer = setTimeout(() => {
      if (selectedBrandId && selectedBrandId !== prevBrandId) {
        console.log(`🔄 Compatibility[${index}] brand changed from`, prevBrandId, "to", selectedBrandId);
        setValue(`compatibility.${index}.model_id`, "", { shouldValidate: false });
        setPrevBrandId(selectedBrandId);
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, [selectedBrandId, prevBrandId, index, setValue]);

  // Handler for brand change
  const handleBrandChange = useCallback((value: any) => {
    // Extract value from event if it's an event object
    const brandId = typeof value === 'string' ? value : value?.target?.value || value;
    console.log(`🎯 Compatibility[${index}] brand selected:`, brandId);
    setSelectedBrandId(brandId);
  }, [index]);
    
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
          onChange={handleBrandChange}
        />

        <SelectField
          name={`compatibility.${index}.model_id`}
          label={t("createproduct.vehicleForm.compatibility.fields.model")}
          options={modelOptions}
          disabled={!selectedBrandId || modelsLoading}
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
  
  // Add ref to track if we're currently initializing to prevent loops
  const isInitializingRef = useRef(false);
  
  // Add ref to store serialized initialData for comparison
  const prevInitialDataRef = useRef<string>('');

  // Keep refs updated
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
  const { data: allModelsData } = useGetVehicleModelsQuery(); // Fetch all models for brand lookup

  /* ===============================
     Process Initial Data - MEMOIZED
  ================================ */
  const getInitialValues = useCallback(() => {
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

    const result = {
      mainVehicle: mainVehicle
        ? {
            type_id: mainVehicle.type_id || "",
            body_type_id: mainVehicle.body_type_id || "",
            brand: "", // Will be populated by useEffect after fetching model data
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
              brand: "", // Will be populated by useEffect after fetching model data
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
  }, [initialData]);

  /* ===============================
     Form Setup
  ================================ */
  const methods = useForm<VehicleFormValues>({
    resolver: yupResolver(vehicleSchema),
    mode: "onChange",
    defaultValues: getInitialValues(),
  });

  const { watch, formState, setValue, reset, getValues } = methods;
  const mainVehicle = watch("mainVehicle");

  // State for main vehicle brand
  const [mainVehicleBrandId, setMainVehicleBrandId] = useState("");
  const [prevMainBrandId, setPrevMainBrandId] = useState("");

  /* ===============================
     Main Vehicle Models Fetching
  ================================ */
  const { data: mainModelsData, isLoading: mainModelsLoading } =
    useGetVehicleModelsByBrandQuery(mainVehicleBrandId, {
      skip: !mainVehicleBrandId,
      refetchOnMountOrArgChange: true,
    });

  // Reset model when brand actually changes
  useEffect(() => {
    if (isInitializingRef.current) return; // Skip during initialization
    
    if (mainVehicleBrandId && mainVehicleBrandId !== prevMainBrandId && prevMainBrandId !== "") {
      console.log("🔄 Main brand changed from", prevMainBrandId, "to", mainVehicleBrandId);
      setValue("mainVehicle.model_id", "", { shouldValidate: false });
      setPrevMainBrandId(mainVehicleBrandId);
    } else if (mainVehicleBrandId && prevMainBrandId === "") {
      // First time setting brand (from initial data)
      setPrevMainBrandId(mainVehicleBrandId);
    }
  }, [mainVehicleBrandId, prevMainBrandId, setValue]);

  // Handler for main brand change
  const handleMainBrandChange = useCallback((value: any) => {
    // Extract value from event if it's an event object
    const brandId = typeof value === 'string' ? value : value?.target?.value || value;
    console.log("🎯 Main brand selected:", brandId);
    setMainVehicleBrandId(brandId);
  }, []);

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
     Populate brand IDs from model IDs when editing
     FIXED: Only depends on allModelsData, runs once when data is available
  ================================ */
  useEffect(() => {
    if (isInitializingRef.current) return; // Skip during initialization
    if (!initialData || initialData.length === 0) return;
    if (!allModelsData?.data) return;

    const values = getValues();
    let needsUpdate = false;
    
    // Handle main vehicle
    const mainVehicleData = initialData.find((v) => v.is_main);
    if (mainVehicleData?.model_id && !values.mainVehicle.brand) {
      const model = allModelsData.data.find(
        (m: any) => String(m.id) === mainVehicleData.model_id
      );
      if (model?.brandId) {
        console.log("🔧 Setting main vehicle brand from model:", model.brandId);
        setValue("mainVehicle.brand", String(model.brandId), { shouldValidate: false });
        setMainVehicleBrandId(String(model.brandId));
        needsUpdate = true;
      }
    }

    // Handle compatibility vehicles
    const compatibilityVehicles = initialData.filter((v) => !v.is_main);
    compatibilityVehicles.forEach((vehicle, index) => {
      if (vehicle.model_id && !values.compatibility[index]?.brand) {
        const model = allModelsData.data.find(
          (m: any) => String(m.id) === vehicle.model_id
        );
        if (model?.brandId) {
          console.log(`🔧 Setting compatibility[${index}] brand from model:`, model.brandId);
          setValue(`compatibility.${index}.brand`, String(model.brandId), { shouldValidate: false });
          needsUpdate = true;
        }
      }
    });

    if (needsUpdate) {
      console.log("✅ Brand population complete");
    }
  }, [allModelsData]); // ONLY depend on allModelsData

  /* ===============================
     Reset form when initialData changes
     FIXED: Uses deep comparison and initialization flag
  ================================ */
  useEffect(() => {
    // Serialize initialData for deep comparison
    const currentInitialDataStr = JSON.stringify(initialData || []);
    
    // Only reset if initialData actually changed
    if (currentInitialDataStr === prevInitialDataRef.current) {
      return;
    }
    
    console.log("🔄 initialData changed, resetting form:", initialData);
    prevInitialDataRef.current = currentInitialDataStr;
    
    isInitializingRef.current = true; // Set flag to prevent cascading updates
    
    if (initialData && initialData.length > 0) {
      const newValues = getInitialValues();
      console.log("📝 Resetting form with values:", newValues);
      reset(newValues);
      
      // Mark as initialized after reset completes
      setTimeout(() => {
        setIsInitialized(true);
        isInitializingRef.current = false; // Clear flag
      }, 100);
    } else if (!isInitialized) {
      // First render with no data
      setIsInitialized(true);
      isInitializingRef.current = false;
    } else {
      isInitializingRef.current = false;
    }
  }, [initialData, reset, getInitialValues, isInitialized]);

  /* ===============================
     Payload Builder - MEMOIZED
  ================================ */
  const buildVehiclesPayload = useCallback((values: VehicleFormValues): VehicleData[] => {
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
  }, []);

  /* ===============================
     Effects
  ================================ */
  // Watch form changes and notify parent
  // FIXED: Guards against initialization and memoizes callback
  useEffect(() => {
    if (!isInitialized || isInitializingRef.current) return; // Don't notify during initialization

    const subscription = watch((values) => {
      const payload = buildVehiclesPayload(values as VehicleFormValues);
      console.log("📊 Form values changed, payload:", payload);
      onDataChangeRef.current?.(payload);
    });
    return () => subscription.unsubscribe();
  }, [watch, isInitialized, buildVehiclesPayload]);

  // Notify parent of validation state changes
  // FIXED: Guards against initialization
  useEffect(() => {
    if (!isInitializingRef.current) {
      onValidationChangeRef.current?.(formState.isValid);
    }
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
      isInitialized,
      isInitializing: isInitializingRef.current,
    });
  }, [mainVehicle, compatibility, formState.isValid, formState.errors, isInitialized]);

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
    console.log("💾 Saving compatibility, payload:", payload);
    onDataChange?.(payload);
  }, [methods, buildVehiclesPayload, onDataChange]);

  const handleRemoveCompatibility = useCallback((index: number) => {
    setValue(
      "compatibility",
      compatibility.filter((_, i) => i !== index),
    );
  }, [compatibility, setValue]);

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