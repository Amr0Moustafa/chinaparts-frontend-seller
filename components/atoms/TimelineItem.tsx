import { FC } from 'react';
import { Separator } from "@/components/ui/separator"

type TimelineItemProps = {
  icon: React.ElementType;
  title: string;
  date: string;
  isActive?: boolean;
  isCompleted?: boolean;
  isLast?: boolean;
};

export const TimelineItem: FC<TimelineItemProps> = ({
  icon: Icon,
  title,
  date,
  isActive = false,
  isCompleted = false,
  isLast = false,
}) => (
  <div className="relative">
    
    <div className="flex items-start gap-3 pb-6">
      <div className="relative z-10">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isCompleted ? 'bg-orange-500' : isActive ? 'bg-orange-500' : 'bg-gray-400'
          }`}
        >
          <Icon
            className={`w-5 h-5 ${isCompleted || isActive ? 'text-white' : 'text-gray-600'}`}
          />
        </div>
      </div>
      <div className="flex-1 min-w-0 pt-2">
        <p className="font-semibold text-gray-900 truncate text-base">{title}</p>
        <p className="text-sm text-gray-500 mt-1">{date}</p>
      </div>
    </div>
    
    {/* Vertical line connector */}
    
    {!isLast && (
      <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-300 -translate-x-0.5"></div>
    )}
  </div>
);


