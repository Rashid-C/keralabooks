import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  title: {
    default: 'KeralaBooks',
    template: '%s · KeralaBooks',
  },
  description: 'Sales and purchase ledger for bakeries',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}