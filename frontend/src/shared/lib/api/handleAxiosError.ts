import axios from "axios";

export const handleAxiosError = (err: unknown, fallback = "Unknown error"): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? err.response?.data?.detail ?? fallback;
  }
  return fallback;
};
