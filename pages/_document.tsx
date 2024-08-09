import { Html, Head, Main, NextScript } from "next/document";
import { Toaster } from "react-hot-toast";

export default function Document() {
  
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon-dark.ico"
          media="(prefers-color-scheme:dark)"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon-dark.png"
          media="(prefers-color-scheme:dark)"
        />
        <link rel="mask-icon" href="/favicon.svg" color="#d7dede" />
        <link
          rel="mask-icon"
          href="/favicon-dark.svg"
          color="var(--color-surface-300)"
          media="(prefers-color-scheme:dark)"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Mono&display=swap"
          rel="stylesheet"
        ></link>
        <link
          rel="style"
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
