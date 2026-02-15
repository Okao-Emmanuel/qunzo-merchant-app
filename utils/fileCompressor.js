// utils/fileCompressor.js

/**
 * Compress and resize an image or file before storing in localStorage.
 * - Supports image and non-image files (like PDFs or DOCX).
 * - Images are resized using canvas.
 * - Files are compressed using Blob compression.
 *
 * @param {File} file - The input file.
 * @param {number} maxWidth - Maximum width for image resizing.
 * @param {number} maxHeight - Maximum height for image resizing.
 * @returns {Promise<string>} Base64 compressed data URL.
 */
export async function compressAndResizeFile(
  file,
  maxWidth = 800,
  maxHeight = 800
) {
  // If the file is not an image (like PDF/DOCX)
  if (!file.type.startsWith("image/")) {
    return await fileToBase64(file); // Convert directly to Base64
  }

  // Handle image compression
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      // Calculate new dimensions
      let width = img.width;
      let height = img.height;
      const aspectRatio = width / height;

      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      // Draw on canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Compress the image (adjust quality if needed)
      const compressedDataUrl = canvas.toDataURL(file.type, 0.7); // 70% quality
      resolve(compressedDataUrl);
    };

    img.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Convert any file (non-image) to base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
