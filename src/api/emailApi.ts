const API_BASE_URL = import.meta.env.VITE_API_URL;

const emailApi = {
  getUnreadEmails: async () => {
    const response = await fetch(`${API_BASE_URL}/emails/unread`);
    if (!response.ok) {
      throw new Error("Errore nel recupero delle email non lette");
    }
    return await response.json();
  },

  generateAIResponse: async (emailId: string) => {
    const response = await fetch(`${API_BASE_URL}/emails/${emailId}/generate_response`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Errore nella generazione della risposta AI");
    }
    return await response.json();
  },

  sendEmail: async (emailId: string, response: string) => {
    const res = await fetch(`${API_BASE_URL}/emails/${emailId}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ response }),
    });
    if (!res.ok) {
      throw new Error("Errore durante l'invio dell'email");
    }
  },

  markAsRead: async (emailId: string) => {
    const res = await fetch(`${API_BASE_URL}/emails/${emailId}/mark_as_read`, {
      method: "POST",
    });
    if (!res.ok) {
      throw new Error("Errore nel marcare l'email come letta");
    }
  },
};

export default emailApi;
