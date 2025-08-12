import { CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

type SectionHeaderProps = {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  actionButton?: ReactNode;
};

export const SectionHeader = ({ icon: Icon, title, actionButton = null }: SectionHeaderProps) => (
  <CardHeader className="pb-4 px-0">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-orange-500" />}
        <CardTitle className="text-lg font-bold text-gray-900">{title}</CardTitle>
      </div>
      {actionButton}
    </div>
  </CardHeader>
);
