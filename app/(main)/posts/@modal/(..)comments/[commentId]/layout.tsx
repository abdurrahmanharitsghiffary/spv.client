import CommentModal from "@/components/modal/comment-modal";
import React from "react";

export default function CommentModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommentModal>{children}</CommentModal>;
}

{
  /* <div className="fixed inset-0 bg-content1 z-[200] overflow-y-auto hide-scrollbar">
<CommentModalBackLink />
<Card className="w-full p-0 m-0 shadow-none mx-auto max-w-lg rounded-none">
  <CardBody className="p-0 m-0 relative hide-scrollbar">
    {children}
  </CardBody>
</Card>
<CommentEditForm />
<CommentForm />
</div> */
}
