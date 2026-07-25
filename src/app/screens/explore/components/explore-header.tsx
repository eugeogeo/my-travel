import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";

type ExploreHeaderProps = {
  destination: string;
};

export const ExploreHeader = ({ destination }: ExploreHeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.brand}>My Travel</Text>
      <Text style={styles.destination}>
        Entrevista de viagem para {destination}
      </Text>
    </View>
  );
};
