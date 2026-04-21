import { NextRequest, NextResponse } from 'next/server';
import type { Report, ReportsListResponse, SortField, SortOrder } from '@/types/report';
import reportsData from '@/data/reports.json';

const reports = reportsData as Report[];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const search = searchParams.get('search')?.toLowerCase() ?? '';
  const sortBy = (searchParams.get('sortBy') ?? 'createdAt') as SortField;
  const sortOrder = (searchParams.get('sortOrder') ?? 'desc') as SortOrder;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = Math.max(1, Math.min(50, parseInt(searchParams.get('pageSize') ?? '10', 10)));

  let filtered = reports;

  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(search) ||
        r.author.toLowerCase().includes(search) ||
        r.category.toLowerCase().includes(search) ||
        r.tags.some((t) => t.toLowerCase().includes(search)),
    );
  }

  const validSortFields: SortField[] = ['title', 'author', 'createdAt', 'category'];
  const field: SortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

  filtered = [...filtered].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const total = filtered.length;
  const data = filtered.slice((page - 1) * pageSize, page * pageSize);

  const response: ReportsListResponse = { data, total, page, pageSize };
  return NextResponse.json(response);
}
