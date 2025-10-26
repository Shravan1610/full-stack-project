import { NextResponse } from 'next/server';
import { requireAdmin } from '@repo/shared-lib';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    const { userId, role } = await requireAdmin(token);
    return NextResponse.json({ ok: true, userId, role });
  } catch (err: any) {
    if (err.message === 'Forbidden') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
}
