import { Upload, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ActionOptionsProps {
  onUploadImages: (files: FileList | null) => void;
  onMessageCustomer: () => void;
}

const ActionOptions: React.FC<ActionOptionsProps> = ({
  onUploadImages,
  onMessageCustomer,
}) => {
     const { t }=useTranslation()
    return(
  <div className="p-6">
    <div className="flex items-center flex-col md:flex-row justify-start gap-3">
      {/* Upload Images as file input */}
      <label className="w-full size-9 h-9 px-4 py-2 has-[>svg]:px-3  flex items-center px-2 gap-2 border border-gray-300 rounded-md text-gray-700 hover:border-orange-500 hover:text-orange-500 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
        <Upload className="w-4 h-4" />
        <span>{t("returnsdetails.uploadImages")}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onUploadImages(e.target.files)}
          className="hidden"
        />
      </label>

      {/* Message Customer button */}
      <Button
        onClick={onMessageCustomer}
        variant="outline"
        className="w-full flex items-center px-2 gap-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500"
      >
        <MessageSquare className="w-4 h-4" />
       {t("returnsdetails.uploadImages")}
      </Button>
    </div>
  </div>
);
}
export default ActionOptions;
