let tokenValue = "";

export function setToken(newToken: string) {
  tokenValue = newToken;
}

export function getToken(): string {
  return tokenValue;
}