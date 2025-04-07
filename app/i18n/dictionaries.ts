export const dictionaries = {
  en: {
    title: 'Typing Game | Test Your Programming Knowledge',
    description:
      'A fun typing game to test your speed with programming-related terms. Challenge yourself and compete on the global leaderboard!',
    keywords: 'typing game, programming, coding, speed typing, tech terms, React, Next.js, Hono',
  },
  ja: {
    title: 'タイピングゲーム | プログラミング知識をテスト',
    description:
      'プログラミング関連の用語であなたのタイピングスピードをテストする楽しいゲーム。自分に挑戦して、グローバルリーダーボードで競争しましょう！',
    keywords:
      'タイピングゲーム, プログラミング, コーディング, スピードタイピング, 技術用語, React, Next.js, Hono',
  },
  es: {
    title: 'Juego de Mecanografía | Pon a Prueba tus Conocimientos de Programación',
    description:
      '¡Un divertido juego de mecanografía para probar tu velocidad con términos relacionados con la programación. Desafíate a ti mismo y compite en la tabla de clasificación global!',
    keywords:
      'juego de mecanografía, programación, codificación, velocidad de escritura, términos técnicos, React, Next.js, Hono',
  },
  fr: {
    title: 'Jeu de Dactylographie | Testez vos Connaissances en Programmation',
    description:
      'Un jeu de dactylographie amusant pour tester votre vitesse avec des termes liés à la programmation. Défiez-vous et participez au classement mondial!',
    keywords:
      'jeu de dactylographie, programmation, codage, vitesse de frappe, termes techniques, React, Next.js, Hono',
  },
  de: {
    title: 'Tippspiel | Testen Sie Ihr Programmierwissen',
    description:
      'Ein unterhaltsames Tippspiel, um Ihre Geschwindigkeit mit programmierbezogenen Begriffen zu testen. Fordern Sie sich selbst heraus und treten Sie in der globalen Bestenliste an!',
    keywords:
      'Tippspiel, Programmierung, Codierung, Tippgeschwindigkeit, technische Begriffe, React, Next.js, Hono',
  },
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof dictionaries.en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
