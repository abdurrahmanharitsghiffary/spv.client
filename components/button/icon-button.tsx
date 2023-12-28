import { Button, ButtonProps } from "@nextui-org/button";
import clsx from "clsx";
import React, { forwardRef } from "react";

const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...rest }, ref) => {
    const cl = clsx("text-[1.25rem]", className);

    return (
      <Button
        ref={ref}
        isIconOnly
        variant="light"
        className={cl}
        radius="full"
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
