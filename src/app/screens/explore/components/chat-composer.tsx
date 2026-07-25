import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "../styles";

type ChatComposerProps = {
  value: string;
  isLoading: boolean;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
};

export const ChatComposer = ({
  value,
  isLoading,
  onChangeText,
  onSubmit,
}: ChatComposerProps) => {
  return (
    <View style={styles.composer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Type your message..."
        placeholderTextColor="#8EA0A6"
        style={styles.composerInput}
        onSubmitEditing={onSubmit}
        returnKeyType="send"
        editable={!isLoading}
      />
      <Pressable
        onPress={onSubmit}
        disabled={isLoading || value.trim().length === 0}
        style={({ pressed }) => [
          styles.composerButton,
          (isLoading || value.trim().length === 0) &&
            styles.composerButtonDisabled,
          pressed &&
            !isLoading &&
            value.trim().length > 0 &&
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
  );
};
