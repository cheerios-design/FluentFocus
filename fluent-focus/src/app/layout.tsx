import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FluentFocus - Master TOEFL & IELTS Vocabulary",
  description: "Daily practice app for Turkish speakers preparing for TOEFL and IELTS exams. Improve your Reading, Listening, Writing, and Speaking skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              FluentFocus
            </Link>
            <div className="flex gap-8 items-center">
              <Link href="/practice" className="text-lg font-semibold text-gray-700 hover:text-purple-600 transition-colors">
                Practice
              </Link>
              <Link href="/progress" className="text-lg font-semibold text-gray-700 hover:text-purple-600 transition-colors">
                Progress
              </Link>
              <Link href="/about" className="text-lg font-semibold text-gray-700 hover:text-purple-600 transition-colors">
                About
              </Link>
            </div>
          </div>
        </nav>
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
