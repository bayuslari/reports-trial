'use client';

import { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Report, ReportsListResponse, SortField, SortOrder } from '@/types/report';
import ReportCard from '@/components/ReportCard';
import ReportTable from '@/components/ReportTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import styles from './reports.module.scss';

type ViewMode = 'grid' | 'table';

const SORT_BY_LABELS: Record<SortField, string> = {
  createdAt: 'Date',
  title: 'Title',
  author: 'Author',
  category: 'Category',
};

const SORT_ORDER_LABELS: Record<SortOrder, string> = {
  asc: 'Ascending',
  desc: 'Descending',
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [view, setView] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        sortBy,
        sortOrder,
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/reports?${params}`);
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data: ReportsListResponse = await res.json();
      setReports(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  function handleSort(field: SortField) {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reports</h1>
        <p className={styles.subtitle}>
          {loading ? 'Loading…' : `${total} report${total !== 1 ? 's' : ''} found`}
        </p>
      </div>

      <div className={styles.controls}>
        <Input
          type="search"
          placeholder="Search by title, author, category, or tag…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <Select
          value={sortBy}
          onValueChange={(v) => { setSortBy(v as SortField); setPage(1); }}
        >
          <SelectTrigger className={styles.selectTrigger}>
            <span>Sort: {SORT_BY_LABELS[sortBy]}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Sort: Date</SelectItem>
            <SelectItem value="title">Sort: Title</SelectItem>
            <SelectItem value="author">Sort: Author</SelectItem>
            <SelectItem value="category">Sort: Category</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(v) => { setSortOrder(v as SortOrder); setPage(1); }}
        >
          <SelectTrigger className={styles.selectTrigger}>
            <span>{SORT_ORDER_LABELS[sortOrder]}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>

        <div className={styles.viewToggle}>
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
            title="Grid view"
          >
            <LayoutGrid size={15} />
          </Button>
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
            title="Table view"
          >
            <List size={15} />
          </Button>
        </div>
      </div>

      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <Skeleton className={styles.skeletonTitle} />
              <Skeleton className={styles.skeletonMeta} />
              <Skeleton className={styles.skeletonBody} />
              <Skeleton className={styles.skeletonBody2} />
            </div>
          ))}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          {view === 'grid' ? (
            <div className={styles.grid}>
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
              {reports.length === 0 && (
                <p className={styles.empty}>No reports match your search.</p>
              )}
            </div>
          ) : (
            <ReportTable
              reports={reports}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          )}

          <div className={styles.footer}>
            <span className={styles.footerCount}>
              {reports.length === 0
                ? 'No results'
                : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total}`}
            </span>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft size={14} /> Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
