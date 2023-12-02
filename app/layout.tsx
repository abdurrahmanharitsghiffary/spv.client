import "@/styles/globals.css";
import { fontSans } from "@/config/fonts";
import { Providers } from "../components/providers";
import clsx from "clsx";
import ImagePreview from "@/components/modal/image-preview";
import ImageGallery from "@/components/modal/image-gallery";
import ConfirmModal from "@/components/modal/confirm-modal";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased relative flex flex-col",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {/* <div className=" h-screen"> */}

          {children}

          {/* <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
                title="nextui.org homepage"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">NextUI</p>
              </Link>
            </footer> */}
          {/* </div> */}
          <ConfirmModal />
          <ImageGallery />
          <ImagePreview />
        </Providers>
      </body>
    </html>
  );
}
