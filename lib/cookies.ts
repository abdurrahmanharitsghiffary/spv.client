"use client";
export const getCookie = (key: string) =>
  document?.cookie?.split(key + "=")?.[1]?.split(";")?.[0];
