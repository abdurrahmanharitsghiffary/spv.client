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
    icon: <FiHome size={20} />,
    active: <FiHome stroke="#0070F0" size={20} />,
  },
  {
    label: "Search",
    url: "/search",
    icon: <FiSearch size={20} />,
    active: <FiSearch stroke="#0070F0" size={20} />,
  },
  {
    label: "Create",
    url: "/posts",
    icon: <FiPlusSquare size={20} />,
    active: <FiPlusSquare stroke="#0070F0" size={20} />,
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
    icon: <FiMoreHorizontal size={20} />,
    active: <FiMoreHorizontal stroke="#0070F0" size={20} />,
  },
];
