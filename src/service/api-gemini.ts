import { GeminiResponse, RequestInterviewReplyParams } from "@/@types/api-gemini";
import {
  buildFallbackQuestion,
  buildGeminiContents,
  normalizeInterviewReply,
} from "@/utils/gemini-interview";



export const requestGeminiInterviewReply = async ({
  apiKey,
  destination,
  userText,
  messages,
  traceLabel,
}: RequestInterviewReplyParams): Promise<string> => {
  const payload = {
    contents: buildGeminiContents(messages, userText, destination),
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 220,
    },
  };

  console.log("[MyTravel Gemini] request payload", {
    traceLabel,
    destination,
    userText,
    payload,
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const rawBody = await response.text();

  console.log("[MyTravel Gemini] raw response", {
    traceLabel,
    status: response.status,
    ok: response.ok,
    rawBody,
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed (${response.status}): ${rawBody}`);
  }

  let data: GeminiResponse;
  try {
    data = JSON.parse(rawBody) as GeminiResponse;
  } catch (error) {
    console.log("[MyTravel Gemini] parse failed", {
      traceLabel,
      error: String(error),
    });
    return buildFallbackQuestion(destination);
  }

  console.log("[MyTravel Gemini] parsed response", {
    traceLabel,
    data,
  });

  const replyText = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  console.log("[MyTravel Gemini] extracted reply", {
    traceLabel,
    replyText,
  });

  if (!replyText) {
    const fallbackQuestion = buildFallbackQuestion(destination);
    console.log("[MyTravel Gemini] fallback used (empty reply)", {
      traceLabel,
      fallbackQuestion,
    });
    return fallbackQuestion;
  }

  const normalizedReply = normalizeInterviewReply(replyText, destination);

  if (normalizedReply !== replyText) {
    console.log("[MyTravel Gemini] fallback used (normalized)", {
      traceLabel,
      originalReply: replyText,
      normalizedReply,
    });
  }

  return normalizedReply;
};
