import { Fonts } from "@/constants/theme";
import {
  StyleSheet,
} from "react-native";

export const styles = StyleSheet.create({
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
