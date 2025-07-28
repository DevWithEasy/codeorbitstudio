import { Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const hindSiliguri = Hind_Siliguri({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'CodeOrbitStudio App Development Team Bangladesh',
  description: 'CodeOrbitStudio App Development Team Bangladesh',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={hindSiliguri.className}>
      <body className="font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
