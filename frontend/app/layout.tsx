import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Typeform Clone",
  description: "Create and manage your forms.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#281f2a",
          colorForeground: "#1f1f1f",
          colorMutedForeground: "#737373",
          colorBackground: "#ffffff",
          colorBorder: "#dedede",
          borderRadius: "14px",
          fontFamily:
            "var(--font-geist-sans), Arial, sans-serif",
        },

        elements: {
          card: {
            width: "420px",
            borderRadius: "28px",
            border: "1px solid #e9e9e9",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.18)",
            padding: "36px",
          },

          headerTitle: {
            fontSize: "28px",
            lineHeight: "1.15",
            fontWeight: "600",
            letterSpacing: "-0.7px",
            color: "#281f2a",
          },

          headerSubtitle: {
            marginTop: "8px",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#777777",
          },

          socialButtonsBlockButton: {
            height: "48px",
            borderRadius: "12px",
            border: "1px solid #dedede",
            background: "#ffffff",
            boxShadow: "none",
            fontSize: "14px",
            fontWeight: "500",
            color: "#282828",
          },

          socialButtonsBlockButtonText: {
            fontSize: "14px",
            fontWeight: "500",
          },

          dividerLine: {
            background: "#e8e8e8",
          },

          dividerText: {
            color: "#999999",
            fontSize: "12px",
          },

          formFieldLabel: {
            fontSize: "13px",
            fontWeight: "500",
            color: "#333333",
            marginBottom: "7px",
          },

          formFieldInput: {
            height: "48px",
            borderRadius: "12px",
            border: "1px solid #d8d8d8",
            background: "#ffffff",
            boxShadow: "none",
            fontSize: "14px",
            paddingLeft: "14px",
          },

          formFieldInputShowPasswordButton: {
            color: "#777777",
          },

          formButtonPrimary: {
            height: "48px",
            borderRadius: "999px",
            background: "#281f2a",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "none",
          },

          footer: {
            background: "#ffffff",
            border: "none",
          },

          footerActionText: {
            color: "#777777",
            fontSize: "13px",
          },

          footerActionLink: {
            color: "#281f2a",
            fontSize: "13px",
            fontWeight: "600",
          },

          identityPreviewText: {
            color: "#333333",
          },
        },

        options: {
          elevation: "raised",
          socialButtonsPlacement: "top",
          socialButtonsVariant: "blockButton",
          animations: true,
          autoFocus: true,
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}