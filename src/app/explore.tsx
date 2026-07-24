import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { geminiApiKey } from "@/config/env";
import { Fonts } from "@/constants/theme";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  loading?: boolean;
};

type GeminiPart = {
  text: string;
};

type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

const dayCards = [
  {
    id: "day-0",
    day: "Day 0",
    title: "Arrival preview",
    accent: "#D9EEF7",
    active: false,
  },
  {
    id: "day-1",
    day: "Day 1",
    title: "Arrival & Exploration",
    accent: "#F7F6EE",
    active: true,
    timeline: [
      "09:00 - Check-in",
      "12:00 - Local Lunch",
      "15:00 - City Center",
    ],
  },
  {
    id: "day-2",
    day: "Day 2",
    title: "Slow morning plan",
    accent: "#DFF3EE",
    active: false,
  },
] as const;

const bottomNavItems = [
  { label: "Explore", icon: "◌", active: false },
  { label: "My Trips", icon: "▣", active: true },
  { label: "Profile", icon: "◌", active: false },
] as const;

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const handleGoHome = () => {
    router.push("/");
  };

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
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screen}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: insets.top + 14,
                paddingBottom: insets.bottom + 124,
              },
            ]}
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

          <View
            style={[styles.bottomNav, { paddingBottom: insets.bottom || 12 }]}
          >
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#D9DFE7",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#D9DFE7",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 18,
  },
  brand: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "400",
    fontFamily: Fonts.serif,
    color: "#111827",
  },
  destination: {
    marginTop: 8,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  carouselWrap: {
    marginBottom: 16,
  },
  carousel: {
    paddingHorizontal: 2,
    gap: 12,
    alignItems: "center",
  },
  card: {
    width: 160,
    minHeight: 210,
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 18,
    elevation: 4,
  },
  cardActive: {
    width: 178,
    transform: [{ translateY: -6 }],
  },
  cardSide: {
    opacity: 0.88,
  },
  cardDay: {
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
    lineHeight: 20,
  },
  cardGhost: {
    flex: 1,
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  timeline: {
    marginTop: 14,
    gap: 10,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#7BBCA5",
    backgroundColor: "#DFF3EE",
  },
  timelineText: {
    flex: 1,
    color: "#374151",
    fontSize: 12,
    lineHeight: 16,
  },
  chatArea: {
    gap: 12,
    marginTop: "auto",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chatBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0F4C81",
  },
  chatTitle: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "500",
  },
  chatThread: {
    gap: 12,
  },
  chatBubble: {
    alignSelf: "flex-start",
    maxWidth: "88%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderTopLeftRadius: 6,
  },
  chatBubbleAssistant: {
    backgroundColor: "#C5EED8",
  },
  chatBubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    borderTopRightRadius: 6,
    borderTopLeftRadius: 18,
  },
  chatBubbleLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#E8F5F0",
  },
  chatBubbleLoadingText: {
    color: "#0F766E",
    fontSize: 13,
    fontWeight: "500",
  },
  chatBubbleText: {
    fontSize: 13,
    lineHeight: 19,
  },
  chatBubbleTextAssistant: {
    color: "#123226",
  },
  chatBubbleTextUser: {
    color: "#0F172A",
  },
  composer: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#163A67",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingLeft: 14,
    paddingRight: 6,
    height: 46,
  },
  composerInput: {
    flex: 1,
    color: "#0F172A",
    fontSize: 14,
  },
  composerButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF1F4",
  },
  composerButtonDisabled: {
    opacity: 0.5,
  },
  composerButtonPressed: {
    opacity: 0.72,
  },
  composerButtonText: {
    color: "#7C8FA3",
    fontSize: 14,
    fontWeight: "700",
  },
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(15, 23, 42, 0.08)",
    paddingTop: 12,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  bottomNavIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  bottomNavIconActive: {
    backgroundColor: "#D8E7F6",
  },
  bottomNavIconText: {
    fontSize: 14,
    color: "#64748B",
  },
  bottomNavIconTextActive: {
    color: "#0F4C81",
  },
  bottomNavLabel: {
    fontSize: 10,
    color: "#64748B",
  },
  bottomNavLabelActive: {
    color: "#0F4C81",
    fontWeight: "600",
  },
});
