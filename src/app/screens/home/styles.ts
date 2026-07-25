import { Fonts } from "@/constants/theme";
import {
  StyleSheet,
} from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  shell: {
    width: "100%",
    alignSelf: "center",
    gap: 40,
  },
  headerRow: {
    alignSelf: "center",
    margin: 16
  },
  brand: {
    color: "#111827",
    fontSize: 36,
    lineHeight: 36,
    fontWeight: "400",
    fontFamily: Fonts.serif,
  },
  heroBlock: {
    gap: 4,
  },
  heroTitle: {
    color: "#0F172A",
    fontSize: 24,
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
  inputErrorText: {
    marginTop: -24,
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "500",
  },
});
