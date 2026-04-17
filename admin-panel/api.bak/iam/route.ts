import { NextResponse } from 'next/server';

const MOCK_USERS = [
  { id: 'u1', name: 'Admin User', email: 'admin@fleish.com', role: 'SUPER_ADMIN', status: 'ACTIVE', lastLogin: '2026-04-08 18:30' },
  { id: 'u2', name: 'Ops Manager', email: 'ops@fleish.com', role: 'MANAGER', status: 'ACTIVE', lastLogin: '2026-04-08 17:00' },
  { id: 'u3', name: 'Support Agent', email: 'support@fleish.com', role: 'SUPPORT', status: 'ACTIVE', lastLogin: '2026-04-08 16:45' },
];

export async function GET() {
  return NextResponse.json({ users: MOCK_USERS, total: MOCK_USERS.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newUser = { ...body, id: `u${Date.now()}`, status: 'ACTIVE', lastLogin: 'Never' };
  return NextResponse.json({ user: newUser, message: 'User created' }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json({ user: body, message: 'User updated' });
}
