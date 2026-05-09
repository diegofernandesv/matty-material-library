import { supabase } from "./supabase.js";

// In production (Vercel): both services share the same domain,
// so we use the backend's route prefix with no host.
// In development: point to the local Express server.
const API_BASE = import.meta.env.VITE_API_URL ?? "/_/backend";

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  const headers = { ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });
  return response;
}
