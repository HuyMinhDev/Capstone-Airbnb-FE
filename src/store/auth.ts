import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

export interface TokenPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

interface AuthState {
  userId: number | string | null;
  role: string | null;
  setUserId: (id: number | null) => void;
  setRole: (role: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  let id: number | null = null;
  let role: string | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      id = decoded.userId;
      role = decoded.role ?? null;
    } catch {
      // token lỗi thì bỏ qua
    }
  }

  return {
    userId: id,
    role,
    setUserId: (id) => set({ userId: id }),
    setRole: (role) => set({ role }),
  };
});
