"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useRef, useMemo } from "react";

interface ShippingInfoCardProps {
  productId: number | null;
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: any) => void;
  initialData?: {
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    is_fragile?: boolean;
  };
}

export const ShippingInfoCard = ({
  productId,
  onValidationChange,
  onDataChange,
  initialData,
}: ShippingInfoCardProps) => {
  const { t } = useTranslation();

  // Yup validation schema with translations
  const shippingSchema = useMemo(
    () =>
      yup.object().shape({
        weight: yup
          .number()
          .typeError(t("createproduct.shippingInfo.validation.weightNumber"))
          .required(t("createproduct.shippingInfo.validation.weightRequired"))
          .positive(t("createproduct.shippingInfo.validation.weightPositive"))
          .min(0.01, t("createproduct.shippingInfo.validation.weightMin")),
        length: yup
          .number()
          .typeError(t("createproduct.shippingInfo.validation.lengthNumber"))
          .nullable()
          .transform((value, originalValue) =>
            originalValue === "" ? null : value
          )
          .positive(t("createproduct.shippingInfo.validation.lengthPositive")),
        width: yup
          .number()
          .typeError(t("createproduct.shippingInfo.validation.widthNumber"))
          .nullable()
          .transform((value, originalValue) =>
            originalValue === "" ? null : value
          )
          .positive(t("createproduct.shippingInfo.validation.widthPositive")),
        height: yup
          .number()
          .typeError(t("createproduct.shippingInfo.validation.heightNumber"))
          .nullable()
          .transform((value, originalValue) =>
            originalValue === "" ? null : value
          )
          .positive(t("createproduct.shippingInfo.validation.heightPositive")),
        is_fragile: yup.boolean().default(false),
      }),
    [t]
  );

  const {
    register,
    control,
    watch,
    reset,
    formState: { isValid, errors },
  } = useForm({
    resolver: yupResolver(shippingSchema),
    mode: "onChange",
    defaultValues: {
      weight: initialData?.weight || undefined,
      length: initialData?.length || undefined,
      width: initialData?.width || undefined,
      height: initialData?.height || undefined,
      is_fragile: initialData?.is_fragile || false,
    },
  });

  // Use refs to prevent infinite loops
  const onDataChangeRef = useRef(onDataChange);
  const onValidationChangeRef = useRef(onValidationChange);

  // Update refs when callbacks change
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
    onValidationChangeRef.current = onValidationChange;
  }, [onDataChange, onValidationChange]);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        weight: initialData.weight || undefined,
        length: initialData.length || undefined,
        width: initialData.width || undefined,
        height: initialData.height || undefined,
        is_fragile: initialData.is_fragile || false,
      });
    }
  }, [initialData, reset]);

  // Watch form changes and send to parent
  useEffect(() => {
    const subscription = watch((value) => {
      if (onDataChangeRef.current) {
        const data = {
          product_id: productId,
          weight: value.weight,
          length: value.length,
          width: value.width,
          height: value.height,
          is_fragile: value.is_fragile,
        };
        onDataChangeRef.current(data);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, productId]);

  // Notify parent about validation status
  useEffect(() => {
    if (onValidationChangeRef.current) {
      onValidationChangeRef.current(isValid);
    }
  }, [isValid]);

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Truck className="text-orange-500" />
          <h5 className="font-bold">
            {t("createproduct.shippingInfo.title")}
          </h5>
          {productId && (
            <span className="text-xs text-gray-500 ml-2">
              (Product ID: {productId})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="space-y-2">
            <Label htmlFor="weight">
              {t("createproduct.shippingInfo.weight")}
            </Label>
            <Input
              id="weight"
              placeholder="2.5"
              type="number"
              step="0.01"
              {...register("weight", { valueAsNumber: true })}
              className="bg-[var(--theme-light-gray)]"
            />
            {errors.weight?.message && (
              <p className="text-xs text-red-500">{errors.weight.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">
              {t("createproduct.shippingInfo.length")}
            </Label>
            <Input
              id="length"
              placeholder="8"
              type="number"
              step="0.01"
              {...register("length", { valueAsNumber: true })}
              className="bg-[var(--theme-light-gray)]"
            />
            {errors.length?.message && (
              <p className="text-xs text-red-500">{errors.length.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">
              {t("createproduct.shippingInfo.width")}
            </Label>
            <Input
              id="width"
              placeholder="6"
              type="number"
              step="0.01"
              {...register("width", { valueAsNumber: true })}
              className="bg-[var(--theme-light-gray)]"
            />
            {errors.width?.message && (
              <p className="text-xs text-red-500">{errors.width.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">
            {t("createproduct.shippingInfo.height")}
          </Label>
          <Input
            id="height"
            placeholder="2"
            type="number"
            step="0.01"
            {...register("height", { valueAsNumber: true })}
            className="bg-[var(--theme-light-gray)]"
          />
          {errors.height?.message && (
            <p className="text-xs text-red-500">{errors.height.message}</p>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Controller
              name="is_fragile"
              control={control}
              render={({ field }) => (
                <Switch
                  id="fragile-item"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="
                    w-10 h-6
                    data-[state=checked]:bg-orange-500 
                    data-[state=unchecked]:border-gray-300
                    transition-colors
                  "
                />
              )}
            />
            <Label htmlFor="fragile-item" className="text-sm font-normal">
              {t("createproduct.shippingInfo.fragile")}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};