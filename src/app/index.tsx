import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

import { Fonts } from "@/constants/theme";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";

const quickDestinations = ["Rio de Janeiro", "Prague", "Serengeti"];

const bottomNavItems = [
  { label: "Explore", icon: "✈", active: true },
  { label: "My Trips", icon: "▣", active: false },
  { label: "Profile", icon: "◌", active: false },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { horizontalPadding, topPadding, bottomPadding, maxContentWidth } =
    useResponsiveLayout();
  const [destination, setDestination] = useState("");

  const heroDestination =
    destination.trim().length > 0 ? destination.trim() : "Rio de Janeiro";

  const handleExplore = () => {
    router.push({
      pathname: "/explore",
      params: { destination: heroDestination },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + topPadding,
              paddingBottom: bottomPadding,
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <View style={[styles.shell, { maxWidth: maxContentWidth ?? 420 }]}>
            <View style={styles.headerRow}>
              <Text style={styles.brand}>My Travel</Text>
            </View>

            <View style={styles.heroBlock}>
              <Text style={styles.heroTitle}>Para onde iremos?</Text>
              <Text style={styles.heroSubtitle}>
                Planeje sua próxima viagem com facilidade.
              </Text>
            </View>

            <View style={styles.searchCard}>
              <TextInput
                value={destination}
                onChangeText={setDestination}
                placeholder={`Digite seu destino, por exemplo, ${heroDestination}`}
                placeholderTextColor="#8791A1"
                returnKeyType="done"
                style={styles.searchInput}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {quickDestinations.map((item) => {
                const isActive = destination === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setDestination(item)}
                    style={({ pressed }) => [
                      styles.chip,
                      isActive && styles.chipActive,
                      pressed && styles.chipPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isActive && styles.chipTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Next stop</Text>
              <Text style={styles.summaryValue}>{heroDestination}</Text>
              <Text style={styles.summaryHint}>
                Tap a suggestion above or type your own destination.
              </Text>
            </View>

            <Pressable style={styles.primaryButton} onPress={handleExplore}>
              <Text style={styles.primaryButtonText}>Explore</Text>
            </Pressable>
          </View>
        </ScrollView>

        <View
          style={[styles.bottomNav, { paddingBottom: insets.bottom || 12 }]}
        >
          {bottomNavItems.map((item) => (
            <Pressable
              key={item.label}
              onPress={item.active ? handleExplore : undefined}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  shell: {
    width: "100%",
    alignSelf: "center",
  },
  headerRow: {
    marginBottom: 14,
    alignSelf: "center",
  },
  brand: {
    color: "#111827",
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "400",
    fontFamily: Fonts.serif,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(16, 185, 129, 0.10)",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: "#0F766E",
    textTransform: "uppercase",
  },
  heroBlock: {
    marginTop: 14,
    gap: 10,
  },
  heroTitle: {
    color: "#0F172A",
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.1,
    fontWeight: "500",
  },
  heroSubtitle: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 260,
  },
  searchCard: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#1E3A8A",
    shadowColor: "#0F172A",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  searchInput: {
    height: 48,
    paddingHorizontal: 14,
    color: "#0F172A",
    fontSize: 13,
  },
  chipRow: {
    gap: 10,
    paddingTop: 14,
    paddingBottom: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 0,
    backgroundColor: "#D6F1E7",
  },
  chipActive: {
    backgroundColor: "#BEEAD9",
  },
  chipPressed: {
    opacity: 0.82,
  },
  chipText: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#0B1F18",
    fontWeight: "600",
  },
  summaryCard: {
    marginTop: 10,
    padding: 16,
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.06)",
  },
  summaryLabel: {
    color: "#94A3B8",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: "600",
  },
  summaryValue: {
    marginTop: 8,
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "600",
  },
  summaryHint: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    marginTop: 14,
    height: 54,
    borderRadius: 0,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(15, 23, 42, 0.08)",
    width: "100%",
  },
  bottomNavItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  bottomNavIcon: {
    width: 28,
    height: 28,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  bottomNavIconActive: {
    backgroundColor: "#E7F4FE",
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
