import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { ChatMessage, GeminiContent } from "@/@types/types";
import { geminiApiKey } from "@/config/env";
import { dayCards } from "./helpers/dayCards";
import { styles } from "./styles";

const bottomNavItems = [
  { label: "Explore", icon: "◌", active: false },
  { label: "My Trips", icon: "▣", active: true },
  { label: "Profile", icon: "◌", active: false },
] as const;

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ destination?: string }>();
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const sendLockRef = useRef(false);
  const [composerText, setComposerText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-initial",
      role: "assistant",
      text: "Plano base pronto! Para ajustar, me diga: quando você vai e com quem?",
    },
  ]);

  const destination =
    typeof params.destination === "string" &&
    params.destination.trim().length > 0
      ? params.destination.trim()
      : "Rio de Janeiro";

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

  const handleGoHome = () => {};

  const buildSystemPrompt = () => {
    return [
      "You are My Travel AI.",
      `The destination is ${destination}.`,
      "Create a concise travel-planning reply in Portuguese.",
      "Do not mention that you are a model.",
      "If the user provides enough details, build a practical next-step plan.",
      "If details are missing, ask the minimum necessary follow-up questions.",
      "Keep the tone friendly, direct, and helpful.",
    ].join(" ");
  };

  const buildGeminiContents = (userText: string): GeminiContent[] => {
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
          { text: `${buildSystemPrompt()}\n\nUser request: ${userText}` },
        ],
      },
      ...recentMessages,
    ];
  };

  const requestGeminiReply = async (userText: string) => {
    if (!geminiApiKey) {
      throw new Error("EXPO_PUBLIC_GEMINI_API_KEY is missing");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: buildGeminiContents(userText),
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 220,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Gemini request failed (${response.status}): ${errorBody}`,
      );
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const replyText = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!replyText) {
      throw new Error("Gemini returned an empty response");
    }

    return replyText;
  };

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
      requestGeminiReply(trimmedText)
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
            <View style={styles.header}>
              <Text style={styles.brand}>My Travel</Text>
              <Text style={styles.destination}>
                Base plan for {destination}
              </Text>
            </View>

            <View style={styles.carouselWrap}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
                decelerationRate="fast"
                snapToAlignment="center"
              >
                {dayCards.map((card) => (
                  <View
                    key={card.id}
                    style={[
                      styles.card,
                      card.active ? styles.cardActive : styles.cardSide,
                      { backgroundColor: card.accent },
                    ]}
                  >
                    <Text style={styles.cardDay}>{card.day}</Text>
                    <Text style={styles.cardTitle}>{card.title}</Text>

                    {card.active ? (
                      <View style={styles.timeline}>
                        {card.timeline?.map((item) => (
                          <View key={item} style={styles.timelineRow}>
                            <View style={styles.timelineDot} />
                            <Text style={styles.timelineText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.cardGhost} />
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.chatArea}>
              <View style={styles.chatHeader}>
                <View style={styles.chatBadge} />
                <Text style={styles.chatTitle}>My Travel AI</Text>
              </View>

              <View style={styles.chatThread}>
                {messages.map((message) =>
                  message.loading ? (
                    <View
                      key={message.id}
                      style={[styles.chatBubble, styles.chatBubbleLoading]}
                    >
                      <ActivityIndicator size="small" color="#0F766E" />
                      <Text style={styles.chatBubbleLoadingText}>
                        Gerando próxima resposta...
                      </Text>
                    </View>
                  ) : (
                    <View
                      key={message.id}
                      style={[
                        styles.chatBubble,
                        message.role === "user"
                          ? styles.chatBubbleUser
                          : styles.chatBubbleAssistant,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chatBubbleText,
                          message.role === "user"
                            ? styles.chatBubbleTextUser
                            : styles.chatBubbleTextAssistant,
                        ]}
                      >
                        {message.text}
                      </Text>
                    </View>
                  ),
                )}
              </View>

              <View style={styles.composer}>
                <TextInput
                  value={composerText}
                  onChangeText={setComposerText}
                  placeholder="Type your message..."
                  placeholderTextColor="#8EA0A6"
                  style={styles.composerInput}
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
                  editable={!isLoading}
                />
                <Pressable
                  onPress={handleSend}
                  disabled={isLoading || composerText.trim().length === 0}
                  style={({ pressed }) => [
                    styles.composerButton,
                    (isLoading || composerText.trim().length === 0) &&
                      styles.composerButtonDisabled,
                    pressed &&
                      !isLoading &&
                      composerText.trim().length > 0 &&
                      styles.composerButtonPressed,
                  ]}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#0F4C81" />
                  ) : (
                    <Text style={styles.composerButtonText}>➤</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          {bottomNavItems.map((item) => (
            <Pressable
              key={item.label}
              onPress={item.label === "Explore" ? handleGoHome : undefined}
              style={styles.bottomNavItem}
            >
              <View
                style={[
                  styles.bottomNavIcon,
                  item.active && styles.bottomNavIconActive,
                ]}
              >
                <Text
                  style={[
                    styles.bottomNavIconText,
                    item.active && styles.bottomNavIconTextActive,
                  ]}
                >
                  {item.icon}
                </Text>
              </View>
              <Text
                style={[
                  styles.bottomNavLabel,
                  item.active && styles.bottomNavLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
