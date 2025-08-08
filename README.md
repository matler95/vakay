# Vakay Trip Planner

Vakay is a web-based, collaborative trip planning application designed to help users organize their travel itineraries with ease. Users can create detailed trip plans, manage daily schedules, pin locations, and invite friends to collaborate in real-time.

## ✨ Features

- **User Authentication**: Secure sign-up and login functionality powered by Supabase Auth.
- **Trip Creation**: Easily create new trips with destinations and dates.
- **Collaborative Planning**: Invite other users to join and edit a trip.
- **Role-Based Access Control**: Trips have `admin` and `traveler` roles to manage permissions.
- **Daily Itinerary**: Organize each day of the trip with notes and summaries.
- **Location Tagging**: Add and customize key locations for your trip, each with a unique color.
- **Real-time Updates**: Changes are reflected in real-time for all participants.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js](https://nextjs.org/) (v15 with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (for accessible, unstyled components)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Schema Validation**: [Zod](https://zod.dev/)

### Backend

- **Platform**: [Supabase](https://supabase.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth)
- **Security**: Row Level Security (RLS) policies

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/)
- A free [Supabase](https://supabase.com/) account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vakay-trip-planner-project # Or your project's root folder
```

### 2. Set Up Supabase

1.  Go to the [Supabase website](https://app.supabase.com/) and create a new project.
2.  Once your project is created, navigate to the **SQL Editor** from the left sidebar.
3.  Copy the entire content of the following files from the root of this repository and run them in the SQL editor in this specific order:
    1.  `schema.sql`
    2.  `profiles.sql`
    3.  `policies.sql`

    This will set up the necessary tables, user profile triggers, and security policies.

### 3. Configure Environment Variables

1.  In your Supabase project, go to **Project Settings** > **API**.
2.  Find your **Project URL** and **Project API keys** (`anon` `public` key).
3.  In the `vakay-trip-planner` directory of your local project, create a new file named `.env.local`.
4.  Add the following environment variables to your `.env.local` file, replacing the placeholder values with your actual Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

### 4. Install Dependencies and Run the App

1.  Navigate to the frontend application's directory:
    ```bash
    cd vakay-trip-planner
    ```
2.  Install the necessary dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## 🗃️ Database Schema

The database is composed of the following tables:

-   `trips`: Stores the core information for each trip (name, destination, dates).
-   `locations`: Stores locations associated with a trip, including a name, color, and description.
-   `itinerary_days`: Represents a single day in a trip's itinerary, with notes, a summary, and linked locations.
-   `trip_participants`: A junction table that links users to trips and defines their role (`admin` or `traveler`).
-   `profiles`: Stores public user data like full name and avatar URL, linked to the `auth.users` table.

## 📂 Project Structure

The repository is organized as follows:

-   `/`: The root directory contains the SQL files for setting up the Supabase database.
-   `/vakay-trip-planner`: This directory contains the Next.js frontend application.