import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import { motion } from "framer-motion";
// import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Home",
  description: "One stop solution for nptel exams",
};

export default function RootLayout({ children }) {
  return (
    <>
      <AuthProvider>
        <html lang="en" className="h-full">
          <head>
            <link rel="icon" href="/assests/mainLogo.jpg" />
          </head>
          <body className="h-full w-full">
            <motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3 }}
            >
              <Toaster />
              <Navbar />
              {children}
            </motion>
          </body>
        </html>
      </AuthProvider>
    </>
  );
}
