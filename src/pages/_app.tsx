import "@/styles/globals.css";
import type { AppProps } from "next/app";
import axios from "axios";

axios.defaults.baseURL = "https://api-art-expo.vercel.app";

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
