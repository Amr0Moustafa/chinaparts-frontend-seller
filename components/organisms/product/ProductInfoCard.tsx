"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ProductInfoCard = () => {
  const { t } = useTranslation();

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Package className="text-orange-500" />
          <h5 className="font-bold">{t("createproduct.productInfo.title")}</h5>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label>{t("createproduct.productInfo.nameLabel")}</Label>
          <Input placeholder={t("createproduct.productInfo.namePlaceholder")} />
        </div>

        <div className="space-y-4">
          <Label>{t("createproduct.productInfo.descriptionLabel")}</Label>
          <Textarea placeholder={t("createproduct.productInfo.descriptionPlaceholder")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <Label>{t("createproduct.productInfo.skuLabel")}</Label>
            <Input placeholder={t("createproduct.productInfo.skuPlaceholder")} />
          </div>
          <div className="space-y-4">
            <Label>{t("createproduct.productInfo.manufacturerLabel")}</Label>
            <Input placeholder={t("createproduct.productInfo.manufacturerPlaceholder")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
