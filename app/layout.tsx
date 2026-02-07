import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Curator',
    description: 'AI-powered market analysis and trends',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
