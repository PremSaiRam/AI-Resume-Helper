import { useEffect } from "react";

export function useToken(onToken) {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.substring(1)).get("access_token");
      if (token) {
        onToken(token);
        window.location.hash = ""; // Clean URL
      }
    }
  }, [onToken]);
}
