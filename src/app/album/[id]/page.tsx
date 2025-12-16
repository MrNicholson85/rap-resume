'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { getAlbumTracks, getAlbumDetails, Album, Track } from '@/lib/audiodb';

export default function AlbumPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumInfo, setAlbumInfo] = useState<Partial<Album> | null>(null);

  useEffect(() => {
    // Get album info from sessionStorage if available
    const storedAlbum = sessionStorage.getItem(`album-${albumId}`);
    if (storedAlbum) {
      setAlbumInfo(JSON.parse(storedAlbum));
    }

    // Fetch full album details including streaming links
    const fetchAlbumData = async () => {
      try {
        const [albumTracks, fullAlbumDetails] = await Promise.all([
          getAlbumTracks(albumId),
          getAlbumDetails(albumId)
        ]);
        
        setTracks(albumTracks);
        
        // Merge with stored album info
        if (fullAlbumDetails) {
          setAlbumInfo(prev => ({ ...prev, ...fullAlbumDetails }));
        }
      } catch (error) {
        console.error('Error fetching album data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [albumId]);

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1F1F1F] transition-colors">
      <ThemeToggle />
      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-[#FF4500] hover:bg-[#ff7b3a] dark:bg-[#ff7b3a] dark:hover:bg-[#FFD700] text-white rounded transition-colors"
        >
          ← Back
        </button>

        <div className="bg-white dark:bg-[#2e2e2e] shadow-lg max-w-4xl mx-auto">
          {/* Album Header */}
          <div className="p-8 border-b-4 border-[#FF4500] dark:border-[#FFD700]">
            <div className="flex items-start gap-6">
              {/* Album Cover */}
              <div className="flex-shrink-0">
                {albumInfo?.coverArtUrl ? (
                  <img
                    src={albumInfo.coverArtUrl}
                    alt={albumInfo.title || 'Album cover'}
                    className="w-64 h-64 rounded shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-64 h-64 rounded bg-gray-200 flex items-center justify-center text-6xl shadow-lg">
                    💿
                  </div>
                )}
              </div>

              {/* Album Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-[#1F1F1F] dark:text-white mb-2">
                  {albumInfo?.title || albumInfo?.name || 'Loading...'}
                </h1>
                {albumInfo?.year && (
                  <p className="text-xl text-[#FF4500] dark:text-[#FFD700] mb-3">
                    {albumInfo.year}
                  </p>
                )}
                {albumInfo?.artists && albumInfo.artists.length > 0 && (
                  <p className="text-[#464646] dark:text-[#e0e0e0] text-lg mb-3">
                    <span className="font-semibold">Artist:</span> {albumInfo.artists.map(a => a.name).join(', ')}
                  </p>
                )}
                {albumInfo?.album_type && (
                  <p className="text-[#464646] dark:text-[#e0e0e0]">
                    <span className="font-semibold">Type:</span> {albumInfo.album_type}
                  </p>
                )}
                {albumInfo?.total_tracks && (
                  <p className="text-[#464646] dark:text-[#e0e0e0]">
                    <span className="font-semibold">Tracks:</span> {albumInfo.total_tracks}
                  </p>
                )}
                
                {/* Streaming Links */}
                {albumInfo?.streamingLinks && Object.keys(albumInfo.streamingLinks).length > 0 && (
                  <div className="mt-4">
                    <p className="text-[#464646] dark:text-[#e0e0e0] font-semibold mb-2">Listen on:</p>
                    <div className="flex flex-wrap gap-2">
                      {albumInfo.streamingLinks.spotify && (
                        <a
                          href={albumInfo.streamingLinks.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          🎵 Spotify
                        </a>
                      )}
                      {albumInfo.streamingLinks.appleMusic && (
                        <a
                          href={albumInfo.streamingLinks.appleMusic}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          🎵 Apple Music
                        </a>
                      )}
                      {albumInfo.streamingLinks.youtube && (
                        <a
                          href={albumInfo.streamingLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          ▶️ YouTube
                        </a>
                      )}
                      {albumInfo.streamingLinks.deezer && (
                        <a
                          href={albumInfo.streamingLinks.deezer}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          🎵 Deezer
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Track List */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#1F1F1F] dark:text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#FF4500] dark:bg-[#FFD700]"></span>
              Track Listing
            </h2>

            {loading ? (
              <div className="text-center text-[#464646] dark:text-[#e0e0e0] py-8">
                Loading tracks...
              </div>
            ) : tracks.length > 0 ? (
              <div className="space-y-2">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-4 hover:bg-[#e0e0e0]/30 dark:hover:bg-[#1F1F1F] rounded transition-colors border-b border-[#e0e0e0] dark:border-[#464646] last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[#464646] dark:text-[#e0e0e0] font-semibold w-8 text-right">
                        {track.track_number || track.position || '—'}
                      </span>
                      <div>
                        <h3 className="font-medium text-[#1F1F1F] dark:text-white">
                          {track.name || track.title}
                        </h3>
                        {track.artists && track.artists.length > 0 && (
                          <p className="text-sm text-[#464646] dark:text-[#e0e0e0]">
                            {track.artists.map(a => a.name).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-[#464646] dark:text-[#e0e0e0] text-sm">
                      {formatDuration(track.length || track.duration_ms)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-[#464646] dark:text-[#e0e0e0] py-8">
                No track information available
              </div>
            )}

            {tracks.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[#e0e0e0] dark:border-[#464646]">
                <p className="text-[#464646] dark:text-[#e0e0e0]">
                  <span className="font-semibold">Total Tracks:</span> {tracks.length}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
