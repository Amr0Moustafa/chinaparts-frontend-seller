import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ProductBadges from "@/components/molecules/product/ProductBadges";
const tags = [
  "Matches Description: Does not match",
  "Product Quality: Acceptable",
  "Durability: Strong",
  "Ease of Installation: Difficult",
  "Value for Money: Bad",
];
export const CategoryTagsCard = () => {
  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Tag className="text-orange-500" />
          <h5 className="font-bold">Category & Tags</h5>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label>Category</Label>
          <Input placeholder="Brake System" />
        </div>

        <div className="space-y-4">
          <Label>Subcategory</Label>
          <Input placeholder="Brake Pads" />
        </div>
       <div className="space-y-4">
  <Label>Tags</Label>
  <div className="h-[150px] overflow-y-auto border border-gray-300 bg-gray-100 rounded-md p-2">
    <ProductBadges tags={tags} />
  </div>
</div>
      </CardContent>
    </Card>
  );
};
