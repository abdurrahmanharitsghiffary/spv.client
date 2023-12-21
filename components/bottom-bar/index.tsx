"use client";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { items } from "./bar-items";
import { useIsSSR } from "@react-aria/ssr";
// import { useIsMd } from "@/hooks/use-media-query";
// import { Listbox, ListboxItem } from "@nextui-org/react";
// import clsx from "clsx";
// fix layout in search bar items
export default function BottomBar() {
  const pathname = usePathname();
  const isSSR = useIsSSR();
  // const isMd = useIsMd();
  //  md:top-0 md:right-auto md:min-w-[210px] md:max-w-[210px]
  return (
    <Card
      isBlurred
      className="fixed shadow-none rounded-none left-0 right-0 bottom-0 z-[100]"
    >
      <Divider />
      <CardBody className="p-0 h-12">
        {/* {isMd ? (
          <Listbox className="gap-4 relative">
            {items.map((item) => (
              <ListboxItem
                key={item.url}
                className={clsx(
                  pathname === item.url &&
                    "before:content-[''] before:p-[2px] before:bg-primary  before:absolute before:inset-y-0 before:-left-1 transition-all before:rounded-medium pl-2 text-primary hover:bg-primary/30",
                  "py-3"
                )}
                classNames={{ shortcut: "!font-bold" }}
                startContent={item.icon}
              >
                {item.label}
              </ListboxItem>
            ))}
          </Listbox>
        ) : ( */}
        <ul className="flex justify-around w-full h-full items-center">
          {items.map((item) => (
            <li key={item.url} className="w-full h-full block relative">
              <Link
                className="flex justify-center flex-col gap-1 items-center text-center h-full w-full"
                href={item.url}
              >
                {pathname === item.url ? item.active : item.icon}
              </Link>
              <AnimatePresence>
                {pathname === item.url && !isSSR ? (
                  <motion.span
                    layoutId="btm_bar_active_bar"
                    animate={{ bottom: 0 }}
                    // exit={{ bottom: -10 }}
                    style={{
                      // bottom: 0,
                      position: "absolute",
                      bottom: -10,
                      display: "block",
                      insetInline: 0,
                      marginInline: "auto",
                      maxWidth: 100,
                      padding: "1.5px",
                      backgroundColor: "#0070F0",
                      borderRadius: "30px",
                    }}
                  ></motion.span>
                ) : null}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
