"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function DebugAdminPage() {
  const { user, profile, loading, signOut } = useAuth();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Admin</h1>

      <div className="mb-4">
        <h2 className="font-semibold">Auth Loading</h2>
        <pre>{String(loading)}</pre>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">User (supabase.auth user)</h2>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{user ? JSON.stringify(user, null, 2) : 'null'}</pre>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Profile (profiles table)</h2>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{profile ? JSON.stringify(profile, null, 2) : 'null'}</pre>
      </div>

      <div className="flex gap-2">
        <Link href="/admin/products" className="px-4 py-2 bg-black text-white rounded">Go to /admin/products</Link>
        <button onClick={() => signOut()} className="px-4 py-2 border rounded">Sign out</button>
      </div>
    </div>
  );
}
