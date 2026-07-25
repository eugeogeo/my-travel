import ExploreScreen from "@/app/screens/explore";
import Home from "@/app/screens/home";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { navigationRef, RootStackParamList } from "./root";

export type { RootStackParamList } from "./root";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes: React.FC = () => {
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "transparent",
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "transparent" },
        }}
        initialRouteName={"Home"}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
