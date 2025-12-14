// MusicBrainz API utilities
const MUSICBRAINZ_API_URL = 'https://musicbrainz.org/ws/2';
const COVER_ART_API_URL = 'https://coverartarchive.org';
const USER_AGENT = 'RapResume/1.0.0 (https://github.com/yourusername/rap-resume)';

// Rate limiting: MusicBrainz allows 1 request/second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  return fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/json'
    }
  });
}

// MusicBrainz Interfaces
export interface Artist {
  id: string;
  name: string;
  type?: string;
  'type-id'?: string;
  disambiguation?: string;
  country?: string;
  'life-span'?: {
    begin?: string;
    end?: string;
    ended?: boolean;
  };
  area?: {
    id: string;
    name: string;
  };
  'begin-area'?: {
    id: string;
    name: string;
  };
  tags?: Array<{
    count: number;
    name: string;
  }>;
  genres?: Array<{
    count: number;
    name: string;
  }>;
  // Custom fields for display
  imageUrl?: string;
  bio?: string;
}

export interface Album {
  id: string;
  title: string;
  'first-release-date'?: string;
  'primary-type'?: string; // Album, EP, Single, etc.
  'primary-type-id'?: string;
  'secondary-types'?: string[];
  'secondary-type-ids'?: string[];
  disambiguation?: string;
  'artist-credit'?: Array<{
    name: string;
    artist: {
      id: string;
      name: string;
    };
  }>;
  'release-group'?: {
    id: string;
    'primary-type'?: string;
  };
  // Additional info from release lookup
  'label-info'?: Array<{
    'catalog-number'?: string;
    label?: {
      id: string;
      name: string;
    };
  }>;
  media?: Array<{
    format?: string;
    'track-count'?: number;
    tracks?: Track[];
  }>;
  relations?: Array<{
    type: string;
    url?: {
      resource: string;
      id: string;
    };
  }>;
  // Custom fields
  coverArtUrl?: string;
  year?: string;
  streamingLinks?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    deezer?: string;
    [key: string]: string | undefined;
  };
}

export interface Track {
  id: string;
  title: string;
  length?: number; // in milliseconds
  position?: number;
  number?: string;
  recording?: {
    id: string;
    title: string;
    length?: number;
  };
}

export interface Track {
  id: string;
  title: string;
  length?: number; // in milliseconds
  position?: number;
  number?: string;
  recording?: {
    id: string;
    title: string;
    length?: number;
  };
}

// Helper function to get cover art from Cover Art Archive
async function getCoverArt(releaseId: string): Promise<string | undefined> {
  try {
    const response = await fetch(`${COVER_ART_API_URL}/release/${releaseId}`);
    if (!response.ok) return undefined;
    
    const data = await response.json();
    // Get the front cover or first image
    const frontCover = data.images?.find((img: any) => img.front) || data.images?.[0];
    return frontCover?.thumbnails?.large || frontCover?.image;
  } catch (error) {
    return undefined;
  }
}

export async function searchArtists(artistName: string): Promise<Artist[]> {
  const response = await rateLimitedFetch(
    `${MUSICBRAINZ_API_URL}/artist?query=${encodeURIComponent(artistName)}&fmt=json&limit=10`
  );
  const data = await response.json();
  
  return data.artists?.map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    type: artist.type,
    disambiguation: artist.disambiguation,
    country: artist.country || artist.area?.name,
    'life-span': artist['life-span'],
    area: artist.area,
    tags: artist.tags,
    genres: artist.genres
  })) || [];
}

export async function getArtistDetails(artistId: string): Promise<Artist | null> {
  const response = await rateLimitedFetch(
    `${MUSICBRAINZ_API_URL}/artist/${artistId}?fmt=json&inc=tags+genres+url-rels`
  );
  const data = await response.json();
  
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    disambiguation: data.disambiguation,
    country: data.country || data.area?.name,
    'life-span': data['life-span'],
    area: data.area,
    'begin-area': data['begin-area'],
    tags: data.tags,
    genres: data.genres
  };
}

export async function getArtistAlbums(artistId: string): Promise<Album[]> {
  try {
    const response = await rateLimitedFetch(
      `${MUSICBRAINZ_API_URL}/release-group?artist=${artistId}&fmt=json&limit=100&type=album`
    );
    const data = await response.json();
    
    console.log('MusicBrainz Albums Response:', data);
    console.log('Number of releases found:', data['release-groups']?.length || 0);
    
    const albums: Album[] = data['release-groups']?.map((rg: any) => ({
      id: rg.id,
      title: rg.title,
      'first-release-date': rg['first-release-date'],
      'primary-type': rg['primary-type'],
      'secondary-types': rg['secondary-types'],
      disambiguation: rg.disambiguation,
      year: rg['first-release-date']?.split('-')[0]
    })).filter((album: Album) => {
      // Filter out albums without a valid release date (TBD, NA, or missing)
      const releaseDate = album['first-release-date'];
      return releaseDate && 
             releaseDate !== 'TBD' && 
             releaseDate !== 'NA' && 
             releaseDate.trim() !== '' &&
             album.year && 
             !isNaN(parseInt(album.year));
    }) || [];
    
    // Fetch cover art for the first 10 albums to speed up initial load
    const albumsToFetch = albums.slice(0, 10);
    
    for (const album of albumsToFetch) {
      try {
        const releaseResponse = await rateLimitedFetch(
          `${MUSICBRAINZ_API_URL}/release?release-group=${album.id}&fmt=json&limit=1`
        );
        const releaseData = await releaseResponse.json();
        const releaseId = releaseData.releases?.[0]?.id;
        
        if (releaseId) {
          const coverArt = await getCoverArt(releaseId);
          if (coverArt) {
            album.coverArtUrl = coverArt;
            console.log('Cover art found for:', album.title, coverArt);
          }
        }
      } catch (error) {
        console.log('Error fetching cover art for', album.title, error);
      }
    }
    
    return albums;
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
}

export async function getAlbumTracks(albumId: string): Promise<Track[]> {
  // Get the first release for this release-group
  const releaseResponse = await rateLimitedFetch(
    `${MUSICBRAINZ_API_URL}/release?release-group=${albumId}&fmt=json&limit=1&inc=recordings`
  );
  const releaseData = await releaseResponse.json();
  const releaseId = releaseData.releases?.[0]?.id;
  
  if (!releaseId) return [];
  
  // Get full release details with tracks
  const response = await rateLimitedFetch(
    `${MUSICBRAINZ_API_URL}/release/${releaseId}?fmt=json&inc=recordings`
  );
  const data = await response.json();
  
  const tracks: Track[] = [];
  data.media?.forEach((medium: any) => {
    medium.tracks?.forEach((track: any) => {
      tracks.push({
        id: track.id,
        title: track.title,
        length: track.length,
        position: track.position,
        number: track.number,
        recording: track.recording
      });
    });
  });
  
  return tracks;
}

export async function getAlbumDetails(albumId: string): Promise<Album | null> {
  // Get the first release for this release-group
  const releaseResponse = await rateLimitedFetch(
    `${MUSICBRAINZ_API_URL}/release?release-group=${albumId}&fmt=json&limit=1&inc=labels+recordings+url-rels+release-group-level-rels`
  );
  const releaseData = await releaseResponse.json();
  const release = releaseData.releases?.[0];
  
  if (!release) {
    console.log('No release found for release-group:', albumId);
    return null;
  }
  
  console.log('Full release data:', JSON.stringify(release, null, 2));
  console.log('Release relations:', release.relations);
  
  const coverArtUrl = await getCoverArt(release.id);
  
  // Parse streaming links from URL relationships
  const streamingLinks: Album['streamingLinks'] = {};
  
  // Check both release-level and release-group-level relations
  const allRelations = [
    ...(release.relations || []),
  ];
  
  console.log('All relations to check:', allRelations);
  
  if (allRelations.length > 0) {
    allRelations.forEach((rel: any) => {
      console.log('Checking relation:', {
        type: rel.type,
        'type-id': rel['type-id'],
        url: rel.url,
        targetType: rel['target-type']
      });
      
      // Check for URL relations
      if (rel.url?.resource) {
        const url = rel.url.resource;
        console.log('Found URL:', url);
        if (url.includes('spotify.com')) {
          streamingLinks.spotify = url;
        } else if (url.includes('music.apple.com') || url.includes('itunes.apple.com')) {
          streamingLinks.appleMusic = url;
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
          streamingLinks.youtube = url;
        } else if (url.includes('deezer.com')) {
          streamingLinks.deezer = url;
        }
      }
    });
  } else {
    console.log('No relations found in release');
  }
  
  console.log('Final parsed streaming links:', streamingLinks);
  
  return {
    id: release.id,
    title: release.title,
    'first-release-date': release.date,
    'label-info': release['label-info'],
    media: release.media,
    relations: release.relations,
    coverArtUrl,
    year: release.date?.split('-')[0],
    streamingLinks: Object.keys(streamingLinks).length > 0 ? streamingLinks : undefined
  };
}
