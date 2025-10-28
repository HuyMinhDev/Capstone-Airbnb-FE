import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: number;
  iat: number;
  exp: number;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getUserId(): number | string | null {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.userId;
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}
