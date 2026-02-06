import { logout } from "@/lib/auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _retry = false
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  let body: ApiResponse<T> | undefined;
  try {
    body = await res.json();
  } catch {
    body = undefined;
  }

  if (res.status === 401 && !_retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch(path, options, true);
    }
    logout();
    throw new Error(body?.message || "Unauthorized");
  }

  if (!res.ok) {
    throw new Error(body?.message || "Request failed");
  }

  return body as ApiResponse<T>;
}
