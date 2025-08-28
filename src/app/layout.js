import Script from 'next/script';

import WebNavBar from "@/components/header/web-nav-bar";
import WebFooter from "@/components/footer/web-footer";

import { spartanFont } from "@/lib/fonts";
import { colors } from "@/lib/colors";

import "./globals.css";
import styles from './layout.module.css';

export const metadata = {
  title: "Westville Warehouse",
  description: "The Westville Warehouse: Where Durban nightlife comes alive.",
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/icon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/icons/icon-180x180.png",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: colors.greydark1,
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <Script 
          id="local-business-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "The Westville Warehouse",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "48a Buckingham Terrace",
                "addressLocality": "Durban",
                "addressRegion": "KwaZulu-Natal",
                "postalCode": "4001",
                "addressCountry": "ZA"
              },
              "telephone": "+2763 448 9165",
              "url": "https://thewestvillewarehouse.co.za"
            }),
          }}
        />
      </head>
          <body className={spartanFont.className}>
            <WebNavBar/>
            <main className={styles.main}>
              {children}
            </main>
            <WebFooter/>
          </body>
    </html>
  );
}
