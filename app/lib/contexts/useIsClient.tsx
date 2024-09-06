import { useEffect, useState } from "react";

export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  // If this code block runs its means the component is mounted/client component
  // and we can use browser specific APIs
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
