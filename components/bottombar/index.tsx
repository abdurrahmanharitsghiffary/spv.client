"use client";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { items } from "./barItems";
import { useIsSSR } from "@react-aria/ssr";
// fix layout in search bar items
export default function BottomBar() {
  const pathname = usePathname();
  const isSSR = useIsSSR();

  return (
    <Card
      isBlurred
      className=" fixed shadow-none rounded-none left-0 right-0 bottom-0 z-[100]"
    >
      <Divider />
      <CardBody className="p-0 h-[3.5rem]">
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
                    // animate={{ bottom: 0 }}
                    // exit={{ bottom: -10 }}
                    style={{
                      bottom: 0,
                      position: "absolute",
                      // bottom: -10,
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
