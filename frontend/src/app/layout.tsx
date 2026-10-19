import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { HavenAuthProvider } from '@/context/HavenAuthContext';

export const metadata: Metadata = {
  title: 'Sakhi | A Silent Shield, A Strong Voice',
  description:
    'Sakhi - Discreet safety platform combining image steganography, confidential legal rights counseling, and real-time first responder incident triage.',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <HavenAuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 flex flex-col">{children}</main>
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                className: '!bg-slate-900 !text-white !text-sm !shadow-md !rounded-md',
              }}
            />
          </HavenAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
