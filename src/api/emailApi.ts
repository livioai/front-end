import axios from "axios";

// Types locali (o importali da src/types/email.ts se li separi)
export interface Email {
  id: string;
  subject: string;
  body: string;
  from_address_email: string;
  to_address_email_list: string[] | string;
  thread_id?: string;
}

export interface EmailResponse {
  content: string;
}

const API_URL = import.meta.env.VITE_API_URL || "VITE_API_URL=https://aiemailresponder.onrender.com";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const emailApi = {
  // Recupera solo le email classificate come "interested"
  getUnreadEmails: async (): Promise<Email[]> => {
    const res = await client.get("/check-emails");
    return res.data.interested;
  },

  // Genera la risposta AI a partire dal contenuto dell'email
  generateAIResponse: async (email: Email): Promise<EmailResponse> => {
    const res = await client.post("/generate-response", {
      content: email.body,
    });
    return { content: res.data.response };
  },

  // Invia la risposta generata
  sendEmail: async (email: Email, response: string): Promise<void> => {
    await client.post("/send-response", {
      email,
      response,
    });
  },

  // Dummy per marcare come letta (non implementato lato backend)
  markAsRead: async (emailId: string): Promise<void> => {
    console.log(`Email ${emailId} marcata come letta (dummy).`);
  },
};

export default emailApi;
