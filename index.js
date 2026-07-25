import { registerRootComponent } from "expo";
import "react-native-gesture-handler";

import App from "./App";

const AppRoot = () => {

  return <App />;
};

registerRootComponent(AppRoot);
