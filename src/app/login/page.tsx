'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import styles from './login.module.scss';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/reports';

  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');

  function handleLogin() {
    document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    router.push(from);
  }

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <div className={styles.logo}><BarChart3 size={32} strokeWidth={1.75} /></div>
        <h1 className={styles.title}>Sign in to Reports</h1>
        <p className={styles.subtitle}>
          Select a role to continue. No password required in demo mode.
        </p>
      </CardHeader>

      <CardContent className={styles.cardContent}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="role">
            Role
          </label>
          <Select value={role} onValueChange={(v) => setRole(v as 'admin' | 'viewer')}>
            <SelectTrigger id="role" className={styles.selectFull}>
              <span style={{ textTransform: 'capitalize' }}>{role}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer — read-only access</SelectItem>
              <SelectItem value="admin">Admin — full access</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className={styles.hint}>
          This demo uses a browser cookie to simulate role-based access control. The middleware
          validates the <code>role</code> cookie on every request to <code>/reports</code>.
        </p>
      </CardContent>

      <CardFooter>
        <Button size="lg" className={styles.fullWidth} onClick={handleLogin}>
          Continue as {role.charAt(0).toUpperCase() + role.slice(1)} →
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
