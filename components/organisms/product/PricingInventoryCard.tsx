import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox";

export const PricingInventoryCard = () => {
  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
         <CardTitle className="flex items-center gap-1"> 
             <DollarSign className="text-orange-500" />
             <h5 className="font-bold">Pricing & Inventory</h5>
             </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label>Price</Label>
          <Input  placeholder="89.99" />
        </div>
       
         <div className="space-y-4">
            <Label>Cost per Item</Label>
            <Input placeholder="45.00" />
          </div>
          <div className="space-y-4">
            <Label>Quantity in Stock</Label>
            <Input placeholder="25" />

            
             <div className="flex items-center gap-2 pt-2">
              <Checkbox id="track-quantity"     className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white border-gray-300"
 />
              <Label htmlFor="track-quantity" className="text-sm font-normal">
                Track quantity
              </Label>
            </div>
          </div>
      </CardContent>
    </Card>
  );
};
