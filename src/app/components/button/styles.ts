import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 54,
    borderRadius: 20,
    backgroundColor: "#0F172A",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContained: {
    backgroundColor: "#0F172A",
  },
  buttonContainedPressed: {
    backgroundColor: "#243763",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#2f4374",
  },
  buttonText: {
    height: 44,
    backgroundColor: "transparent",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  labelContained: {
    color: "#FFFFFF",
  },
  labelOutline: {
    color: "#0F172A",
  },
  labelText: {
    color: "#0F4C81",
  },
});
