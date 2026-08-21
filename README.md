# Safarnama - Industrial Visit (IV) 2026 App

Safarnama is a comprehensive, offline-capable Progressive Web Application (PWA) designed to manage, coordinate, and track an entire college Industrial Visit (IV) trip across North India. It serves as a digital scrapbook and a functional companion for 148+ students and faculty.

## Key Features
*   **Offline-First Architecture**: View your trip itinerary, ticket details, hotel information, and documents even when on a train with zero cellular coverage.
*   **Live Location Sharing**: Students can broadcast their live GPS location to the group for 15 min, 30 min, or 1 hour. It automatically expires and uses highly accurate `watchPosition` tracking.
*   **Dynamic Trip Board**: The home dashboard features a progress bar tracking the 16-day journey, quick access to tickets, and important announcements from coordinators.
*   **Admin Dashboard**: Manage students, send instant push/feed announcements, and monitor live location tracking of all group members in one place.
*   **Scrapbook UI Aesthetics**: The entire application is styled like a vintage travel scrapbook with paper textures, washi tape, polaroids, and handwritten fonts.

## Tech Stack
*   **Frontend**: Next.js 14, React, Lucide Icons
*   **Styling**: Pure CSS Modules with a custom Neo-Scrapbook design system
*   **Backend & Data**: Firebase Firestore (for live locations & documents)
*   **Mapping**: React-Leaflet with OpenStreetMap tiles

## Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/ras-al/safarnama.git
    cd safarnama
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env.local` file in the root directory and add your Firebase credentials:
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    ```

4.  **Seed the Database**
    To upload the student list, itinerary, and basic config to your Firestore database, run:
    ```bash
    node scripts/seed.mjs
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` to view the application.

## Usage for Students
1.  **Add to Home Screen**: When opening the app in Safari (iOS) or Chrome (Android), tap "Share" or the menu icon and select "Add to Home Screen". The app will now work offline like a native app.
2.  **Location Sharing**: If you get separated from the group, go to the Home screen, select your name from the dropdown, choose a duration, and hit Share. Coordinators will instantly see your dot on the map.

## Security Notice
The `/admin` routes are currently unprotected in this repository for development purposes. Before deploying to production, ensure you implement Firebase Authentication logic in `layout.js` or `middleware.js` to restrict access to authorized faculty/coordinators only.
