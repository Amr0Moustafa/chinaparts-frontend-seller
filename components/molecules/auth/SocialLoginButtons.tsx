import { IconButton } from "@/components/atoms/IconButton";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";

export const SocialLoginButtons = () => (
  <div className="flex justify-center gap-4">
    <IconButton icon={<FaFacebookF className="text-[20px]" />} className="text-blue-500 text-lg" />
    <IconButton icon={<FaApple className="text-[20px]" />} className="text-black text-lg" />
    <IconButton icon={<IoLogoWechat className="text-[20px]" />} className="text-green-500 text-lg" />
    
    
  </div>
);