import { AuthModal } from "@/components/AuthModal";
import { useUser } from "@/lib/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { setUser } = useUser();

  useEffect(() => {
    async function loadUser() {
      const saved = await AsyncStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    }
    loadUser();
  }, []);
  return (
    <>
      <Slot />
      <AuthModal />
    </>
  );
}
