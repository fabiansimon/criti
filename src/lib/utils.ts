import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { route, ROUTES } from "~/constants/routes";

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
  const [minutes = "0", seconds = "0"] = timestamp.split(":");

  const parsedMinutes = parseInt(minutes, 10) || 0;
  const parsedSeconds = parseInt(seconds, 10) || 0;

  return parsedMinutes * 60 + parsedSeconds;
}

export function generateTimestamp(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = (time % 60).toFixed(0);

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
}

export function getDateDifference(date: string) {
  const now = new Date();
  const difference = now.getTime() - new Date(date).getTime();

  const units = [
    { name: "year", value: 365 * 24 * 60 * 60 * 1000 },
    { name: "month", value: 30 * 24 * 60 * 60 * 1000 },
    { name: "week", value: 7 * 24 * 60 * 60 * 1000 },
    { name: "day", value: 24 * 60 * 60 * 1000 },
    { name: "hour", value: 60 * 60 * 1000 },
    { name: "minute", value: 60 * 1000 },
    { name: "second", value: 1000 },
  ];

  for (const unit of units) {
    const amount = Math.floor(difference / unit.value);
    if (amount >= 1) {
      return {
        text: `${amount} ${unit.name}${amount > 1 ? "s" : ""} ago`,
        unit: unit.name,
      };
    }
  }

  return {
    text: "just now",
    unit: "seconds",
  };
}

export function copyToClipboard(value: string) {
  void navigator.clipboard.writeText(value);
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function generateShareableLink(id: string) {
  return `${getBaseUrl()}${route(ROUTES.listen, id)} `;
}
