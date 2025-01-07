import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./src/styles.css";

export default function App() {
	return (
		<SafeAreaProvider>
			<StatusBar style="dark" />
		</SafeAreaProvider>
	);
}
