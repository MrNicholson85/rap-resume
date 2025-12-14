# Spotify API Setup Instructions

## Step 1: Create a Spotify Developer Account

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account (or create one if you don't have it)

## Step 2: Create a New App

1. Click "Create app" button
2. Fill in the app details:
   - **App name**: Rap Resume (or any name you like)
   - **App description**: Artist discography browser
   - **Redirect URIs**: http://localhost:3000 (not used for Client Credentials flow, but required)
   - **Which API/SDKs are you planning to use?**: Check "Web API"
3. Agree to the terms and click "Save"

## Step 3: Get Your Credentials

1. Once your app is created, you'll see your app's dashboard
2. Click "Settings" button
3. You'll see:
   - **Client ID**: Copy this value
   - **Client Secret**: Click "View client secret" and copy this value

## Step 4: Add Credentials to Your Project

1. Open the `.env.local` file in the project root
2. Replace the empty values with your credentials:
   ```
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
   NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```
3. Save the file

## Step 5: Restart the Development Server

```bash
npm run dev
```

The app will now authenticate with Spotify and fetch real data!

## Important Notes

- **Never commit** your `.env.local` file to git (it's already in `.gitignore`)
- The Client Credentials flow provides access to public data only
- Spotify API has rate limits - be mindful of excessive requests
- Your credentials are only used on your local machine

## Troubleshooting

If you get authentication errors:
1. Double-check that your credentials are correct (no extra spaces)
2. Make sure you saved the `.env.local` file
3. Restart the development server
4. Clear your browser cache and reload the page
