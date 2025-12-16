// Spotify API utilities
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com/api/token';

// Token management
let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getSpotifyToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  // Get credentials from environment variables
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured. Please set NEXT_PUBLIC_SPOTIFY_CLIENT_ID and NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET in .env.local');
  }

  // Request new token using Client Credentials flow
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
  tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min before expiry

  if (!accessToken) {
    throw new Error('Failed to retrieve access token');
  }

  return accessToken;
}

async function spotifyFetch(url: string): Promise<Response> {
  const token = await getSpotifyToken();
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
}

// Spotify Interfaces
export interface Artist {
  id: string;
  name: string;
  type?: string;
  genres?: string[];
  popularity?: number;
  images?: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls?: {
    spotify?: string;
  };
  followers?: {
    total: number;
  };
}

export interface Album {
  id: string;
  title: string;
  name?: string; // Spotify uses 'name' instead of 'title'
  album_type?: string; // album, single, compilation
  release_date?: string;
  total_tracks?: number;
  disambiguation?: string; // Additional info to distinguish similar albums
  media?: Array<{
    'track-count'?: number;
    format?: string;
  }>;
  images?: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  artists?: Array<{
    id: string;
    name: string;
    external_urls?: {
      spotify?: string;
    };
  }>;
  external_urls?: {
    spotify?: string;
  };
  year?: string;
  coverArtUrl?: string;
  streamingLinks?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    deezer?: string;
  };
}

export interface Track {
  id: string;
  name?: string;
  title?: string; // For compatibility
  track_number?: number;
  duration_ms?: number;
  explicit?: boolean;
  preview_url?: string;
  external_urls?: {
    spotify?: string;
  };
  artists?: Array<{
    id: string;
    name: string;
  }>;
  position?: number;
  length?: number; // For compatibility with old code (in milliseconds)
}

// Helper function to generate streaming search URLs
function generateStreamingLinks(artistName: string, albumName: string): Album['streamingLinks'] {
  const encodedArtist = encodeURIComponent(artistName);
  const encodedAlbum = encodeURIComponent(albumName);
  const query = encodeURIComponent(`${artistName} ${albumName}`);
  
  return {
    appleMusic: `https://music.apple.com/us/search?term=${query}`,
    youtube: `https://www.youtube.com/results?search_query=${query}`,
    deezer: `https://www.deezer.com/search/${query}`
  };
}

export async function searchArtists(artistName: string): Promise<Artist[]> {
  const response = await spotifyFetch(
    `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(artistName)}&type=artist&limit=10`
  );
  const data = await response.json();
  
  return data.artists?.items?.map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    type: artist.type,
    genres: artist.genres,
    popularity: artist.popularity,
    images: artist.images,
    external_urls: artist.external_urls,
    followers: artist.followers
  })) || [];
}

export async function getArtistDetails(artistId: string): Promise<Artist | null> {
  const response = await spotifyFetch(
    `${SPOTIFY_API_URL}/artists/${artistId}`
  );
  const data = await response.json();
  
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    genres: data.genres,
    popularity: data.popularity,
    images: data.images,
    external_urls: data.external_urls,
    followers: data.followers
  };
}

export async function getArtistAlbums(artistId: string): Promise<Album[]> {
  try {
    // Get all albums (excluding singles and compilations for cleaner results)
    const response = await spotifyFetch(
      `${SPOTIFY_API_URL}/artists/${artistId}/albums?include_groups=album&limit=50&market=US`
    );
    const data = await response.json();
    
    console.log('Spotify Albums Response:', data);
    console.log('Number of albums found:', data.items?.length || 0);
    
    const albums: Album[] = data.items?.map((album: any) => ({
      id: album.id,
      title: album.name,
      name: album.name,
      album_type: album.album_type,
      release_date: album.release_date,
      total_tracks: album.total_tracks,
      images: album.images,
      artists: album.artists,
      external_urls: album.external_urls,
      year: album.release_date?.split('-')[0],
      coverArtUrl: album.images?.[0]?.url,
      streamingLinks: {
        spotify: album.external_urls?.spotify,
        ...generateStreamingLinks(album.artists?.[0]?.name || '', album.name)
      }
    })).filter((album: Album) => {
      // Filter out albums without a valid release date
      return album.release_date && 
             album.release_date.trim() !== '' &&
             album.year && 
             !isNaN(parseInt(album.year));
    }) || [];
    
    return albums;
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
}

export async function getAlbumTracks(albumId: string): Promise<Track[]> {
  const response = await spotifyFetch(
    `${SPOTIFY_API_URL}/albums/${albumId}/tracks`
  );
  const data = await response.json();
  
  return data.items?.map((track: any, index: number) => ({
    id: track.id,
    name: track.name,
    title: track.name, // For compatibility
    track_number: track.track_number,
    duration_ms: track.duration_ms,
    length: track.duration_ms, // For compatibility
    explicit: track.explicit,
    preview_url: track.preview_url,
    external_urls: track.external_urls,
    artists: track.artists,
    position: index + 1
  })) || [];
}

export async function getAlbumDetails(albumId: string): Promise<Album | null> {
  const response = await spotifyFetch(
    `${SPOTIFY_API_URL}/albums/${albumId}`
  );
  const data = await response.json();
  
  const artistName = data.artists?.[0]?.name || '';
  const albumName = data.name;
  
  return {
    id: data.id,
    title: data.name,
    name: data.name,
    album_type: data.album_type,
    release_date: data.release_date,
    total_tracks: data.total_tracks,
    images: data.images,
    artists: data.artists,
    external_urls: data.external_urls,
    year: data.release_date?.split('-')[0],
    coverArtUrl: data.images?.[0]?.url,
    streamingLinks: {
      spotify: data.external_urls?.spotify,
      ...generateStreamingLinks(artistName, albumName)
    }
  };
}
