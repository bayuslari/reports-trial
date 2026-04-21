export type ReportStatus = 'draft' | 'published' | 'archived';
export type SortField = 'title' | 'author' | 'createdAt' | 'category';
export type SortOrder = 'asc' | 'desc';

export interface Report {
  id: string;
  title: string;
  author: string;
  category: string;
  status: ReportStatus;
  createdAt: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export interface ReportsListResponse {
  data: Report[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AiSummaryResponse {
  summary: string;
  generatedAt: string;
}
