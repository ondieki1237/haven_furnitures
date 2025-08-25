export function getBackendUrl() {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
    return process.env.NEXT_PUBLIC_PROD_BACKEND_URL;
  }
  return process.env.NEXT_PUBLIC_DEV_BACKEND_URL;
}