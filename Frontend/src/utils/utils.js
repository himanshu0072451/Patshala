export const forceDownload = (url, filename = "") => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename; // Specify filename if needed
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
