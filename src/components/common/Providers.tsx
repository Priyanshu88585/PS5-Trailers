"use client";

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { useEffect, useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

function HydrationGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-ps5-void" aria-hidden>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={false}>
      <ReduxProvider store={store}>
        <HydrationGuard>{children}</HydrationGuard>
      </ReduxProvider>
    </SessionProvider>
  );
}
