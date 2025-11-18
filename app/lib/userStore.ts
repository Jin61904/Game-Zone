import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  username: string;
}

interface UserStore {
  user: User | null;
  setUser: (u: User | null) => Promise<void>;
  logout: () => Promise<void>;
}

export const useUser = create<UserStore>((set) => ({
  user: null,

  setUser: async (u) => {
    if (u) {
      await AsyncStorage.setItem("user", JSON.stringify(u));
    } else {
      await AsyncStorage.removeItem("user");
    }
    set({ user: u });
  },

  logout: async () => {
    await AsyncStorage.removeItem("user");
    set({ user: null });
  },
}));
