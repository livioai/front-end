import { Email } from "../types/email";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getUnreadEmails(): Promise<Email[]> {
  const response = await fetch(`${BASE_URL}/emails/unread`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error("Errore durante il recupero delle email non lette");
  }

  return response.json();
}

export async function sendEmail(email: Email): Promise<void> {
  const response = await fetch(`${BASE_URL}/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(email),
  });

  if (!response.ok) {
    throw new Error("Errore durante l'invio dell'email");
  }
}
