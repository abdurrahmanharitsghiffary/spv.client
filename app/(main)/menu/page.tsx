import React from "react";
import { Metadata } from "next";
import MenuPage from "@/components/page/menu-page";

export const metadata: Metadata = {
  title: "Menu",
  description: "Menu page",
};

export default function Page() {
  return <MenuPage />;
}
