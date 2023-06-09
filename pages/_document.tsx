import { Html, Head, Main, NextScript } from "next/document";
import { Toaster } from "react-hot-toast";

export default function Document() {
  const descp = "A lightweight note-taking app that aims to combine the best of Google Keep and Notion";
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" />
        <meta charSet="UTF-8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon-dark.ico" media="(prefers-color-scheme:dark)" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-dark.png" media="(prefers-color-scheme:dark)" />
        <link rel="mask-icon" href="/favicon.svg" color="#d7dede" />
        <link
          rel="mask-icon"
          href="/favicon-dark.svg"
          color="var(--color-surface-300)"
          media="(prefers-color-scheme:dark)"
        />
        <meta name="msapplication-TileColor" content="#d7dede" />
        <meta name="msapplication-TileColor" content="var(--color-surface-300)" media="(prefers-color-scheme:dark)" />
        <meta name="theme-color" content="#d7dede" />
        <meta name="theme-color" content="var(--color-surface-300)" media="(prefers-color-scheme:dark)" />

        <meta name="description" content={descp} />
        <meta name="keywords" content="Keywords" />
        {/*twitter meta tags*/}
        <meta name="twitter:card" content="A lightweight note-taking app." />
        <meta name="twitter:url" content="https://do-note.vercel.app/" />
        <meta name="twitter:title" content="PWA App" />
        <meta name="twitter:description" content={descp} />
        <meta name="twitter:image" content="https://https://do-note.vercel.app/android-chrome-192x192.png" />
        <meta name="twitter:creator" content="@MadavanaB" />
        {/* <meta property="og:type" content="website" /> */}
        {/* <meta property="og:title" content="PWA App" /> */}
        {/* <meta property="og:description" content="Best PWA App in the world" /> */}
        {/* <meta property="og:site_name" content="PWA App" /> */}
        {/* <meta property="og:url" content="https://yourdomain.com" /> */}
        {/* <meta property="og:image" content="https://yourdomain.com/icons/apple-touch-icon.png" /> */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <div><Toaster/></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
