import { Platform, useWindowDimensions } from "react-native";

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  const isTablet = Math.min(width, height) >= 768;
  const isWideWeb = Platform.OS === "web" && width >= 1024;

  const horizontalPadding = isTablet ? 40 : 24;
  const topPadding = isTablet ? 24 : 12;
  const bottomPadding = isTablet ? 28 : 16;
  const maxContentWidth = isTablet || isWideWeb ? 720 : undefined;

  return {
    isTablet,
    horizontalPadding,
    topPadding,
    bottomPadding,
    maxContentWidth,
  };
}