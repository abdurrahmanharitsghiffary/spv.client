"use client";

import React from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

export interface DropdownProps {
  key: string;
  label: string;
  icon?: React.JSX.Element;
}

export default function DropdownBase({
  items,
  children,
  ariaLabelledBy,
  onAction,
}: {
  children: React.ReactNode;
  items: DropdownProps[];
  ariaLabelledBy?: string;
  onAction?: ((key: React.Key) => void) | undefined;
}) {
  return (
    <Dropdown>
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownMenu
        items={items}
        aria-labelledby={ariaLabelledBy}
        onAction={onAction}
      >
        {items.map((item) => (
          <DropdownItem
            startContent={item.icon}
            key={item.key}
            color={item.key.includes("delete") ? "danger" : "default"}
            className={item.key.includes("delete") ? "text-danger" : ""}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
