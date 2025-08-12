import {SectionHeader} from "@/components/atoms/SectionHeader";
import { useTranslation } from "react-i18next";

interface Customer {
  name: string;
  orderId: string;
  returnDate: string;
}

interface CustomerInformationProps {
  customer: Customer;
}

 export const CustomerInformation: React.FC<CustomerInformationProps> = ({ customer }) =>{
  const { t } = useTranslation();
    return(
  <div className=" p-6">
    
    <SectionHeader  title={t("returnsdetails.customerInformation.title")} />
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 text-sm">
        <div>
          <span className="text-gray-600 font-bold">{t("returnsdetails.customerInformation.name")}: </span>
          <span className="text-gray-900 font-bold">{customer.name}</span>
        </div>
        <div>
          <span className="text-gray-600 font-bold">{t("returnsdetails.customerInformation.order")}: </span>
          <span className="text-gray-900 font-bold">{customer.orderId}</span>
        </div>
        <div>
          <span className="text-gray-600 font-bold">{t("returnsdetails.customerInformation.returnDate")}: </span>
          <span className="text-gray-900 font-bold">{customer.returnDate}</span>
        </div>
      </div>
    </div>
  </div>
);
} 



export default CustomerInformation;
