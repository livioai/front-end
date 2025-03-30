const API_BASE_URL = import.meta.env.VITE_API_URL;

const emailApi = {
  getUnreadEmails: async () => {
    const response = await fetch(`${API_BASE_URL}/check-emails`);
    if (!response.ok) {
      throw new Error("Errore nel recupero delle email non lette");
    }
    return await response.json();
  },

  generateAIResponse: async (emailId: string) => {
    const response = await fetch(`${API_BASE_URL}/generate-response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_id: emailId }),
    });
    if (!response.ok) {
      throw new Error("Errore nella generazione della risposta AI");
    }
    return await response.json();
  },

  sendEmail: async (emailId: string, responseText: string) => {
    const response = await fetch(`${API_BASE_URL}/send-response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_id: emailId,
        response: responseText,
      }),
    });
    if (!response.ok) {
      throw new Error("Errore durante l'invio dell'email");
    }
  },

  markAsRead: async (_emailId: string) => {
    // backend attuale non ha endpoint per marcare come letta
    console.warn("Endpoint /mark_as_read non disponibile nel backend attuale.");
  },
};

export default emailApi;
