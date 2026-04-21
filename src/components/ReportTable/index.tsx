'use client';

import { useRouter } from 'next/navigation';
import type { Report, SortField, SortOrder } from '@/types/report';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import styles from './ReportTable.module.scss';

interface Props {
  reports: Report[];
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

const COLUMNS: { label: string; field: SortField }[] = [
  { label: 'Title', field: 'title' },
  { label: 'Author', field: 'author' },
  { label: 'Category', field: 'category' },
  { label: 'Date', field: 'createdAt' },
];

const STATUS_CLASS: Record<string, string> = {
  published: 'badge-published',
  draft: 'badge-draft',
  archived: 'badge-archived',
};

export default function ReportTable({ reports, sortBy, sortOrder, onSort }: Props) {
  const router = useRouter();

  function getSortIcon(field: SortField) {
    if (sortBy !== field) return <span className={styles.sortIcon}>↕</span>;
    return (
      <span className={`${styles.sortIcon} ${styles.active}`}>
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map(({ label, field }) => (
              <TableHead
                key={field}
                className={styles.sortableHead}
                onClick={() => onSort(field)}
              >
                {label} {getSortIcon(field)}
              </TableHead>
            ))}
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className={styles.empty}>
                No reports found.
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => {
              const date = new Date(report.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              return (
                <TableRow
                  key={report.id}
                  className={styles.clickableRow}
                  onClick={() => router.push(`/reports/${report.id}`)}
                >
                  <TableCell className={styles.titleCell}>{report.title}</TableCell>
                  <TableCell>{report.author}</TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_CLASS[report.status]}>
                      {report.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
