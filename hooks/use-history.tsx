"use client";

import { HistoryContext } from "@/context/history-provider";
import React, { useContext } from "react";

export default function useHistory() {
  return useContext(HistoryContext);
}
