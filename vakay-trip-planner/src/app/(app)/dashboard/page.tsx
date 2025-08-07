// src/app/(app)/dashboard/page.tsx
import { CreateTripForm } from './_components/CreateTripForm';

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Trips</h2>
        <p className="text-gray-500">View your existing trips or create a new one to get started.</p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          {/* We will add a list of trips here later */}
          <div className="text-center text-gray-500 py-8">
             Your trips will appear here.
          </div>
        </div>

        <div className="order-1 md:order-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Create a New Trip</h3>
          <CreateTripForm />
        </div>
      </div>
    </div>
  );
}