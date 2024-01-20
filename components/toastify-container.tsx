"use client";

import { useTheme } from "next-themes";
import React from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
// import 'react-toastify/dist/ReactToastify.min.css';

export default function ToastProvider() {
  const { theme } = useTheme();
  return (
    <ToastContainer
      containerId="toast_container"
      limit={5}
      theme={theme as any}
    />
  );
}
