// pages/_app.tsx
import "../styles/globals.css"; // Убедись, что файл подключён здесь
import { AppProps } from "next/app";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const html = document.documentElement;
    if (savedTheme === "dark") {
      html.classList.add("dark");
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;