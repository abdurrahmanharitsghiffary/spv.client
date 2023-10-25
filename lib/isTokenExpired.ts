export const isTokenExpired = (token: string) => {
  if (typeof window === "undefined") return null;
  const exp = JSON.parse(window.atob(token.split(".")[1]))?.exp;
  if (Date.now() >= exp * 1000) {
    return true;
  }
  return false;
};
