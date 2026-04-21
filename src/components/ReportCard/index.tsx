import Link from 'next/link';
import type { Report } from '@/types/report';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import styles from './ReportCard.module.scss';

interface Props {
  report: Report;
}

const STATUS_CLASS: Record<string, string> = {
  published: 'badge-published',
  draft: 'badge-draft',
  archived: 'badge-archived',
};

export default function ReportCard({ report }: Props) {
  const date = new Date(report.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/reports/${report.id}`} className={styles.link}>
      <Card className={styles.card}>
        <CardHeader className={styles.header}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{report.title}</h2>
            <Badge variant="outline" className={STATUS_CLASS[report.status]}>
              {report.status}
            </Badge>
          </div>
          <div className={styles.meta}>
            <span>{report.author}</span>
            <span>·</span>
            <span>{report.category}</span>
            <span>·</span>
            <span>{date}</span>
          </div>
        </CardHeader>

        <CardContent>
          <p className={styles.excerpt}>{report.excerpt}</p>
        </CardContent>

        <div className={styles.footer}>
          {report.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className={styles.tag}>
              {tag}
            </Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
