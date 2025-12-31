import type { Metadata } from 'next';
import { Geist, Geist_Mono, Bebas_Neue, Oswald } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { Waves } from '@/components/ui/wave-background';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
});

const oswaldMono = Oswald({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-oswald',
});

export const metadata: Metadata = {
  title: 'Ryan Choukri | Développeur Fullstack',
  description: 'Portfolio de Ryan Choukri, développeur fullstack spécialisé en React',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${oswaldMono.variable} touch-none antialiased`}>
        <div>
          {/* Sidebar fixe à gauche */}
          <Sidebar>
            {/* Contenu principal */}
            <main className="flex-1 p-0">{children}</main>
          </Sidebar>
        </div>
        <Waves className="h-full w-full" />
      </body>
    </html>
  );
}
