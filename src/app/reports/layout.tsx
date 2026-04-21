import { cookies } from 'next/headers';
import Navbar from '@/components/Navbar';

export default async function ReportsLayout({ children }: { children: React.ReactNode }) {
  const role = (await cookies()).get('role')?.value ?? 'viewer';

  return (
    <>
      <Navbar role={role} />
      {children}
    </>
  );
}
