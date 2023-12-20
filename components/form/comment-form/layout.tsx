import clsx from "clsx";
import React, { forwardRef } from "react";

const CommentFormLayout = forwardRef<
  HTMLDivElement,
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(({ className, children, ...rest }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("z-[101] fixed bottom-0 left-0 right-0", className)}
      {...rest}
    >
      {children}
    </div>
  );
});

CommentFormLayout.displayName = "CommentFormLayout";

export default CommentFormLayout;
