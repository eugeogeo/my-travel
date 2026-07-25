import { createNavigationContainerRef } from "@react-navigation/native";

export type RootStackParamList = {
  Home: undefined;
  Explore: { destination: string };
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
