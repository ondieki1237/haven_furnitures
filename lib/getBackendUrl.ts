export function getBackendUrl() {
  // Prefer explicit environment variables, fall back to the public site domain
  const prod = process.env.NEXT_PUBLIC_PROD_BACKEND_URL || "https://www.codewithseth.co.ke";
  const dev = process.env.NEXT_PUBLIC_DEV_BACKEND_URL || "https://www.codewithseth.co.ke";

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
    return prod;
  }
  return dev;
}