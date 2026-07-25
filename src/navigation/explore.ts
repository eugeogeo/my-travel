import { navigationRef } from "./root";

type ExploreNavigator = {
  navigate: (screen: "Explore", params: { destination: string }) => void;
};

export const DEFAULT_DESTINATION = "Rio de Janeiro";
export const DESTINATION_REQUIRED_MESSAGE = "Você precisa informar um destino.";

export function normalizeDestination(destination: string): string {
  return destination.trim();
}

export function hasDestination(destination: string): boolean {
  return normalizeDestination(destination).length > 0;
}

export function navigateToExplore(
  navigation?: ExploreNavigator,
  destination?: string,
): void {
  const normalized = typeof destination === "string" ? destination.trim() : "";
  const finalDestination = normalized.length > 0 ? normalized : DEFAULT_DESTINATION;

  if (navigation) {
    navigation.navigate("Explore", { destination: finalDestination });
    return;
  }

  if (navigationRef.isReady()) {
    navigationRef.navigate("Explore", { destination: finalDestination });
  }
}
