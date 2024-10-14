import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (_) =>
      reject(new Error("Failed converting file to base64."));
  });
}

export function convertTimestamp(timestamp: string) {
  const [minutes, seconds] = timestamp.split(":");
  if (!minutes || !seconds) return;
  return parseInt(minutes) * parseInt(seconds);
}
