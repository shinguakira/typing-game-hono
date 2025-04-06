import { NextRequest, NextResponse } from 'next/server';
import { Locale, dictionaries } from './app/i18n/dictionaries';

const locales = Object.keys(dictionaries) as Locale[];

function getLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const parsedLocales = acceptLanguage.split(',').map(l => l.split(';')[0].trim());
    for (const locale of parsedLocales) {
      const shortLocale = locale.substring(0, 2) as Locale;
      if (locales.includes(shortLocale)) {
        return shortLocale;
      }
    }
  }

  return 'en';
}

export function middleware(request: NextRequest) {
  const locale = getLocale(request);
  
  const response = NextResponse.next();
  
  if (!request.cookies.has('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale);
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
