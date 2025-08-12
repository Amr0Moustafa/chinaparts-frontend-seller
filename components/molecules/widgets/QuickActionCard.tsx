"use client"

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bg?: string;
  text?: string;
}
export const QuickActionCard = ({ title, subtitle, icon, bg, text }: QuickActionCardProps) => {
  return (
    <div className="bg-red-100   rounded-lg p-4 border border-red-300 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex  gap-3">
        <div className={`p-2 rounded ${bg}`}>
          <div className={text}>
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900 text-sm mb-1">{title}</div>
          <div className="text-xs text-orange-500">{subtitle}</div>
        </div>
      </div>
    </div>
  );
};