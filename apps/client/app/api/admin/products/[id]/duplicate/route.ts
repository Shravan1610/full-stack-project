import { NextResponse } from 'next/server';
import { requireAdmin } from '@repo/shared-lib';
import { adminSupabase } from '@repo/database';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    await requireAdmin(token);

    const id = params.id;
    const { data: product, error: fetchError } = await adminSupabase.from('products').select('*').eq('id', id).maybeSingle();
    if (fetchError) throw fetchError;
    if (!product) return NextResponse.json({ error: 'not_found' }, { status: 404 });

    const copy = {
      ...product,
      id: undefined,
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy-${Date.now()}`,
      created_at: undefined,
      updated_at: undefined,
    } as any;

    const { data: newProduct, error: createError } = await adminSupabase.from('products').insert([copy]).select().single();
    if (createError) throw createError;

    return NextResponse.json({ ok: true, product: newProduct });
  } catch (err: any) {
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
}
