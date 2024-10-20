import { type Membership } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { route, ROUTES } from "~/constants/routes";
import { env } from "~/env";
import { useToast } from "~/hooks/use-toast";

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

export async function downloadFile({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();

    const _url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.style.display = "none";
    a.href = _url;
    a.download = name;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(_url);
    document.body.removeChild(a);
  } catch (error) {
    console.log(error);
    throw new Error("Error when downloading file.");
  }
}

export function getInitials(name: string) {
  const [first, last] = name.split(" ");
  return `${first ? first[0] : ""} ${last ? last[0] : ""}`;
}

export function pluralize(amount: number, post: string) {
  return `${amount || "No"} ${post}${amount > 1 || amount === 0 ? "s" : ""}`;
}

export function convertPrice(amount: number, currency: string) {
  return `${currency}${amount}`;
}

export function hexToRGB(hex: string) {
  if (hex.length < 5) return;
  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 4) {
    r = parseInt(hex[1]! + hex[1], 16);
    g = parseInt(hex[2]! + hex[2], 16);
    b = parseInt(hex[3]! + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1]! + hex[2], 16);
    g = parseInt(hex[3]! + hex[4], 16);
    b = parseInt(hex[5]! + hex[6], 16);
  }
  return `${r}, ${g}, ${b}`;
}
