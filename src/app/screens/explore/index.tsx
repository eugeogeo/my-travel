import { ChatMessage } from "@/@types/api-gemini";
import { geminiApiKey } from "@/config/env";
import { DEFAULT_DESTINATION } from "@/navigation/explore";
import { requestGeminiInterviewReply } from "@/service/api-gemini";
import { useRoute, type RouteProp } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { ChatComposer } from "./components/chat-composer";
import { ChatThread } from "./components/chat-thread";
import { ExploreHeader } from "./components/explore-header";
import { styles } from "./styles";

export default function ExploreScreen() {
  const route =
    useRoute<RouteProp<{ Explore: { destination: string } }, "Explore">>();
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const sendLockRef = useRef(false);
  const hasStartedInterviewRef = useRef(false);
  const [composerText, setComposerText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const destination = route.params?.destination?.trim() || DEFAULT_DESTINATION;

  useEffect(() => {
    return () => {
      if (loadingTimer.current) {
        clearTimeout(loadingTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];

    console.log("[MyTravel chat] messages updated", {
      count: messages.length,
      isLoading,
      latestMessage,
    });
  }, [isLoading, messages]);

  const requestReply = async (userText: string, traceLabel: string) => {
    if (!geminiApiKey) {
      throw new Error("EXPO_PUBLIC_GEMINI_API_KEY is missing");
    }

    return requestGeminiInterviewReply({
      apiKey: geminiApiKey,
      destination,
      userText,
      messages,
      traceLabel,
    });
  };

  useEffect(() => {
    if (hasStartedInterviewRef.current) {
      return;
    }

    hasStartedInterviewRef.current = true;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);

    const loadingMessageId = `loading-initial-${Date.now()}`;
    setMessages([
      {
        id: loadingMessageId,
        role: "assistant",
        text: "",
        loading: true,
      },
    ]);

    requestReply("INICIE_A_ENTREVISTA", `initial-${requestId}`)
      .then((assistantReply) => {
        if (requestIdRef.current !== requestId) {
          return;
        }

        setMessages([
          {
            id: `assistant-initial-${Date.now()}`,
            role: "assistant",
            text: assistantReply,
          },
        ]);
      })
      .catch((error) => {
        console.log("[MyTravel Gemini] initial request failed", {
          requestId,
          error: String(error),
        });

        setMessages([
          {
            id: `assistant-initial-error-${Date.now()}`,
            role: "assistant",
            text: "Vamos começar: qual cidade voce vai visitar e em que data pretende ir?",
          },
        ]);
      })
      .finally(() => {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
          sendLockRef.current = false;
        }
      });
  }, []);

  const handleSend = () => {
    const trimmedText = composerText.trim();

    if (!trimmedText || isLoading || sendLockRef.current) {
      console.log("[MyTravel chat] send blocked", {
        trimmedText,
        isLoading,
        sendLockActive: sendLockRef.current,
      });
      return;
    }

    sendLockRef.current = true;
    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;

    console.log("[MyTravel Gemini] send start", {
      requestId: currentRequestId,
      destination,
      message: trimmedText,
      hasApiKey: Boolean(geminiApiKey),
    });

    const timestamp = Date.now();
    const loadingMessageId = `loading-${timestamp}`;

    setComposerText("");
    setIsLoading(true);
    console.log("[MyTravel chat] loading started", {
      loadingMessageId,
    });

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `user-${timestamp}`,
        role: "user",
        text: trimmedText,
      },
      {
        id: loadingMessageId,
        role: "assistant",
        text: "",
        loading: true,
      },
    ]);

    loadingTimer.current = setTimeout(() => {
      requestReply(trimmedText, `message-${currentRequestId}`)
        .then((assistantReply) => {
          console.log("[MyTravel Gemini] response received", {
            requestId: currentRequestId,
            assistantReply,
          });

          if (requestIdRef.current !== currentRequestId) {
            console.log("[MyTravel Gemini] stale response ignored", {
              requestId: currentRequestId,
            });
            return;
          }

          setMessages((currentMessages) =>
            currentMessages
              .filter((message) => !message.loading)
              .concat({
                id: `assistant-${Date.now()}`,
                role: "assistant",
                text: assistantReply,
              }),
          );
        })
        .catch((error) => {
          console.log("[MyTravel Gemini] request failed", {
            requestId: currentRequestId,
            error: String(error),
          });

          setMessages((currentMessages) =>
            currentMessages
              .filter((message) => !message.loading)
              .concat({
                id: `assistant-error-${Date.now()}`,
                role: "assistant",
                text: "Não consegui buscar no Gemini agora. Verifique a chave do env e a conexão.",
              }),
          );
        })
        .finally(() => {
          if (requestIdRef.current === currentRequestId) {
            setIsLoading(false);
            sendLockRef.current = false;
          }
        });
    }, 1300);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <ExploreHeader destination={destination} />

            <View style={styles.chatArea}>
              <ChatThread messages={messages} />

              <ChatComposer
                value={composerText}
                isLoading={isLoading}
                onChangeText={setComposerText}
                onSubmit={handleSend}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
