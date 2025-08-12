import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Textarea } from "@/components/ui/textarea"; // adjust import path
import { useTranslation } from "react-i18next";

interface AddNotesProps {
  notes: string;
  setNotes: (value: string) => void;
}

const AddNotes: React.FC<AddNotesProps> = ({ notes, setNotes }) => {
    const { t }=useTranslation()
    return(
  <div className=" p-6">
    <SectionHeader  title={t("returnsdetails.addNotes")}/>
    <Textarea
      placeholder={t("returnsdetails.productDescriptionPlaceholder")}
      value={notes}
      onChange={(e:any) => setNotes(e.target.value)}
      className="min-h-[100px] resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500"
    />
  </div>
);
}

export default AddNotes;
