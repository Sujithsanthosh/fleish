import { NextResponse } from 'next/server';

const MOCK_JOBS = [
  { id: 'j1', title: 'Delivery Rider', department: 'Logistics', type: 'Full-time', applicants: 12, status: 'OPEN', posted: '2026-04-01' },
  { id: 'j2', title: 'Customer Support', department: 'Support', type: 'Full-time', applicants: 8, status: 'OPEN', posted: '2026-04-05' },
];

export async function GET() {
  return NextResponse.json({ jobs: MOCK_JOBS, total: MOCK_JOBS.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newJob = { ...body, id: `j${Date.now()}`, applicants: 0, status: 'OPEN', posted: new Date().toISOString().split('T')[0] };
  return NextResponse.json({ job: newJob, message: 'Job posted' }, { status: 201 });
}
