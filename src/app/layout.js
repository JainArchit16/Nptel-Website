// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
// import { motion } from "framer-motion";

export const metadata = {
  title: "Home",
  description: "One stop solution for NPTEL exams",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full">
        <AuthProvider>
          <motion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar />
            {children}
            <Toaster />
          </motion>
          <div id="modal-root"></div>
        </AuthProvider>
      </body>
    </html>
  );
}
