import { NextRequest, NextResponse } from 'next/server';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com/api/token';

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getSpotifyToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
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
    throw new Error('Failed to get Spotify access token');
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000;

  if (!accessToken) {
    throw new Error('Failed to retrieve access token');
  }

  return accessToken;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const artistId = searchParams.get('id');

    if (!artistId) {
      return NextResponse.json({ error: 'Artist ID required' }, { status: 400 });
    }

    const token = await getSpotifyToken();
    const response = await fetch(
      `${SPOTIFY_API_URL}/artists/${artistId}/albums?include_groups=album,single&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch albums');
    }

    const data = await response.json();
    
    const albums = data.items.map((album: any) => ({
      id: album.id,
      title: album.name,
      name: album.name,
      year: album.release_date?.split('-')[0],
      album_type: album.album_type,
      total_tracks: album.total_tracks,
      coverArtUrl: album.images?.[0]?.url,
      images: album.images,
      artists: album.artists,
      external_urls: album.external_urls
    }));

    return NextResponse.json(albums);
  } catch (error) {
    console.error('Error in artist-albums API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
