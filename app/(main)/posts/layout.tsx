import React from "react";

export default function PostLayout({
  children,
  modal,
}: {
  modal: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
