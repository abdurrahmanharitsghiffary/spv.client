export const formatBytes = (
  bytes: number,
  options?: "kb" | "mb" | "gb" | "tb"
) => {
  const divider = [
    { opt: "kb", v: 1000 },
    { opt: "mb", v: 1000000 },
    { opt: "gb", v: 100000000 },
    { opt: "tb", v: 100000000000 },
  ];

  const div = divider.find((d) => d.opt === options ?? "kb");

  return (bytes / (div?.v ?? 1000)).toFixed(2).split(".")[1] === "00"
    ? (bytes / (div?.v ?? 1000)).toFixed(0)
    : (bytes / (div?.v ?? 1000)).toFixed(2);
};
