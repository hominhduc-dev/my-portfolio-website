import { apiFetch } from "@/lib/api";

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  category: string;
  subject: string;
  message: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export async function fetchMessages(): Promise<AdminMessage[]> {
  const res = await apiFetch<AdminMessage[]>("/api/messages");
  return res.data ?? [];
}

export async function markMessageRead(id: string): Promise<AdminMessage | null> {
  const res = await apiFetch<AdminMessage>(`/api/messages/${id}/read`, {
    method: "PUT",
  });
  return res.data ?? null;
}

export async function deleteMessage(id: string): Promise<void> {
  await apiFetch(`/api/messages/${id}`, { method: "DELETE" });
}
