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

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const convertToAsiaTime = (dateString) => {
  const date = new Date(dateString + 'Z'); 
  return date.toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const formatDateTime = (date) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  const formatted = new Date(date).toLocaleString('en-US', options);
  const [month, day, yearAndTime] = formatted.split('/');
  const [year, time] = yearAndTime.split(', ');
  return `${year}-${month}-${day} (${time.replace(' ', '')})`;
}

export const downloadImageAsBase64 = async (imageUrl) => {
  try {
    const proxyUrl = `/api/imageproxy?url=${encodeURIComponent(imageUrl)}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Proxy image download failed');
    
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
