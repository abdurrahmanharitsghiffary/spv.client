import React from "react";
import {
  FiHome,
  FiSearch,
  FiPlusSquare,
  FiMoreHorizontal,
} from "react-icons/fi";
import NotificationIcon from "./notification-icon";

export const items: {
  url: string;
  icon: React.JSX.Element;
  active: React.JSX.Element;
  label?: string;
}[] = [
  {
    label: "Home",
    url: "/",
    icon: <FiHome />,
    active: <FiHome stroke="#0070F0" />,
  },
  {
    label: "Search",
    url: "/search",
    icon: <FiSearch />,
    active: <FiSearch stroke="#0070F0" />,
  },
  {
    label: "Create",
    url: "/posts",
    icon: <FiPlusSquare />,
    active: <FiPlusSquare stroke="#0070F0" />,
  },
  {
    label: "Notifications",
    url: "/notifications",
    icon: <NotificationIcon />,
    active: <NotificationIcon isActive />,
  },
  {
    label: "Menu",
    url: "/menu",
    icon: <FiMoreHorizontal />,
    active: <FiMoreHorizontal stroke="#0070F0" />,
  },
];
