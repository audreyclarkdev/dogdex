// Uses the deployed backend URL if one is set, otherwise falls back to local dev
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
