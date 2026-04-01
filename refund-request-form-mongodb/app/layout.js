import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Guest Refund Request Form | Property Management',
  description: 'Submit a refund request for your booking. Fast and secure process.',
  keywords: 'refund, booking, guest, request, property management',
  authors: [{ name: 'Property Management Team' }],
  openGraph: {
    title: 'Guest Refund Request Form',
    description: 'Submit a refund request for your booking',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
