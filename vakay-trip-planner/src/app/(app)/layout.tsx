// src/app/(app)/layout.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/types/database.types';
import LogoutButton from './_components/LogoutButton';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there is no active session, redirect to the login page
  if (!session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 lg:px-8 flex justify-between items-center py-4">
          <h1 className="text-xl font-bold text-indigo-600">VAKAY</h1>
          <LogoutButton />
        </nav>
      </header>
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}