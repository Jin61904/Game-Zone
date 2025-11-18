import { create } from "zustand";

interface AuthStore {
  isOpen: boolean;
  mode: "login" | "register";
  open: (mode?: "login" | "register") => void;
  close: () => void;
}

export const useAuthModal = create<AuthStore>((set) => ({
  isOpen: false,
  mode: "login",

  open: (mode = "login") => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false }),
}));
