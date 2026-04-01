import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata = {
  title: 'Guest Refund Request | Deluxe Homes',
  description: 'Submit a refund request for your booking. We value your satisfaction and will review your request promptly.',
  keywords: 'refund, booking, guest, request, deluxe homes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
