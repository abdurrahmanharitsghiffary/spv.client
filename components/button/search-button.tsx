import React from "react";
import IconButton from "./icon-button";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";

export default function SearchButton() {
  return (
    <IconButton as={Link} href="/search">
      <FiSearch />
    </IconButton>
  );
}
