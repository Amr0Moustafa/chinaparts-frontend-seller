 export type NotificationCategory =
  | 'order'
  | 'message'
  | 'return'
  | 'milestone'
  | 'completion';

export interface NotificationItem {
  id: string; // Unique ID like "ORD-005"
  type: NotificationCategory;
  title: string;
  message: string;
  time: string; // e.g., "2 minutes ago"
  icon: string; // Optional: could be icon name or path
}