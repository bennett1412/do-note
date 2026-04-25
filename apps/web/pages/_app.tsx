import "@mantine/core/styles.css";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import { SessionProvider } from "@/hooks/useSession";
import { Toaster } from "react-hot-toast";
import AppLayout from "@/components/Layout/AppLayout";
import { theme } from "@/styles/theme";
import { MantineProvider } from "@mantine/core";

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
  const descp =
    "A lightweight note-taking app that aims to combine the best of Google Keep and Notion";
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient.current}>
        <MantineProvider theme={theme} forceColorScheme="dark">
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="msapplication-TileColor" content="#d7dede" />
            <meta
              name="msapplication-TileColor"
              content="var(--color-surface-300)"
              media="(prefers-color-scheme:dark)"
            />
            <meta name="theme-color" content="#d7dede" />
            <meta
              name="theme-color"
              content="var(--color-surface-300)"
              media="(prefers-color-scheme:dark)"
            />

            <meta name="description" content={descp} />
            <meta name="keywords" content="Keywords" />
            {/*twitter meta tags*/}
            <meta name="twitter:card" content="A lightweight note-taking app." />
            <meta name="twitter:url" content="https://do-note.vercel.app/" />
            <meta name="twitter:title" content="PWA App" />
            <meta name="twitter:description" content={descp} />
            <meta
              name="twitter:image"
              content="https://https://do-note.vercel.app/android-chrome-192x192.png"
            />
            <meta name="twitter:creator" content="@MadavanaB" />
          </Head>
          <Hydrate state={pageProps.dehydratedState}>
            <Toaster />
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
            <Analytics />
          </Hydrate>
        </MantineProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
