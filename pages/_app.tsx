import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/poppins/400.css";
import { useEffect } from 'react';
import { loadGoogleAPI } from '../utils/google-api'; // Import your utility file


import theme from "../theme";

export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
        loadGoogleAPI().then(() => {
            console.log("Google API loaded and initialized");
        }).catch((error) => {
            console.error("Google API load error", error);
        });
    }, []);
	
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
