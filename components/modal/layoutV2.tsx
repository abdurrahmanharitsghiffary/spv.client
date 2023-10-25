"use client";
import React, { forwardRef } from "react";
import ModalLayout, { ModalLayoutProps } from "./layout";
import IconButton from "../button/icon-button";
import { BiChevronLeft } from "react-icons/bi";
import { Divider } from "@nextui-org/divider";

const ModalLayoutV2 = forwardRef(
  (
    {
      children,
      classNames,
      wrapperClassNames,
      header,
      placement,
      size,
      closeButton,
      ...rest
    }: ModalLayoutProps,
    ref: React.Ref<HTMLElement> | undefined
  ) => {
    return (
      <ModalLayout
        {...rest}
        ref={ref}
        header={<Divider className="w-full" />}
        classNames={{
          wrapper: "h-full",
          header: "p-0 h-[64px] items-end ",
          footer: "p-4",
        }}
        wrapperClassNames={{
          closeButton: "left-2 top-[12px]",
        }}
        closeButton={
          <IconButton>
            <BiChevronLeft />
          </IconButton>
        }
        placement="center"
        size="full"
      >
        {children}
      </ModalLayout>
    );
  }
);

ModalLayoutV2.displayName = "ModalLayoutV2";

export default ModalLayoutV2;

// export default function ModalLayoutV2({
//   children,
//   classNames,
//   wrapperClassNames,
//   header,
//   placement,
//   size,
//   closeButton,
//   ...rest
// }: ModalLayoutProps) {
//   return (
//     <ModalLayout
//       {...rest}

//       header={<Divider className="w-full" />}
//       classNames={{
//         wrapper: "h-full",
//         header: "p-0 h-[64px] items-end ",
//         footer: "p-4",
//       }}
//       wrapperClassNames={{
//         closeButton: "left-2 top-[12px]",
//       }}
//       closeButton={
//         <IconButton>
//           <BiChevronLeft />
//         </IconButton>
//       }
//       placement="center"
//       size="full"
//     >
//       {children}
//     </ModalLayout>
//   );
// }
