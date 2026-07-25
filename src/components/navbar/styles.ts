import {
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

export const styles = StyleSheet.create({ Nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(15, 23, 42, 0.08)",
    width: "100%",
  },
  NavItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  NavIcon: {
    width: 28,
    height: 28,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  NavIconText: {
    fontSize: 14,
    color: "#64748B",
  },
  NavLabel: {
    fontSize: 10,
    color: "#64748B",
  },
  NavLabelActive: {
    color: "#0F4C81",
    fontWeight: "600",
  },})

export const getNavItemStyle = (
  isActive: boolean,
): StyleProp<ViewStyle> => [
  styles.NavItem,
  { backgroundColor: isActive ? "#E7F4FE" : "transparent" , borderRadius: 16, paddingVertical: 4},
];

export const getNavLabelStyle = (
  isActive: boolean,
): StyleProp<TextStyle> => [
  styles.NavLabel,
  isActive ? styles.NavLabelActive : null,
];