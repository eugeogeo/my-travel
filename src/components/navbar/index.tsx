import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getNavItemStyle, getNavLabelStyle, styles } from "./styles";

const NavBar = () => {
  const insets = useSafeAreaInsets();

  const { Nav, NavIcon, NavIconText } = styles;

  const items = [
    { label: "Explore", icon: "✈️", isActive: true },
    { label: "Minhas viagens", icon: "⛱", isActive: false },
    { label: "Perfil", icon: "👤", isActive: false },
  ];

  const handleExplore = () => {};

  return (
    <View style={[Nav, { padding: insets.bottom || 12 }]}>
      {items.map(({ label, icon, isActive }) => (
        <Pressable
          key={label}
          onPress={isActive ? handleExplore : undefined}
          style={getNavItemStyle(isActive)}
        >
          <View style={NavIcon}>
            <Text style={NavIconText}>{icon}</Text>
          </View>
          <Text style={getNavLabelStyle(isActive)}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default NavBar;
