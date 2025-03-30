export interface Email {
  id: string;
  subject?: string;
  body?: string;
  from_address_email: string;
  to_address_email_list: string[] | string;
  thread_id?: string;

  // Opzionali solo per uso frontend:
  content?: string;
  sender?: string;
  aiClassification?: string;
  timestamp?: string;
  isLead?: boolean;
}

export interface EmailResponse {
  content: string;
}

export interface ApiResponse<T> {
  data: T;
}
