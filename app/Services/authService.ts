// src/services/authService.ts
export interface AppUser {
    id: string;
    email: string;
    username: string;
  }
  
  export interface AuthResponse {
    user: AppUser;
    token: string;
  }
  
  //  IMPORTANTE:
  // - Si usas Postman o web: 'http://localhost:3000'
  // - Si usas EMULADOR ANDROID: 'http://10.0.2.2:3000'
  // - Si usas CELULAR FÍSICO: 'http://TU_IP_LOCAL:3000'
  const API_URL = 'http://localhost:3000';
  
  async function handleResponse(res: Response) {
    const data = await res.json().catch(() => ({}));
  
    if (!res.ok) {
      const message =
        data.message ||
        data.error ||
        'Error al comunicarse con el servidor';
      throw new Error(message);
    }
  
    return data;
  }
  
  export async function registerUser(
    email: string,
    password: string,
    username: string,
  ): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
  
    const data = await handleResponse(res);
    return data as AuthResponse;
  }
  
  export async function loginUser(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await handleResponse(res);
    return data as AuthResponse;
  }
  