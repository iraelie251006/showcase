import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Elie',
  robots: { index: false, follow: false },
};
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
