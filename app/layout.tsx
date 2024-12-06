import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ChatProvider } from "@/context/chatContext";
import { Session } from "next-auth";
import AuthProvider from "@/context/authProvider";
import { headers } from "next/headers";
import "./globals.css";

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch(`http://localhost:3000/api/auth/session`, {
    headers: {
      cookie,
    },
  }); 
  console.log('error')
  const session = await response.json();
  return Object.keys(session).length > 0 ? session : null;
}

export const metadata: Metadata = {
  title: "Math-Calc",
  description: "A GenAI based calculator",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {

  const header = await headers();
  const cookie = header.get('cookie') ?? '';
  const session = await getSession(cookie);

  return (
    <html lang="en">
      <body className={poppins.variable}>
      <AuthProvider session={session}>
      <ChatProvider>
        {children}
        </ChatProvider>
      </AuthProvider>
      </body>
    </html>
  );
}
