import React from "react";
import {
  FiHome,
  FiSearch,
  FiPlusSquare,
  FiBell,
  FiMoreHorizontal,
} from "react-icons/fi";

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
    label: "Posts",
    url: "/posts",
    icon: <FiPlusSquare size={20} />,
    active: <FiPlusSquare stroke="#0070F0" size={20} />,
  },
  {
    label: "Notification",
    url: "/notification",
    icon: <FiBell size={20} />,
    active: <FiBell stroke="#0070F0" size={20} />,
  },
  {
    label: "Menu",
    url: "/menu",
    icon: <FiMoreHorizontal size={20} />,
    active: <FiMoreHorizontal stroke="#0070F0" size={20} />,
  },
];
