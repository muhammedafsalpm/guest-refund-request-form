import { Nunito_Sans } from 'next/font/google';
import './globals.css';

const nunito = Nunito_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
  adjustFontFallback: false,
});

export const metadata = {
  title: 'Guest Refund Request | Deluxe Stays',
  description: 'Submit a refund request for your booking with Deluxe Stays. We value your satisfaction and will review your request promptly.',
  keywords: 'refund, booking, guest, request, deluxe stays',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${nunito.variable}`}>
      <body className={nunito.className}>
        {children}
      </body>
    </html>
  );
}
