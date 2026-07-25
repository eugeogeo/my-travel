export type GeminiPart = {
  text: string;
};

export type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  loading?: boolean;
};

export type RequestInterviewReplyParams = {
  apiKey: string;
  destination: string;
  userText: string;
  messages: ChatMessage[];
  traceLabel: string;
};

export type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};