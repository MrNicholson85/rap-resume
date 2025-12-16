import { NextRequest, NextResponse } from 'next/server';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com/api/token';

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getSpotifyToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  console.log('Getting Spotify token...');
  console.log('Client ID present:', !!clientId);
  console.log('Client Secret present:', !!clientSecret);

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured. Please set environment variables in Vercel.');
  }

  const response = await fetch(SPOTIFY_ACCOUNTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Spotify token error:', response.status, errorText);
    throw new Error(`Failed to get Spotify access token: ${response.status}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000;

  if (!accessToken) {
    throw new Error('Failed to retrieve access token');
  }

  console.log('Successfully obtained Spotify token');
  return accessToken;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }

    console.log('Searching for artist:', query);
    
    const token = await getSpotifyToken();
    const response = await fetch(
      `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(query)}&type=artist&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spotify API error:', response.status, errorText);
      throw new Error(`Spotify API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('Found artists:', data.artists?.items?.length || 0);
    return NextResponse.json(data.artists.items);
  } catch (error) {
    console.error('Error in search-artists API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}
