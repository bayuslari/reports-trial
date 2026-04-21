import { NextRequest, NextResponse } from 'next/server';
import type { Report, AiSummaryResponse } from '@/types/report';
import reportsData from '@/data/reports.json';

const reports = reportsData as Report[];

// Mock AI summaries keyed by report id
const AI_SUMMARIES: Record<string, string> = {
  '1': 'Q1 2025 was a breakout quarter for the sales organization, with revenue exceeding targets by 12% and the APAC region emerging as the primary growth engine. The pipeline entering Q2 is at a record high, signaling strong momentum. Key recommendations center on scaling enterprise outreach and expanding regional SDR capacity to sustain trajectory.',
  '2': 'The March database incident exposed a gap between connection pool capacity and peak batch workload demand. The 47-minute degradation impacted roughly 12,000 users but was contained effectively. Remediation is well-structured, though long-term resilience requires investment in automated capacity management and proactive chaos testing.',
  '3': 'User research surfaces a clear onboarding bottleneck: the integration setup step lacks guidance and the checklist format creates unnecessary friction. A guided wizard and deferred email verification are high-confidence levers to meaningfully improve early activation rates. These changes are low-effort relative to their projected 22% activation uplift.',
  '4': 'H2 2024 attribution data validates the value of paid search and content marketing while exposing underperformance in display. LinkedIn\'s outsized contribution to enterprise pipeline is a key insight that justifies budget reallocation. The proposed shifts are data-driven and conservative, with strong ROI justification.',
  '5': 'The 2024 security audit reflects a maturing security posture — all high-severity findings were addressed within 72 hours, and SOC 2 Type II readiness is solid at 84%. The remaining gaps are manageable with targeted investment in automation and training. Sustained focus on secrets management and SIEM alerting is the critical path to certification.',
  '6': 'The redesigned health score model represents a significant improvement in early churn detection, with 79% precision at a 60-day horizon. The expanded signal set gives CSMs more actionable intelligence. Integrating NPS trends and payment patterns in the next iteration will further close the gap between leading indicators and actual churn events.',
  '7': 'Engineering hiring is progressing well across most roles, with referrals proving to be the most efficient sourcing channel. The Staff Platform Engineer role requires targeted intervention — a specialized recruiting partnership is the right move given the thin candidate pool. Compensation refreshes appear to have improved offer acceptance rates.',
  '8': 'Q2 roadmap prioritization reflects strong cross-functional alignment, with enterprise permissions and SSO rightly taking top priority given the direct revenue impact. Reporting v2 and mobile improvements address known satisfaction gaps. Deferring the AI suggestions feature is a prudent cost decision, though competitive pressure may require revisiting the timeline.',
  '9': 'The FY2025 financial model presents a credible base case with 38% growth. The 22-month cash runway provides strategic optionality, though burn rate management will be important as headcount scales. The identified risks — SMB pricing sensitivity and NRR compression — warrant close monitoring and early mitigation planning.',
  '10': 'The competitive landscape is shifting rapidly, with AI features, pricing aggression, and M&A all reshaping buyer dynamics simultaneously. A 54% win rate is respectable but the 41% rate against Competitor A in mid-market is a strategic vulnerability. A dedicated competitive intelligence function would provide asymmetric ROI given the complexity of the current environment.',
};

function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const report = reports.find((r) => r.id === id);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // Simulate occasional AI failure (10% chance) for demo purposes
  if (Math.random() < 0.1) {
    await simulateLatency();
    return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 503 });
  }

  await simulateLatency();

  const response: AiSummaryResponse = {
    summary: AI_SUMMARIES[id] ?? `This report by ${report.author} covers ${report.category} insights. Key findings indicate meaningful progress across monitored metrics with notable implications for strategic decision-making.`,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
