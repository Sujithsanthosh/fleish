import { NextResponse } from 'next/server';

const MOCK_APPLICATIONS = [
  { id: 'a1', jobId: 'j1', candidate: 'Rajesh K.', status: 'UNDER_REVIEW', appliedDate: '2026-04-02' },
  { id: 'a2', jobId: 'j1', candidate: 'Amit S.', status: 'SHORTLISTED', appliedDate: '2026-04-03' },
  { id: 'a3', jobId: 'j2', candidate: 'Sita R.', status: 'INTERVIEW', appliedDate: '2026-04-06' },
];

export async function GET() {
  return NextResponse.json({ applications: MOCK_APPLICATIONS, total: MOCK_APPLICATIONS.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newApp = { ...body, id: `a${Date.now()}`, status: 'UNDER_REVIEW', appliedDate: new Date().toISOString().split('T')[0] };
  return NextResponse.json({ application: newApp, message: 'Application received' }, { status: 201 });
}
