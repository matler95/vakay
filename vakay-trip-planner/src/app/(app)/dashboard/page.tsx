// src/app/(app)/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Trips</h2>
        <p className="text-gray-500">View your existing trips or create a new one to get started.</p>
      </div>
      
      {/* We will add a list of trips here later */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Create a New Trip</h3>
        <p className="text-gray-600">This is where the form to create a new trip will go.</p>
        {/* The trip creation form will be added in the next step! */}
      </div>
    </div>
  );
}