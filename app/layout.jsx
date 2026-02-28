import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import Navigation from "../components/navigation";
import UserProfileSync from "../components/user-profile-sync";
import { setupAutoCleanup } from "../lib/supabase-realtime";

// Set up auto-cleanup for real-time subscriptions
if (typeof window !== 'undefined') {
  setupAutoCleanup();
}

export const metadata = {
  author: "Allan Oguis",
  title: "The Gojirun Project",
  description:
    "Gojirun is a 2D platformer game inspired by the classic T-Rex run from Chrome. This project is dedicated to Hacktoberfest 2024 and all its contributors.",
  icons: {
    icon: "/assets/images/branding/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="scroll-smooth antialiased"
        suppressHydrationWarning
      >
        <head />
        <body className="bg-background font-space transition-all duration-300">
          <ThemeProvider attribute="class">
            <>
              <Navigation />
              <UserProfileSync />
            </>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
