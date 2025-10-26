import { NextResponse } from 'next/server';
import { requireAdmin } from '@repo/shared-lib';
import { getAdminProductsServer, createProduct as createProductServer } from '@repo/shared-lib';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    await requireAdmin(token);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('pageSize') || '20');
    const search = url.searchParams.get('search') || undefined;
    const category = url.searchParams.get('category') || undefined;
    const status = (url.searchParams.get('status') as any) || undefined;

    const result = await getAdminProductsServer({ search, category, status }, page, pageSize);
    return NextResponse.json(result);
  } catch (err: any) {
    if (err.message === 'Forbidden') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    await requireAdmin(token);

    const body = await request.json();
    const product = await createProductServer(body);
    return NextResponse.json(product);
  } catch (err: any) {
    if (err.message === 'Forbidden') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: err.message || 'unauthorized' }, { status: 401 });
  }
}
