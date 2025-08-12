import {
  Package,
  MessageSquare,
  TriangleAlert,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

export type NotificationCategory =
  | 'order'
  | 'message'
  | 'return'
  | 'milestone'
  | 'completion';

type IconProps = {
  type: NotificationCategory;
};

const colorMap: Record<NotificationCategory, string> = {
  order: 'blue',
  message: 'purple',
  return: 'orange',
  milestone: 'green',
  completion: 'green',
};

const iconMap: Record<NotificationCategory, React.ElementType> = {
  order: Package,
  message: MessageSquare,
  return: TriangleAlert,
  milestone: TrendingUp,
  completion: CheckCircle,
};

export const NotificationIcon = ({ type }: IconProps) => {
  const Icon = iconMap[type];
  const color = colorMap[type];

  return (
    <div className={`w-9 h-9 rounded-md bg-${color}-100 flex items-center justify-center`}>
      <Icon className={`w-5 h-5 text-${color}-700`} />
    </div>
  );
};
