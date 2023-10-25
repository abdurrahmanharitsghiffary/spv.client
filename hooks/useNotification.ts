"use client";
import { useCallback, useEffect, useState } from "react";

type NotificationEv = {
  onNotificationClick?: () => void;
  onNotificationShow?: () => void;
  onNotificationClose?: () => void;
  onNotificationError?: () => void;
};

export default function useNotification() {
  const [notificationPermission, setNotificataionPermission] =
    useState<NotificationPermission | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificataionPermission(Notification.permission);
    }
  }, []);

  const fireNotification = useCallback(
    (title: string, options?: NotificationOptions, event?: NotificationEv) => {
      const events: ("onshow" | "onclick" | "onerror" | "onclose")[] = [
        "onshow",
        "onclick",
        "onerror",
        "onclose",
      ];
      const eventAction: (
        | "onNotificationClick"
        | "onNotificationClose"
        | "onNotificationError"
        | "onNotificationShow"
      )[] = [
        "onNotificationShow",
        "onNotificationClick",
        "onNotificationError",
        "onNotificationClose",
      ];

      const getNotifivationEvents = (notification: Notification) => {
        if (!event) return null;
        events.forEach((e, i) => {
          if (event?.[eventAction[i]]) {
            notification[e] = () => {
              // @ts-ignore
              event[eventAction[i]]();
            };
          }
        });
      };
      if (notificationPermission === "granted") {
        const notification = new Notification(title, options);
        getNotifivationEvents(notification);
      } else if (notificationPermission !== "denied") {
        Notification.requestPermission((permission) => {
          if (permission === "granted") {
            const notification = new Notification(title, options);
            getNotifivationEvents(notification);
          } else {
            return;
          }
        });
      }
    },
    [notificationPermission]
  );

  return fireNotification;
}
