import { Package } from "lucide-react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { useTranslation } from "react-i18next";

interface Product {
  name: string;
  sku: string;
  partNumber: string;
  image?: string;
  price: number;
}

interface ProductInformationProps {
  product: Product;
}

export const ProductInformation: React.FC<ProductInformationProps> = ({
  product,
}) => {
  const { t } = useTranslation();
  return (
    <div className=" p-6">
      <SectionHeader title={t("returnsdetails.productInformation.title")} />
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="shrink-0">
          <img
            src={product.image || "/api/placeholder/80/80"}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-2 truncate">
            {product.name}
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
          <p className="font-bold text-orange-500 mt-2">${product.price}</p>

            <p>
               {t("returnsdetails.productInformation.sku")}: <span className="text-gray-900">{product.sku}</span>
            </p>
            <p>
             {t("returnsdetails.productInformation.partNumber")}:{" "}
              <span className="text-gray-900">{product.partNumber}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
