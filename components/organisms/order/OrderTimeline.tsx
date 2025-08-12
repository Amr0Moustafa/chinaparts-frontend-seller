"use client";

import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { TimelineItem } from "@/components/atoms/TimelineItem";
import { CalendarClock, Package, CheckCircle, Truck, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TimelineEntry {
  icon: string;
  title: string;
  date: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

interface OrderTimelineProps {
  timeline: TimelineEntry[];
}

const iconMap: Record<string, React.ElementType> = {
  Package,
  CheckCircle,
  Truck,
  MapPin,
};

export const OrderTimeline: FC<OrderTimelineProps> = ({ timeline }) => {
  const { t } = useTranslation();

  return (
    <Card className="bg-white border border-gray-300">
      <div className="px-4">
      <SectionHeader icon={CalendarClock} title={t("orderdetails.orderTimeline.title")} />
    </div>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {timeline.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Package; // fallback
            return (
              <TimelineItem
                key={index}
                icon={IconComponent}
                title={item.title}
                date={item.date}
                isActive={item.isActive}
                isCompleted={item.isCompleted}
                isLast={index === timeline.length - 1}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
