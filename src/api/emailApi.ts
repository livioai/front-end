const API_BASE_URL = import.meta.env.VITE_API_URL;

const emailApi = {
  getUnreadEmails: async () => {
    const response = await fetch(`${API_BASE_URL}/check-emails`);
    if (!response.ok) {
      throw new Error("Errore nel recupero delle email non lette");
    }

    const data = await response.json();

    // Gestione robusta in base alla struttura ricevuta
    return Array.isArray(data) ? data : data.emails || [];
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
    // Endpoint non presente nel backend attuale
    console.warn("markAsRead non disponibile: endpoint mancante nel backend.");
  },
};

export default emailApi;
