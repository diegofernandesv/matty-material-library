import { supabase } from "./supabase.js";

export async function apiFetch(path, options = {}) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const url = `${apiUrl}${path}`;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  const headers = { ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });

  return response;
}
