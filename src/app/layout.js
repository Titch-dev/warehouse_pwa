
import WebNavBar from "@/components/header/web-nav-bar";

import { spartanFont } from "@/lib/fonts";
import { colors } from "@/lib/colors";

import "./globals.css";

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
          <body className={spartanFont.className}>
            <WebNavBar/>
            {children}
          </body>
    </html>
  );
}
