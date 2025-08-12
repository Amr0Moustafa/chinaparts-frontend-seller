import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react"
export const ProductInfoCard = () => {
  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
         <CardTitle className="flex items-center gap-1"> 
             <Package className="text-orange-500" />
             <h5 className="font-bold">Product Information</h5>
             </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label>Product Name</Label>
          <Input  placeholder="e.g., Brake Pads – Toyota Camry 2013-2022" />
        </div>
        <div className="space-y-4">
          <Label>Product Description</Label>
          <Textarea  placeholder="Describe your product..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <Label>SKU</Label>
            <Input placeholder="BP-TC-001" />
          </div>
          <div className="space-y-4">
            <Label>Manufacturer</Label>
            <Input placeholder="OEM, Bosch, Wagner..." />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
