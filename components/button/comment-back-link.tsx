"use client";
import { useRouter } from "next/navigation";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import React from "react";
import { Button } from "@nextui-org/button";
import { FiX } from "react-icons/fi";

export function CommentModalBackLink() {
  const router = useRouter();

  return (
    <Button
      isIconOnly
      variant="light"
      radius="full"
      onClick={() => router.back()}
      size="sm"
      className="absolute top-1 right-1"
      style={{ zIndex: 2 }}
    >
      <FiX size={18} />
    </Button>
  );
}

export default function CommentBackLink() {
  const router = useRouter();
  return (
    <Link as={NextLink} href={""} className="p-4" onClick={() => router.back()}>
      &laquo; Back to previous comment?
    </Link>
  );
}
