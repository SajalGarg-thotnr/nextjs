import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Toast from '../components/Toast';

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: "Bajaj Auto - Customer Verification",
  description: "Customer verification and document upload portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className={inter.className}>
        <Toast />
        <div className="min-h-screen bg-gray-100">
          {/* Mobile-first container with max-width */}
          <div className="mx-auto max-w-md min-h-screen bg-white shadow-lg">
            {/* Top navigation bar */}
            
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
