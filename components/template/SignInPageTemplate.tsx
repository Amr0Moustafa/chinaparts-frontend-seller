import { SignupSection } from "@/components/organisms/auth/SignupSection";
import { DashboardPreview } from "@/components/organisms/auth/DashboardPreview";
import Image from "next/image";
import { SignInSection } from "../organisms/auth/SignInSection";

export const SignInPageTemplate = () => (
 <div className="min-h-screen grid grid-cols-1 xl:grid-cols-12  bg-white">
  <div className="xl:col-span-5 ">
    <div className="p-8">
       <Image src={'/logo.webp'} alt="Logo"  width={130} height={130}/>
    </div>
    <div className="flex min-h-screen   items-center justify-center lg:p-8">
    <SignInSection />  
    </div>
    
  </div>
  <div className="hidden xl:block xl:col-span-7">
    <DashboardPreview />
  </div>
</div>

);
