import { CardBody } from "@nextui-org/card";
import {
  HTMLNextUIProps,
  InternalForwardRefRenderFunction,
} from "@nextui-org/system";
import clsx from "clsx";
import React, { forwardRef } from "react";
type Props = HTMLNextUIProps<"div", never>;
const CommentFormBody = forwardRef<
  InternalForwardRefRenderFunction<"div">,
  Props
>(({ className, children, ...rest }: Props, ref) => {
  return (
    <CardBody
      ref={ref}
      className={clsx(
        "p-2 flex-row flex justify-between items-center gap-2",
        className
      )}
      {...rest}
    >
      {children}
    </CardBody>
  );
});

CommentFormBody.displayName = "CommentFormBody";

export default CommentFormBody;
