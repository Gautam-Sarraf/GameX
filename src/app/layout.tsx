import type { Metadata } from 'next';
import { Montserrat, Oswald, Poppins } from 'next/font/google';
import QueryProvider from '@/providers/QueryProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EsportBrawl - Premium Tournament Platform',
  description: 'Participate, compete, and organize gaming tournaments at FACEIT-grade visual quality.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.className} ${oswald.variable} ${poppins.variable} h-full antialiased dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col bg-[#030303] text-zinc-100 selection:bg-cyan-500 selection:text-black">
        <QueryProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Toaster position="bottom-right" theme="dark" richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
