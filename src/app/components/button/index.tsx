import React, { useState } from "react";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";
import { styles } from "./styles";

type ButtonVariant = "text" | "outline" | "contained";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const Button = ({
  title,
  onPress,
  variant = "contained",
  style,
  textStyle,
}: ButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const isContained = variant === "contained";

  const buttonVariantStyle =
    variant === "outline"
      ? styles.buttonOutline
      : variant === "text"
        ? styles.buttonText
        : styles.buttonContained;

  const labelVariantStyle =
    variant === "outline"
      ? styles.labelOutline
      : variant === "text"
        ? styles.labelText
        : styles.labelContained;

  return (
    <Pressable
      style={[
        styles.button,
        buttonVariantStyle,
        isContained && isPressed && styles.buttonContainedPressed,
        style,
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
    >
      <Text style={[styles.label, labelVariantStyle, textStyle]}>{title}</Text>
    </Pressable>
  );
};

export default Button;
