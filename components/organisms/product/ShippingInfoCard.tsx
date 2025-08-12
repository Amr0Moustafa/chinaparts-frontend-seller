import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ProductBadges from "@/components/molecules/product/ProductBadges";

export const ShippingInfoCard = () => {
  return (
  <Card className="bg-white border border-gray-300">
      <CardHeader>
         <CardTitle className="flex items-center gap-1"> 
             <Truck className="text-orange-500" />
             <h5 className="font-bold">Shipping info</h5>
             </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
       
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="space-y-4">
          <Label>Weight (lbs)</Label>
          <Input  placeholder="2.5" />
        </div>
         <div className="space-y-4">
          <Label>Length (in)</Label>
          <Input  placeholder="8" />
        </div>
         <div className="space-y-4">
            <Label>Width (in)</Label>
            <Input placeholder="6" />
          </div>
          </div>
        
          <div className="space-y-4">
            <Label>Height (in)</Label>
            <Input placeholder="2" />

            
             <div className="flex items-center gap-2 pt-2">
              <Checkbox id="fragile-item"     className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white border-gray-300"
 />
              <Label htmlFor="fragile-item" className="text-sm font-normal">
               Fragile item
              </Label>
            </div>
          </div>
      </CardContent>
    </Card>
  );
};
