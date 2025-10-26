import { NextResponse } from 'next/server';
import { requireAdmin } from '@repo/shared-lib';
import { adminSupabase } from '@repo/database';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    await requireAdmin(token);

    const id = params.id;
    const { data: product, error: fetchError } = await adminSupabase.from('products').select('*').eq('id', id).single();
    if (fetchError) throw fetchError;
    if (!product) return NextResponse.json({ error: 'not_found' }, { status: 404 });

    const copy: any = {
      ...(product as any),
      id: undefined,
      name: `${(product as any).name} (Copy)`,
      slug: `${(product as any).slug}-copy-${Date.now()}`,
      created_at: undefined,
      updated_at: undefined,
    };

    const { data: newProduct, error: createError } = await (adminSupabase.from('products') as any).insert([copy]).select().single();
    if (createError) throw createError;

    return NextResponse.json({ ok: true, product: newProduct });
  } catch (err: any) {
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
}
