"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ImagePreviewProvider from "@/context/image-preview-context";
import ImageGalleryProvider from "@/context/image-gallery-context";
import ToastProvider from "@/components/toastify-container";
import EditPostProvider from "@/context/edit-post-context";
import SocketProvider from "@/context/socket-context";
import { NextUIProvider } from "@/context/nextui-provider";
import HistoryProvider from "@/context/history-provider";

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
        <SocketProvider>
          <ImageGalleryProvider>
            <ImagePreviewProvider>
              <EditPostProvider>
                <NextThemesProvider {...themeProps}>
                  <HistoryProvider>{children}</HistoryProvider>
                </NextThemesProvider>
              </EditPostProvider>
              <ToastProvider />
            </ImagePreviewProvider>
          </ImageGalleryProvider>
        </SocketProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
