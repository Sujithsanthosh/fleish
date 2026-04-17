import { NextResponse } from 'next/server';

const MOCK_EMPLOYEES = [
  { id: 'e1', name: 'Ramesh Kumar', department: 'Operations', position: 'Delivery Manager', salary: 45000, status: 'ACTIVE', joinDate: '2025-06-15' },
  { id: 'e2', name: 'Priya Singh', department: 'Support', position: 'Support Lead', salary: 38000, status: 'ACTIVE', joinDate: '2025-08-01' },
  { id: 'e3', name: 'Sunil Mehta', department: 'Finance', position: 'Accountant', salary: 42000, status: 'ACTIVE', joinDate: '2025-09-10' },
];

export async function GET() {
  return NextResponse.json({ employees: MOCK_EMPLOYEES, total: MOCK_EMPLOYEES.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newEmp = { ...body, id: `e${Date.now()}`, status: 'ACTIVE' };
  return NextResponse.json({ employee: newEmp, message: 'Employee added' }, { status: 201 });
}
