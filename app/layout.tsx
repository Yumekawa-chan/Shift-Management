'use client';

import './globals.css';
import localFont from 'next/font/local';

const dotGothic16 = localFont({
  src: [
    {
      path: '../public/DotGothic16-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-dotgothic16',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${dotGothic16.className} overflow-x-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen`}
      >
        <div className="relative w-full h-full">
          <div className="absolute top-10 left-10 w-24 h-24 bg-pink-50 rounded-full opacity-40 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-blue-50 rounded-full opacity-40 blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-16 h-16 bg-purple-50 rounded-full opacity-40 blur-2xl animate-pulse"></div>
          {children}
        </div>
      </body>
    </html>
  );
}
