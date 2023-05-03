import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import initAuth from "@/utils/firebase/initAuth";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useRef } from "react";
import { Analytics } from '@vercel/analytics/react';
initAuth();

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false, // default: true
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
        <Analytics/>
      </Hydrate>
    </QueryClientProvider>
  );
}
