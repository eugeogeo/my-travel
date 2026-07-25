import Button from "@/components/button";
import {
  DESTINATION_REQUIRED_MESSAGE,
  hasDestination,
  navigateToExplore,
} from "@/navigation/explore";
import { RootStackParamList } from "@/navigation/root";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { styles } from "./styles";

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const Home = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const [destination, setDestination] = useState("");
  const [destinationError, setDestinationError] = useState("");

  const {
    scrollContent,
    shell,
    headerRow,
    brand,
    heroBlock,
    heroTitle,
    heroSubtitle,
    searchCard,
    searchInput,
    screen,
  } = styles;

  const heroDestination =
    destination.trim().length > 0 ? destination.trim() : "Rio de Janeiro";

  const handleExplore = () => {
    if (!hasDestination(destination)) {
      setDestinationError(DESTINATION_REQUIRED_MESSAGE);
      return;
    }

    setDestinationError("");
    navigateToExplore(navigation, destination);
  };

  return (
    <View style={screen}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={scrollContent}
      >
        <View style={[shell, { maxWidth: 420 }]}>
          <View style={headerRow}>
            <Text style={brand}>My Travel</Text>
          </View>

          <View style={heroBlock}>
            <Text style={heroTitle}>Para onde iremos?</Text>
            <Text style={heroSubtitle}>
              Planeje sua próxima viagem com facilidade.
            </Text>
          </View>

          <View style={searchCard}>
            <TextInput
              value={destination}
              onChangeText={(text) => {
                setDestination(text);
                if (destinationError) {
                  setDestinationError("");
                }
              }}
              placeholder={`Digite seu destino, por exemplo, ${heroDestination}`}
              placeholderTextColor="#8791A1"
              returnKeyType="done"
              style={searchInput}
            />
          </View>

          {destinationError ? (
            <Text style={styles.inputErrorText}>{destinationError}</Text>
          ) : null}

          <Button
            title="Explore ✈️"
            variant="contained"
            onPress={handleExplore}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
