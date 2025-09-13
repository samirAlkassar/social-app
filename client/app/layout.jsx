import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/useUser";
import { BookmarksProvider } from "./context/useBookmarks";
import { FriendsProvider } from "./context/useFriends";
import { PostsProvider } from "./context/usePosts";
import { PostActionsMenuProvider } from "./context/usePostActionMenu";
import { ThemeProvider } from "./context/useTheme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mawja",
  description: "Mawja is a modern social media platform that connects people through seamless sharing, meaningful conversations, and vibrant communities — all in a simple, intuitive experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          <BookmarksProvider>
            <FriendsProvider>
              <PostsProvider>
                <PostActionsMenuProvider>
                  <ThemeProvider>
                    {children}
                  </ThemeProvider>
                </PostActionsMenuProvider>
              </PostsProvider>
            </FriendsProvider>
          </BookmarksProvider>
        </UserProvider>
      </body>
    </html>
  );
}
