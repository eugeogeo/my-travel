import { ChatMessage } from "@/@types/api-gemini";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { styles } from "../styles";

type ChatThreadProps = {
  messages: ChatMessage[];
};

export const ChatThread = ({ messages }: ChatThreadProps) => {
  return (
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
  );
};
