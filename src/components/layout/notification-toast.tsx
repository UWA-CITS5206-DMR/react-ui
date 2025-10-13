import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, X, Info } from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
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
        return "bg-success-green/95 text-white border-l-4 border-success-green";
      case "warning":
        return "bg-alert-yellow/95 text-gray-900 border-l-4 border-alert-yellow";
      case "error":
        return "bg-critical-red/95 text-white border-l-4 border-critical-red";
      case "info":
        return "bg-hospital-blue/95 text-white border-l-4 border-hospital-blue";
      default:
        return "bg-gray-600/95 text-white border-l-4 border-gray-600";
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
      case "info":
        return Info;
      default:
        return Info;
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-md">
      {visibleNotifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type);
        return (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-xl flex items-center backdrop-blur-sm ${getNotificationStyles(
              notification.type
            )} animate-in slide-in-from-right duration-300`}
          >
            <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => onDismiss(notification.id)}
              className={`ml-3 flex-shrink-0 hover:opacity-70 transition-opacity ${
                notification.type === "warning" ? "text-gray-900/80" : "text-white/80"
              }`}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
