import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/adminAuth';
import { AdminDashboard } from './AdminDashboard';

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminPage() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  if (!verifyAdminToken(token)) {
    redirect('/admin/login');
  }

  return <AdminDashboard />;
}
