export const getPublicIdFromUrl = (url: string): string => {
  // Remove query params if any:
  url = url.split("?")[0];

  // Split URL
  const parts = url.split("/");

  // Remove filename extension (e.g. .jpg, .png)
  const filename = parts.pop()!.replace(/\.[^/.]+$/, "");

  // Cloudinary folder path always starts after "upload/"
  const uploadIndex = parts.indexOf("upload");

  // Remaining path AFTER "upload/"
  const folderPath = parts.slice(uploadIndex + 1).join("/");

  return `${folderPath}/${filename}`;
};
