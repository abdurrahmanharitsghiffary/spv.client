import { notifyToast } from "./toast";

export default async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
  notifyToast("Copied to clipboard!");
}
