// The full and correct code for: vakay-trip-planner\src\app\page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/types/database.types';
import LoginForm from './_components/LoginForm';

export default async function LoginPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is already logged in, redirect them to the dashboard
  if (session) {
    redirect('/dashboard');
  }

  // If not logged in, show the login form component
  return <LoginForm />;
}