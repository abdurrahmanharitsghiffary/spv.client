import React from "react";
import { Progress as ProgressBase } from "@nextui-org/progress";
// "use client";
// import { usePathname, useRouter } from "next/navigation";
export default function Progress() {
  // const [isShow, setIsShow] = useState(true);
  // const router = useRouter();
  // const pathname = usePathname();
  // useEffect(() => {
  //   router.replace("#loading", { scroll: false });

  //   return () => {
  //     router.replace(pathname, { scroll: false });
  //   };
  // }, [pathname]);

  // const onHashChange = (ev: HashChangeEvent) => {
  //   console.log(ev.newURL, "New URL");
  //   const hash = ev.newURL.split("#")?.[1] ?? "";
  //   console.log(hash, "Hash");
  //   if (hash !== "loading") {
  //     setIsShow(false);
  //   } else {
  //     setIsShow(true);
  //   }
  // };

  // useEffect(() => {
  //   if (!window) return;

  //   window.addEventListener("hashchange", onHashChange);
  //   return () => {
  //     window.removeEventListener("hashchange", onHashChange);
  //   };
  // }, []);

  // if (!isShow) return null;

  return (
    <div className="inset-x-0 top-0 fixed bg-overlay/50 flex z-[9999] focus-visible:outline-none">
      <ProgressBase isIndeterminate size="sm" aria-label="Loading..." />
    </div>
  );
}
