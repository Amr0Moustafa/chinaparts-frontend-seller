"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InputField } from "@/components/atoms/input";
import SelectField from "@/components/atoms/SelectField";
import { DynamicTable } from "@/components/organisms/table/DynamicTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Palette, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface Variant {
  id: number;
  type: string;
  value: string;
  price: string;
  quantity: number;
}

interface VariantCardProps {
  productId: string | null;
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: any) => void;
  initialValues?: {
    variants?: Variant[];
  };
}

export default function VariantFormCard({
  productId,
  onValidationChange,
  onDataChange,
  initialValues,
}: VariantCardProps) {
  const { t } = useTranslation();
  const methods = useForm();
  const { handleSubmit, reset } = methods;

  const [variants, setVariants] = useState<Variant[]>(
    initialValues?.variants || []
  );

  // Notify parent when variants change
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        product_id: productId,
        variants: variants,
      });
    }

    // Validate: at least one variant should exist (optional)
    if (onValidationChange) {
      onValidationChange(variants.length > 0);
    }
  }, [variants, productId, onDataChange, onValidationChange]);

  // add new variant
  const onSubmit = (data: any) => {
    const newVariant: Variant = {
      id: Date.now(),
      type: data.variantType,
      value: data.variantValue,
      price: `$${data.price}`,
      quantity: Number(data.quantity),
    };

    setVariants((prev) => [...prev, newVariant]);
    reset();
  };

  const handleEdit = (item: Variant) => {
    // TODO: implement edit logic
  };

  // delete variant
  const handleDelete = (item: Variant) => {
    setVariants((prev) => prev.filter((v) => v.id !== item.id));
  };

  return (
    <>
      <Card className="bg-white border border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <Palette className="text-orange-500" />
              <h5 className="font-bold">
                {t("createproduct.variantForm.title")}
              </h5>
              {productId && (
                <span className="text-xs text-gray-500 ml-2">
                  (Product ID: {productId})
                </span>
              )}
            </div>

            {/* Dialog Trigger */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="py-2 px-4 font-bold text-gray-900 bg-white border border-gray-300"
                >
                  <Plus className="text-orange-500 mr-1" />{" "}
                  {t("createproduct.variantForm.addVariantType")}
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg bg-white border-0">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                    <Plus className="text-orange-500" />{" "}
                    {t("createproduct.variantForm.dialog.title")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("createproduct.variantForm.dialog.description")}
                  </DialogDescription>
                </DialogHeader>

                {/* Input Field */}
                <FormProvider {...methods}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <InputField
                      name="variantType"
                      label={t("createproduct.variantForm.dialog.typeName")}
                      placeholder={t(
                        "createproduct.variantForm.dialog.typeName"
                      )}
                    />

                    <DialogFooter className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-gray-100"
                      >
                        {t("createproduct.variantForm.dialog.cancel")}
                      </Button>
                      <Button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        {t("createproduct.variantForm.dialog.addType")}
                      </Button>
                    </DialogFooter>
                  </form>
                </FormProvider>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Form to add Variant */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  name="variantType"
                  label={t("createproduct.variantForm.form.variantType")}
                  options={[
                    { label: "Color", value: "Color" },
                    { label: "Material", value: "Material" },
                  ]}
                  placeholder={t("createproduct.variantForm.form.variantType")}
                  className="bg-[var(--theme-light-gray)]"
                />

                <InputField
                  name="variantValue"
                  label={t("createproduct.variantForm.form.variantValue")}
                  placeholder={t(
                    "createproduct.variantForm.form.variantValue"
                  )}
                  className="bg-[var(--theme-light-gray)]"
                />

                <InputField
                  name="price"
                  label={t("createproduct.variantForm.form.price")}
                  placeholder={t("createproduct.variantForm.form.price")}
                  className="bg-[var(--theme-light-gray)]"
                />

                <InputField
                  name="quantity"
                  label={t("createproduct.variantForm.form.quantity")}
                  placeholder={t("createproduct.variantForm.form.quantity")}
                  className="bg-[var(--theme-light-gray)]"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md"
              >
                {t("createproduct.variantForm.form.addVariant")}
              </button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Table to show variants */}
      {/* <DynamicTable
        title={t("createproduct.variantForm.table.title")}
        columns={[
          {
            header: t("createproduct.variantForm.table.type"),
            accessor: "type",
          },
          {
            header: t("createproduct.variantForm.table.value"),
            accessor: "value",
          },
          {
            header: t("createproduct.variantForm.table.price"),
            accessor: "price",
          },
          {
            header: t("createproduct.variantForm.table.quantity"),
            accessor: "quantity",
          },
        ]}
        data={variants}
        onEdit={(item) => handleEdit(item)}
        onReject={(item) => handleDelete(item)}
        dialogaccept={false}
        dialogreject={false}
        dialogshow={false}
      /> */}
    </>
  );
}