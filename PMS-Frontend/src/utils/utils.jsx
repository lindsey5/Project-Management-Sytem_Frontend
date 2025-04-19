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

export const timeAgo = (date1, date2) => {
  const diffInMs = date2 - date1; 

  // Convert milliseconds into days, hours, minutes, and seconds
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  // Calculate the remaining hours, minutes, and seconds
  const hours = diffInHours % 24;
  const minutes = diffInMinutes % 60;
  const seconds = diffInSeconds % 60;
  
  // Output in a time ago format
  let timeAgo = "";
  if (diffInDays > 0) {
      timeAgo = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
      timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
      timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (seconds > 0) {
      timeAgo = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  } else{
      timeAgo = 'Just now'
  }

  return timeAgo
}

export const downloadFile = (file) => {
    const fileUrl = `data:${file.type};base64,${file.content}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name;
    link.click();
}

export const openFile = (file) => {
  const fileURL = URL.createObjectURL(file);
  window.open(fileURL);
};

export const base64ToBlob = (file) => {
  const byteString = atob(file.content); // decode base64
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([byteArray], { type: file.type });
}