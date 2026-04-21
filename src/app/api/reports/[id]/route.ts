import { NextRequest, NextResponse } from 'next/server';
import type { Report } from '@/types/report';
import reportsData from '@/data/reports.json';

const reports = reportsData as Report[];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const report = reports.find((r) => r.id === id);

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json(report);
}
