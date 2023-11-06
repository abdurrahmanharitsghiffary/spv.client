"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ImagePreviewProvider from "@/context/image-preview-context";
import ImageGalleryProvider from "@/context/image-gallery-context";
import ToastProvider from "@/components/toastify-container";
import EditPostProvider from "@/context/edit-post-context";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <ImageGalleryProvider>
          <ImagePreviewProvider>
            <EditPostProvider>
              <NextThemesProvider {...themeProps}>
                {children}
              </NextThemesProvider>
            </EditPostProvider>
            <ToastProvider />
          </ImagePreviewProvider>
        </ImageGalleryProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
