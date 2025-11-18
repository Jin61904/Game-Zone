import { create } from "zustand";

interface AuthModalStore {
  isOpen: boolean;
  mode: "login" | "register";
  open: (m?: "login" | "register") => void;
  close: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  mode: "login",

  open: (mode = "login") => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false }),
}));
