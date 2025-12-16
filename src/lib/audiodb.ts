// Client-side Spotify API utilities using Next.js API routes

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
  const response = await fetch(`/api/search-artists?q=${encodeURIComponent(artistName)}`);
  if (!response.ok) {
    throw new Error('Failed to search artists');
  }
  return response.json();
}

export async function getArtistAlbums(artistId: string): Promise<Album[]> {
  const response = await fetch(`/api/artist-albums?id=${encodeURIComponent(artistId)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch albums');
  }
  return response.json();
}

export async function getAlbumTracks(albumId: string): Promise<Track[]> {
  const response = await fetch(`/api/album-tracks?id=${encodeURIComponent(albumId)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tracks');
  }
  return response.json();
}

export async function getAlbumDetails(albumId: string): Promise<Album | null> {
  // Album details not needed as they're stored in sessionStorage
  return null;
}
