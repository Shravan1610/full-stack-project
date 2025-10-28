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
  } catch (err: unknown) {
    const error = err as Error;
    
    // Handle specific error types
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    
    // Log unexpected errors server-side
    console.error('GET /api/admin/products error:', error);
    
    // Return generic 500 for all other errors
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
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
  } catch (err: unknown) {
    const error = err as Error;
    
    // Handle Forbidden errors
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'forbidden', message: error.message }, { status: 403 });
    }
    
    // Handle Unauthorized errors
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'unauthorized', message: error.message }, { status: 401 });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError' || error.message?.includes('validation') || error.message?.includes('invalid')) {
      return NextResponse.json({ error: 'validation_error', message: error.message }, { status: 400 });
    }
    
    // Log unexpected errors server-side
    console.error('POST /api/admin/products error:', error);
    
    // Return generic 500 for all other errors (database, unexpected errors)
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}
