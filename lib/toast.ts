import { cssTransition, toast } from "react-toastify";
const Fade = cssTransition({
  enter: "fadein",
  exit: "fadeout",
  collapse: false,
  appendPosition: false,
});
export const notifyToast = (content: string) =>
  toast(content, {
    autoClose: 500,
    hideProgressBar: true,
    closeButton: false,
    // transition: Fade,
    bodyClassName: "p-0 m-0 h-fit w-fit mb-8",
    position: "bottom-center",
    className: "text-xs h-fit w-fit mx-auto min-h-unit-8",
  });
