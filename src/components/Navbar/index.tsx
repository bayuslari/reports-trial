'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, LogOut, ShieldCheck, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './Navbar.module.scss';

interface Props {
  role: string;
}

export default function Navbar({ role }: Props) {
  const router = useRouter();

  function handleLogout() {
    document.cookie = 'role=; path=/; max-age=0';
    router.push('/login');
  }

  const RoleIcon = role === 'admin' ? ShieldCheck : Eye;

  return (
    <nav className={styles.nav}>
      <Link href="/reports" className={styles.brand}>
        <BarChart3 size={20} strokeWidth={2} />
        Reports
      </Link>

      <div className={styles.right}>
        <span className={styles.roleBadge}>
          <span className={styles.dot} />
          <RoleIcon size={13} />
          {role}
        </span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={14} />
          Log out
        </Button>
      </div>
    </nav>
  );
}
