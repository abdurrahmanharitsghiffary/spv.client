export const downloadFile = async (fileSrc: string) => {
  const file = await fetch(fileSrc);
  const fileBlob = await file.blob();
  const fileURL = URL.createObjectURL(fileBlob);
  const link = document.createElement("a");
  link.href = fileURL;
  link.download = fileBlob.name ?? "file." + fileBlob.type.split("/")[1];
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
