import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ExternalLink } from "@/components/external-link";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";
import { useTheme } from "@/hooks/use-theme";

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();
  const { horizontalPadding, topPadding, bottomPadding, maxContentWidth } =
    useResponsiveLayout();

  const contentPlatformStyle = Platform.select({
    ios: {
      paddingTop: safeAreaInsets.top + topPadding,
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      paddingBottom:
        safeAreaInsets.bottom + bottomPadding + BottomTabInset + Spacing.three,
    },
    android: {
      paddingTop: topPadding,
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      paddingBottom: bottomPadding + BottomTabInset + Spacing.three,
    },
    default: {
      paddingTop: topPadding,
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      paddingBottom: bottomPadding + BottomTabInset + Spacing.three,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentInsetAdjustmentBehavior={
        Platform.OS === "ios" ? "always" : "never"
      }
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView
        style={[
          styles.container,
          { maxWidth: maxContentWidth, width: "100%", alignSelf: "center" },
        ]}
      >
        <ThemedView
          style={[
            styles.titleContainer,
            {
              paddingHorizontal: horizontalPadding,
              paddingTop: topPadding,
              paddingBottom: bottomPadding,
            },
          ]}
        >
          <ThemedText type="subtitle">Explore</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            Conteúdo de apoio para testar navegação e layout no app.
          </ThemedText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView type="backgroundElement" style={styles.linkButton}>
                <ThemedText type="link">Expo documentation</ThemedText>
                <Text style={{ color: theme.text, fontWeight: "700" }}>↗</Text>
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        <ThemedView
          style={[
            styles.sectionsWrapper,
            { maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding },
          ]}
        >
          <View style={styles.simpleCard}>
            <ThemedText type="smallBold">Tela nativa simplificada</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Mantive apenas conteúdo estático para eliminar qualquer crash de
              animação ou componente opcional no iPhone.
            </ThemedText>
          </View>

          <View style={styles.simpleCard}>
            <ThemedText type="smallBold">Próximo passo</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Se essa tela aparecer no app, o problema estava nos componentes
              animados e a gente reintroduz um por um.
            </ThemedText>
          </View>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: "row",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    justifyContent: "center",
    gap: Spacing.one,
    alignItems: "center",
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  simpleCard: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
  imageTutorial: {
    width: "100%",
    aspectRatio: 296 / 171,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
});
