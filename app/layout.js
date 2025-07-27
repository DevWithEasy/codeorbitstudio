import { GeistSans, GeistMono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'CodeOrbitStudio App Development Team Bangladesh',
  description: 'CodeOrbitStudio App Development Team Bangladesh',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={``}>
      <body className="font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}