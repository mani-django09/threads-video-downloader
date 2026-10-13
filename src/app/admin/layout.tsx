import type { Metadata } from 'next';

// Applies to /admin and /admin/login so the login form is never indexed either.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
