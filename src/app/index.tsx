import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OnboardingScreen() {
  const [apiKey, setApiKey] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function checkExistingKey() {
      let storedKey = null;

      // Verifica onde o app está rodando para buscar a chave
      if (Platform.OS === "web") {
        storedKey = localStorage.getItem("gemini_api_key");
      } else {
        storedKey = await SecureStore.getItemAsync("gemini_api_key");
      }

      if (storedKey) {
        router.replace("/workspace");
      }
    }
    checkExistingKey();
  }, []);

  const handleStart = async () => {
    if (apiKey.trim().length === 0) return;

    const keyToSave = apiKey.trim();

    // Salva a chave no local correto dependendo da plataforma
    if (Platform.OS === "web") {
      localStorage.setItem("gemini_api_key", keyToSave);
    } else {
      await SecureStore.setItemAsync("gemini_api_key", keyToSave);
    }

    router.replace("/workspace");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        {/* Hero Section */}
        <View className="mb-12">
          <Text className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            My Travel
          </Text>
          <Text className="text-lg text-slate-500 leading-relaxed">
            Seu assistente de bolso para roteiros incríveis. Conecte sua
            inteligência para começar a planejar.
          </Text>
        </View>

        {/* Input da API Key */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">
            Google Gemini API Key
          </Text>
          <TextInput
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 text-base"
            placeholder="Cole sua chave aqui (AIzaSy...)"
            placeholderTextColor="#94a3b8"
            secureTextEntry={true}
            value={apiKey}
            onChangeText={setApiKey}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text className="text-xs text-slate-400 mt-3">
            Sua chave fica salva apenas no seu aparelho.
          </Text>
        </View>

        {/* Botão de Ação */}
        <TouchableOpacity
          onPress={handleStart}
          activeOpacity={0.8}
          className={`w-full py-4 rounded-xl items-center ${
            apiKey.trim().length > 0 ? "bg-blue-600" : "bg-slate-300"
          }`}
          disabled={apiKey.trim().length === 0}
        >
          <Text className="text-white font-bold text-lg">Começar a Viajar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
