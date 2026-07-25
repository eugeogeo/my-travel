import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "./app/components/navbar";
import { useResponsiveLayout } from "./hooks/use-responsive-layout";
import Routes from "./navigation";
import { styles } from "./styles";

SplashScreen.preventAutoHideAsync();

const Main: React.FC = () => {
  const { horizontalPadding, topPadding, bottomPadding } =
    useResponsiveLayout();

  React.useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
      // Ignora falha eventual ao esconder o splash durante o boot.
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: horizontalPadding,
          paddingTop: topPadding,
          paddingBottom: bottomPadding,
        }}
      >
        <Routes />
      </View>
      <NavBar />
    </SafeAreaView>
  );
};

export default Main;
