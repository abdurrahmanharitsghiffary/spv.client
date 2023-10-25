// @ts-nocheck
"use client";
import React, { useState } from "react";

// import { Card, CardBody } from "@nextui-org/card";
import { Tabs as NextTabs, Tab } from "@nextui-org/tabs";

export default function Tabs({
  tabs,
}: {
  tabs: { id: string; label: string }[];
}) {
  const [selectedKey, setSelectedKey] = useState(tabs[0].id);

  if (tabs.length === 0) return "";

  return (
    <NextTabs
      items={tabs}
      selectedKey={selectedKey}
      onSelectionChange={setSelectedKey}
    >
      {(tab) => <Tab key={tab.id}></Tab>}
    </NextTabs>
  );
}
