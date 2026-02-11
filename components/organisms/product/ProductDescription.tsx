"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";

interface ProductDescriptionCardProps {
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: ProductDescriptionData) => void;
  initialValues?: {
    description: string;
    details_info: string;
    shipping_info: string;
    return_info: string;
  };
}

export interface ProductDescriptionData {
  description: string;
  details_info: string;
  shipping_info: string;
  return_info: string;
}

export const ProductDescriptionCard = ({
  onValidationChange,
  onDataChange,
  initialValues,
}: ProductDescriptionCardProps) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    description: Yup.string()
      .required(
        t("createproduct.productDescription.descriptionRequired") ||
          "Description is required"
      )
      .min(
        10,
        t("createproduct.productDescription.descriptionMinLength") ||
          "Description must be at least 10 characters"
      )
      .max(
        500,
        t("createproduct.productDescription.descriptionMaxLength") ||
          "Description must not exceed 500 characters"
      ),
    details_info: Yup.string()
      .required(
        t("createproduct.productDescription.detailedDescriptionRequired") ||
          "Detailed description is required"
      )
      .min(
        20,
        t("createproduct.productDescription.detailedDescriptionMinLength") ||
          "Detailed description must be at least 20 characters"
      )
      .max(
        2000,
        t("createproduct.productDescription.detailedDescriptionMaxLength") ||
          "Detailed description must not exceed 2000 characters"
      ),
    shipping_info: Yup.string()
      .required(
        t("createproduct.productDescription.shippingRequired") ||
          "shipping_info information is required"
      )
      .min(
        10,
        t("createproduct.productDescription.shippingMinLength") ||
          "shipping_info information must be at least 10 characters"
      ),
    return_info: Yup.string()
      .required(
        t("createproduct.productDescription.returnsRequired") ||
          "return_info policy is required"
      )
      .min(
        10,
        t("createproduct.productDescription.returnsMinLength") ||
          "return_info policy must be at least 10 characters"
      ),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      description: "",
      details_info: "",
      shipping_info: "",
      return_info: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values: any) => {},
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
          <Upload className="text-orange-500" />
          <h5 className="font-bold">
            {t("createproduct.productDescription.title")}
          </h5>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">
            {t("createproduct.productDescription.descriptionLabel")}
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder={t(
              "createproduct.productDescription.descriptionPlaceholder"
            )}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : ""
            }
            rows={3}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-sm text-red-500">
              {String(formik.errors.description)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="details_info">
            {t("createproduct.productDescription.detailedDescriptionLabel")}
          </Label>
          <Textarea
            id="details_info"
            name="details_info"
            placeholder={t(
              "createproduct.productDescription.detailedDescriptionPlaceholder"
            )}
            value={formik.values.details_info}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.details_info &&
              formik.errors.details_info
                ? "border-red-500"
                : ""
            }
            rows={5}
          />
          {formik.touched.details_info &&
            formik.errors.details_info && (
              <p className="text-sm text-red-500">
                {String(formik.errors.details_info)}
              </p>
            )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shipping_info">
            {t("createproduct.productDescription.shippingLabel")}
          </Label>
          <Textarea
            id="shipping_info"
            name="shipping_info"
            placeholder={t(
              "createproduct.productDescription.shippingPlaceholder"
            )}
            value={formik.values.shipping_info}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.shipping_info && formik.errors.shipping_info
                ? "border-red-500"
                : ""
            }
            rows={3}
          />
          {formik.touched.shipping_info && formik.errors.shipping_info && (
            <p className="text-sm text-red-500">
              {String(formik.errors.shipping_info)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="return_info">
            {t("createproduct.productDescription.returnsLabel")}
          </Label>
          <Textarea
            id="return_info"
            name="return_info"
            placeholder={t(
              "createproduct.productDescription.returnsPlaceholder"
            )}
            value={formik.values.return_info}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.return_info && formik.errors.return_info
                ? "border-red-500"
                : ""
            }
            rows={3}
          />
          {formik.touched.return_info && formik.errors.return_info && (
            <p className="text-sm text-red-500">
              {String(formik.errors.return_info)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};