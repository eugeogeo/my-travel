import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { styles } from "./styles";

const Home = () => {
  const [destination, setDestination] = useState("");

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
    primaryButton,
    primaryButtonText,
    screen,
  } = styles;

  const heroDestination =
    destination.trim().length > 0 ? destination.trim() : "Rio de Janeiro";

  const handleExplore = () => {};

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
              onChangeText={setDestination}
              placeholder={`Digite seu destino, por exemplo, ${heroDestination}`}
              placeholderTextColor="#8791A1"
              returnKeyType="done"
              style={searchInput}
            />
          </View>

          <Pressable style={primaryButton} onPress={handleExplore}>
            <Text style={primaryButtonText}>Explore ✈️</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
