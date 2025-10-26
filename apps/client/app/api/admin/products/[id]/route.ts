import { NextResponse } from 'next/server';
import { requireAdmin } from '@repo/shared-lib';
import { adminSupabase } from '@repo/database';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    await requireAdmin(token);

    const id = params.id;
    const { error } = await (adminSupabase.from('products') as any).update({ is_active: false, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    await requireAdmin(token);

    const id = params.id;
    const { data, error } = await adminSupabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (err: any) {
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    await requireAdmin(token);

    const id = params.id;
    const body = await request.json();
    const updated = await (adminSupabase.from('products') as any).update({ ...body, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (updated.error) throw updated.error;
    return NextResponse.json({ ok: true, product: updated.data });
  } catch (err: any) {
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    return NextResponse.json({ error: err.message || 'unauthorized' }, { status: 401 });
  }
}
