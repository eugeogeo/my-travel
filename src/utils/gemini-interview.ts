import { ChatMessage, GeminiContent } from "@/@types/api-gemini";

export const buildFallbackQuestion = (destination: string) => {
  return `Para montar o melhor plano para ${destination}, qual a data de ida, a data de volta e de qual cidade voce vai sair?`;
};

export const normalizeInterviewReply = (
  rawText: string,
  destination: string,
) => {
  const text = rawText.trim();

  if (!text.includes("?")) {
    return buildFallbackQuestion(destination);
  }

  return text;
};

export const buildSystemPrompt = (destination: string) => {
  return [
    "Você é um assistente especialista em planejamento de viagens.",
    `O destino principal desta conversa é: ${destination}.`,
    "Responda sempre em portugues do Brasil.",
    "Seu objetivo agora é entrevistar o usuario para coletar dados e montar o melhor plano de viagem depois.",
    "NESTA FASE, sua resposta deve ser somente uma pergunta objetiva por vez.",
    "Nao entregue roteiro completo agora.",
    "Priorize perguntas que faltam para montar o plano: datas, duracao, origem, orcamento, acompanhantes, estilo de viagem, interesses, restricoes, hospedagem e transporte.",
    "Se o usuario responder pouco, faca a proxima pergunta mais importante.",
    "Tom amigavel, direto e util.",
  ].join(" ");
};

export const buildGeminiContents = (
  messages: ChatMessage[],
  userText: string,
  destination: string,
): GeminiContent[] => {
  const recentMessages = messages
    .filter((message) => !message.loading)
    .slice(-6)
    .map<GeminiContent>((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.text }],
    }));

  return [
    {
      role: "user",
      parts: [
        {
          text: `${buildSystemPrompt(destination)}\n\nMensagem do usuario: ${userText}`,
        },
      ],
    },
    ...recentMessages,
  ];
};
