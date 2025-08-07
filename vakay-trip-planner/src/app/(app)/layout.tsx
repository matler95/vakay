// src/app/(app)/layout.tsx
// The session check has been REMOVED from here and moved to middleware.
import LogoutButton from './_components/LogoutButton';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
          <h1 className="text-xl font-bold text-indigo-600">VAKAY</h1>
          <LogoutButton />
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}