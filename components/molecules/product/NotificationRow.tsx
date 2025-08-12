import { NotificationItem } from "@/types/notification";
import { NotificationIcon } from "@/components/atoms/NotificationIcon";

type Props = {
  notification: NotificationItem;
  className?: string;
};

export const NotificationRow = ({ notification }: Props) => {
  return (
    <div className="flex items-start gap-3 bg-gray-100 p-4 rounded-lg  hover:shadow-md transition">
      <NotificationIcon type={notification.type} />
      <div>
        <h4 className="font-medium text-sm">{notification.title}</h4>
        <p className="text-gray-600 text-sm">{notification.message}</p>
        <span className="text-gray-400 text-xs">{notification.time}</span>
      </div>
    </div>
  );
};
