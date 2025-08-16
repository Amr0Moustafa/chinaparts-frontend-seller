"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

export const ShippingInfoCard = () => {
  const { t } = useTranslation();

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Truck className="text-orange-500" />
          <h5 className="font-bold">{t("createproduct.shippingInfo.title")}</h5>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="space-y-4">
            <Label>{t("createproduct.shippingInfo.weight")}</Label>
            <Input placeholder="2.5" />
          </div>
          <div className="space-y-4">
            <Label>{t("createproduct.shippingInfo.length")}</Label>
            <Input placeholder="8" />
          </div>
          <div className="space-y-4">
            <Label>{t("createproduct.shippingInfo.width")}</Label>
            <Input placeholder="6" />
          </div>
        </div>

        <div className="space-y-4">
          <Label>{t("createproduct.shippingInfo.height")}</Label>
          <Input placeholder="2" />

          <div className="flex items-center gap-2 pt-2">
            <Switch
              id="fragile-item"
              className="
                w-10 h-6
                data-[state=checked]:bg-orange-500 
                data-[state=unchecked]:border-gray-300
                transition-colors
              "
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
