import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "warning" | "error";
  message: string;
}

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export default function NotificationToast({ notifications, onDismiss }: NotificationToastProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-success-green text-white";
      case "warning":
        return "bg-alert-yellow text-white";
      case "error":
        return "bg-critical-red text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "error":
        return XCircle;
      default:
        return CheckCircle;
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3">
      {visibleNotifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type);
        return (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-md shadow-lg flex items-center max-w-sm ${getNotificationStyles(notification.type)}`}
          >
            <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="flex-1 text-sm">{notification.message}</span>
            <button
              onClick={() => onDismiss(notification.id)}
              className="ml-3 text-white/80 hover:text-white flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
