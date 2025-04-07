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
    openGraph: {
      title: dict.title,
      description: dict.description,
      images: ['/monster1.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.title,
      description: dict.description,
      images: ['/monster1.jpg'],
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
