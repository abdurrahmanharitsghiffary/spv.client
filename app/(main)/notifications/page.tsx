import NotificationPage from "@/components/page/notification-page";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Notifications page",
};

export default function Page() {
  return <NotificationPage />;
}
