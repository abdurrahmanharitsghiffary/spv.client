import { cssTransition, toast } from "react-toastify";

const Slide = cssTransition({
  enter: "righttoleft",
  exit: "tobottom",
  collapse: false,
});

const Fade = cssTransition({
  enter: "fadein",
  exit: "fadeout",
  collapse: false,
  collapseDuration: 700,
});
export const notifyToast = (content: string) =>
  toast(content, {
    autoClose: 700,
    containerId: "toast_container",
    hideProgressBar: true,
    closeButton: false,
    transition: Fade,
    position: "bottom-center",
  });
