'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { Report, AiSummaryResponse } from '@/types/report';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import styles from './report-detail.module.scss';

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [report, setReport] = useState<Report | null>(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [reportError, setReportError] = useState<string | null>(null);

  const [aiSummary, setAiSummary] = useState<AiSummaryResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      setReportLoading(true);
      setReportError(null);
      try {
        const res = await fetch(`/api/reports/${id}`);
        if (res.status === 404) throw new Error('not_found');
        if (!res.ok) throw new Error('Failed to load report');
        setReport(await res.json());
      } catch (err) {
        setReportError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setReportLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  async function fetchAiSummary() {
    setAiLoading(true);
    setAiError(null);
    setAiSummary(null);
    try {
      const res = await fetch(`/api/reports/${id}/summary`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'AI service unavailable');
      }
      setAiSummary(await res.json());
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setAiLoading(false);
    }
  }

  if (reportLoading) {
    return (
      <main className={styles.page}>
        <Skeleton className={styles.skeletonBack} />
        <div className={styles.skeletonHeader}>
          <Skeleton className={styles.skeletonBadge} />
          <Skeleton className={styles.skeletonTitle} />
          <Skeleton className={styles.skeletonMeta} />
        </div>
        <Separator className={styles.divider} />
        <Skeleton className={styles.skeletonBlock} />
      </main>
    );
  }

  if (reportError === 'not_found' || !report) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <h1>Report not found</h1>
          <p><Link href="/reports">← Back to reports</Link></p>
        </div>
      </main>
    );
  }

  if (reportError) {
    return (
      <main className={styles.page}>
        <Alert variant="destructive">
          <AlertDescription>{reportError}</AlertDescription>
        </Alert>
      </main>
    );
  }

  const STATUS_CLASS: Record<string, string> = {
    published: 'badge-published',
    draft: 'badge-draft',
    archived: 'badge-archived',
  };

  const date = new Date(report.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const aiTimestamp = aiSummary
    ? new Date(aiSummary.generatedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <main className={styles.page}>
      <Link href="/reports" className={styles.back}>
        <ArrowLeft size={14} /> All Reports
      </Link>

      <div className={styles.header}>
        <Badge variant="outline" className={STATUS_CLASS[report.status]}>
          {report.status}
        </Badge>
        <h1 className={styles.title}>{report.title}</h1>
        <div className={styles.meta}>
          <span>{report.author}</span>
          <span>·</span>
          <span>{report.category}</span>
          <span>·</span>
          <span>{date}</span>
        </div>
        <div className={styles.tags}>
          {report.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className={styles.tag}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Separator className={styles.divider} />

      {/* AI Summary */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>AI Summary</p>

        {!aiSummary && !aiLoading && !aiError && (
          <Button variant="outline" onClick={fetchAiSummary}>
            <Sparkles size={14} /> Generate AI Summary
          </Button>
        )}

        {aiLoading && (
          <div className={styles.aiLoading}>
            <div className={styles.spinner} />
            <span>Generating summary…</span>
          </div>
        )}

        {aiError && (
          <div className={styles.aiErrorWrapper}>
            <Alert variant="destructive">
              <AlertDescription>{aiError}</AlertDescription>
            </Alert>
            <Button variant="outline" size="sm" className={styles.retryBtn} onClick={fetchAiSummary}>
              Retry
            </Button>
          </div>
        )}

        {aiSummary && (
          <div className={styles.aiCard}>
            <div className={styles.aiHeader}>
              <Sparkles size={14} className={styles.aiIcon} />
              <span className={styles.aiLabel}>AI Summary</span>
              {aiTimestamp && (
                <span className={styles.aiTimestamp}>Generated at {aiTimestamp}</span>
              )}
            </div>
            <p className={styles.aiText}>{aiSummary.summary}</p>
          </div>
        )}
      </section>

      <Separator className={styles.divider} />

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Full Report</p>
        <p className={styles.content}>{report.content}</p>
      </section>
    </main>
  );
}
