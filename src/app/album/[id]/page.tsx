'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAlbumTracks, Album, Track } from '@/lib/audiodb';

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

    // Fetch tracks
    const fetchTracks = async () => {
      try {
        const albumTracks = await getAlbumTracks(albumId);
        setTracks(albumTracks);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [albumId]);

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          ← Back
        </button>

        <div className="bg-white shadow-lg max-w-4xl mx-auto">
          {/* Album Header */}
          <div className="p-8 border-b-4 border-blue-600">
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
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {albumInfo?.title || 'Loading...'}
                </h1>
                {albumInfo?.year && (
                  <p className="text-xl text-blue-600 mb-3">
                    {albumInfo.year}
                  </p>
                )}
                {albumInfo?.disambiguation && (
                  <p className="text-gray-500 italic mb-3">
                    {albumInfo.disambiguation}
                  </p>
                )}
                {albumInfo?.['label-info']?.[0]?.label?.name && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Label:</span> {albumInfo['label-info'][0].label.name}
                  </p>
                )}
                {albumInfo?.['primary-type'] && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Type:</span> {albumInfo['primary-type']}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Track List */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600"></span>
              Track Listing
            </h2>

            {loading ? (
              <div className="text-center text-gray-600 py-8">
                Loading tracks...
              </div>
            ) : tracks.length > 0 ? (
              <div className="space-y-2">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded transition-colors border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 font-semibold w-8 text-right">
                        {track.position || track.number || '—'}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {track.title}
                        </h3>
                      </div>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {formatDuration(track.length || track.recording?.length)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No track information available
              </div>
            )}

            {tracks.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <p className="text-gray-600">
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
