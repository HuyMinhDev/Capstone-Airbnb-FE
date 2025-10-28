export const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

export const NEXT_PUBLIC_API_IMAGE_URL =
  process.env.NEXT_PUBLIC_API_IMAGE_URL || "";

// Log for debugging (remove in production)
if (process.env.NODE_ENV === "development") {
  console.log("API Base URL:", NEXT_PUBLIC_API_BASE_URL);
}
