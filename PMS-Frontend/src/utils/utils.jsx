import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple className strings and resolves Tailwind CSS conflicts
 * Example: cn('px-2 py-1', condition && 'bg-blue-500', 'px-4')
 * Will properly merge the classes and the last px-4 will override px-2
 */
export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
}

export const formatDate = (input) => {
  const date = new Date(input);

  // Convert to UTC-based date string
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const downloadImageAsBase64 = async (imageUrl) => {
  console.log(imageUrl)
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Image download failed');

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result?.split(',')[1];
        resolve(base64);
      };

      reader.onerror = () => {
        reject('Failed to read blob as base64');
      };

      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
