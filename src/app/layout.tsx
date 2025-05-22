import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google'; // Changed to Google Fonts
import './globals.css';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ 
  variable: '--font-inter', // Updated variable name
  subsets: ['latin'],
});

const roboto_mono = Roboto_Mono({ 
  variable: '--font-roboto-mono', // Updated variable name
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VoteWise - Secure Elections & Anonymous Discussions',
  description: 'Participate in secure elections and engage in anonymous discussions on VoteWise.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto_mono.variable} antialiased`}>
        <MainAppLayout>{children}</MainAppLayout>
        <Toaster />
      </body>
    </html>
  );
}
