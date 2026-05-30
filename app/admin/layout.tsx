import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - Transfer Hub',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
