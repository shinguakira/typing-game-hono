import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Typing Game | Test Your Programming Knowledge',
  description: 'A fun typing game to test your speed with programming-related terms. Challenge yourself and compete on the global leaderboard!',
  keywords: 'typing game, programming, coding, speed typing, tech terms, React, Next.js, Hono',
  authors: [{ name: 'Akira Shingu' }],
  openGraph: {
    title: 'Typing Game | Test Your Programming Knowledge',
    description: 'A fun typing game to test your speed with programming-related terms. Challenge yourself and compete on the global leaderboard!',
    images: ['/monster1.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Typing Game | Test Your Programming Knowledge',
    description: 'A fun typing game to test your speed with programming-related terms. Challenge yourself and compete on the global leaderboard!',
    images: ['/monster1.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
