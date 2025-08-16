import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

export const PricingInventoryCard = () => {
  const { t } = useTranslation();

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <DollarSign className="text-orange-500" />
          <h5 className="font-bold">
            {t("createproduct.pricingInventory.title")}
          </h5>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label>{t("createproduct.pricingInventory.price")}</Label>
          <Input placeholder="89.99" />
        </div>

        <div className="space-y-4">
          <Label>{t("createproduct.pricingInventory.costPerItem")}</Label>
          <Input placeholder="45.00" />
        </div>

        <div className="space-y-4">
          <Label>{t("createproduct.pricingInventory.quantityInStock")}</Label>
          <Input placeholder="25" />

          <div className="flex items-center gap-2 pt-2">
            <Switch
              id="track-quantity"
              className="w-10 h-6
                data-[state=checked]:bg-orange-500 
                data-[state=unchecked]:border-gray-300
                transition-colors"
            />
            <Label htmlFor="track-quantity" className="text-sm font-normal">
              {t("createproduct.pricingInventory.trackQuantity")}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
