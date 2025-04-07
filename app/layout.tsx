import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import { Locale, dictionaries } from './i18n/dictionaries';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Get the locale from the Accept-Language header or default to 'en'
async function getLocale(): Promise<Locale> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  const parsedLocales = acceptLanguage.split(',').map((l: string) => l.split(';')[0].trim());
  for (const locale of parsedLocales) {
    const shortLocale = locale.substring(0, 2) as Locale;
    if (Object.keys(dictionaries).includes(shortLocale)) {
      return shortLocale;
    }
  }
  
  return 'en';
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = dictionaries[locale];

  return {
    title: dict.title,
    description: dict.description,
    keywords: dict.keywords,
    authors: [{ name: 'Akira Shingu' }],
    metadataBase: new URL('https://typing-game-hono.vercel.app'),
    openGraph: {
      type: 'website',
      locale: locale,
      url: 'https://typing-game-hono.vercel.app',
      siteName: dict.title,
      title: dict.title,
      description: dict.description,
      images: [
        {
          url: '/monster-slayer/dragon.png',
          width: 1200,
          height: 630,
          alt: 'Dragon from Monster Slayer Typing Game'
        },
        {
          url: '/monster-slayer/Slime.png',
          width: 1200,
          height: 630,
          alt: 'Slime from Monster Slayer Typing Game'
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.title,
      description: dict.description,
      site: '@AkiraShingu',
      creator: '@AkiraShingu',
      images: [
        {
          url: '/monster-slayer/dragon.png',
          width: 1200,
          height: 630,
          alt: 'Dragon from Monster Slayer Typing Game'
        }
      ],
    },
    alternates: {
      languages: Object.fromEntries(
        Object.keys(dictionaries).map(lang => [lang, `/${lang}`])
      ),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}
