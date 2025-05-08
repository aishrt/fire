# Firebase Node.js Server

This is a Node.js application with Firebase integration.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

3. To get your Firebase configuration:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Go to Project Settings
   - Scroll down to the "Your apps" section
   - Click on the web app icon (</>)
   - Register your app and copy the configuration values

4. Run the server:
   ```bash
   node index.js
   ```

The server will start on port 3000 by default. You can access it at `http://localhost:3000`.

## Features

- Express.js server setup
- Firebase integration
- Environment variable configuration
- Basic API endpoint at root route 