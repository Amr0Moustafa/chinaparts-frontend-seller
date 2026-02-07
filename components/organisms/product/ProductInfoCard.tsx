"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";

interface ProductInfoCardProps {
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: ProductInfoData) => void;
  initialValues?: {
    name: string;
    sku: string;
    manufacturer_name: string;
    priority: string;
  };
}

export interface ProductInfoData {
  name: string;
  sku: string;
  manufacturer_name: string;
  priority: string;
}

export const ProductInfoCard = ({ 
  onValidationChange,
  initialValues ,
  onDataChange
}: ProductInfoCardProps) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t("createproduct.productInfo.nameRequired") || "Product name is required")
      .min(3, t("createproduct.productInfo.nameMinLength") || "Name must be at least 3 characters")
      .max(200, t("createproduct.productInfo.nameMaxLength") || "Name must not exceed 200 characters"),
    sku: Yup.string()
      .required(t("createproduct.productInfo.skuRequired") || "SKU is required")
      .matches(/^[A-Z0-9-]+$/, t("createproduct.productInfo.skuInvalid") || "SKU must contain only uppercase letters, numbers, and hyphens"),
    manufacturer_name: Yup.string()
      .required(t("createproduct.productInfo.manufacturerRequired") || "Manufacturer is required")
      .min(2, t("createproduct.productInfo.manufacturerMinLength") || "Manufacturer must be at least 2 characters"),
    priority: Yup.number()
      .required(t("createproduct.productInfo.priorityRequired") || "Priority is required")
      .min(0, t("createproduct.productInfo.priorityMin") || "Priority must be 0 or greater")
      .max(100, t("createproduct.productInfo.priorityMax") || "Priority must be 100 or less")
      .typeError(t("createproduct.productInfo.priorityNumber") || "Priority must be a number"),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      sku: "",
      manufacturer_name: "",
      priority: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log("Form values:", values);
    },
    
  });

  // Notify parent of validation state changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(formik.isValid && formik.dirty);
    }
  }, [formik.isValid, formik.dirty, onValidationChange]);


   // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formik.values);
    }
  }, [formik.values, onDataChange]);

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Package className="text-orange-500" />
          <h5 className="font-bold">{t("createproduct.productInfo.title")}</h5>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("createproduct.productInfo.nameLabel")}</Label>
          <Input
            id="name"
            name="name"
            placeholder={t("createproduct.productInfo.namePlaceholder")}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.name && formik.errors.name ? "border-red-500" : ""}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-500">{String(formik.errors.name)}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sku">{t("createproduct.productInfo.skuLabel")}</Label>
            <Input
              id="sku"
              name="sku"
              placeholder={t("createproduct.productInfo.skuPlaceholder")}
              value={formik.values.sku}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.sku && formik.errors.sku ? "border-red-500" : ""}
            />
            {formik.touched.sku && formik.errors.sku && (
              <p className="text-sm text-red-500">{String(formik.errors.sku)}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="manufacturer_name">{t("createproduct.productInfo.manufacturerLabel")}</Label>
            <Input
              id="manufacturer_name"
              name="manufacturer_name"
              placeholder={t("createproduct.productInfo.manufacturerPlaceholder")}
              value={formik.values.manufacturer_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.manufacturer_name && formik.errors.manufacturer_name ? "border-red-500" : ""}
            />
            {formik.touched.manufacturer_name && formik.errors.manufacturer_name && (
              <p className="text-sm text-red-500">{String(formik.errors.manufacturer_name)}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">{t("createproduct.productInfo.priorityLabel")}</Label>
          <Input
            id="priority"
            name="priority"
            type="number"
            placeholder={t("createproduct.productInfo.priorityPlaceholder")}
            value={formik.values.priority}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.priority && formik.errors.priority ? "border-red-500" : ""}
          />
          {formik.touched.priority && formik.errors.priority && (
            <p className="text-sm text-red-500">{String(formik.errors.priority)}</p>
          )}
          <p className="text-sm text-gray-500">{t("createproduct.productInfo.prioritydesc")}</p>
        </div>
      </CardContent>
    </Card>
  );
};