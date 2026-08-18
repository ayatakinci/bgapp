import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/dal";
import { logout } from "@/lib/auth/actions";
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
  title: "bgapp — Learn Bulgarian",
  description: "A spaced-repetition Bulgarian vocabulary trainer",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        <header className="border-b border-stone-200 bg-white">
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              bgapp
            </Link>
            <Link href="/curriculum" className="text-sm font-medium text-stone-900 hover:underline">
              Curriculum
            </Link>
            <Link href="/lessons" className="text-sm text-stone-600 hover:text-stone-900">
              Lessons
            </Link>
            <Link href="/grammar" className="text-sm text-stone-600 hover:text-stone-900">
              Grammar
            </Link>
            <Link href="/words" className="text-sm text-stone-600 hover:text-stone-900">
              All words
            </Link>
            <Link href="/review" className="text-sm text-stone-600 hover:text-stone-900">
              Review
            </Link>
            <Link href="/word-bank" className="text-sm text-stone-600 hover:text-stone-900">
              Word bank
            </Link>
            <Link href="/progress" className="text-sm text-stone-600 hover:text-stone-900">
              Progress
            </Link>

            <div className="ml-auto flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-stone-500">{user.email}</span>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="text-sm text-stone-600 hover:text-stone-900"
                    >
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-stone-600 hover:text-stone-900">
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
