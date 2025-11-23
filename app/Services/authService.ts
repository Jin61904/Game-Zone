// src/services/authService.ts
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface AppUser {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  user: AppUser;
}

/** ============================
 *  REGISTRAR USUARIO EN FIREBASE
 *  ============================ */
export async function registerUser(
  email: string,
  password: string,
  username: string
): Promise<AuthResponse> {
  // Crear usuario en Firebase Auth
  const result = await createUserWithEmailAndPassword(auth, email, password);

  const uid = result.user.uid;

  // Guardar datos adicionales en Firestore
  await setDoc(doc(db, "users", uid), {
    id: uid,
    email,
    username,
    createdAt: new Date().toISOString(),
  });

  return {
    user: {
      id: uid,
      email,
      username,
    },
  };
}

/** ============================
 *  INICIAR SESIÓN CON FIREBASE
 *  ============================ */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const uid = result.user.uid;

  // Obtener información del usuario en Firestore
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) {
    throw new Error("No se encontró la información del usuario");
  }

  return {
    user: snap.data() as AppUser,
  };
}
