// src/app/(app)/layout.tsx
import LogoutButton from './_components/LogoutButton';
import Link from 'next/link'; // Make sure Link is imported from 'next/link'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/dashboard" className="text-xl font-bold text-indigo-600">VAKAY</Link>
          {/* --- NEW: Add Profile link and Logout button wrapper --- */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard/profile" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Profile
            </Link>
            <LogoutButton />
          </div>
        </nav>
      </header>
      <main className="px-4 py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}