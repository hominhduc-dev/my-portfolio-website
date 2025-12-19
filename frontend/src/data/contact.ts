import { apiFetch } from "@/lib/api";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  category: string;
  subject: string;
  message: string;
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  await apiFetch("/public/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
