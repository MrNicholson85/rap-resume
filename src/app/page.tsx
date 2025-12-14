'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import ArtistCard from '@/components/ArtistCard';
import AlbumCard from '@/components/AlbumCard';
import { searchArtists, getArtistAlbums, Artist, Album } from '@/lib/audiodb';

export default function Home() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSelectedArtist(null);
    setAlbums([]);
    try {
      const results = await searchArtists(query);
      setArtists(results);
    } catch (error) {
      console.error('Error searching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArtistClick = async (artist: Artist) => {
    setSelectedArtist(artist);
    setLoading(true);
    try {
      console.log('Fetching albums for artist:', artist.name, 'ID:', artist.id);
      const artistAlbums = await getArtistAlbums(artist.id);
      console.log('Albums received:', artistAlbums.length);
      setAlbums(artistAlbums);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlbumClick = (album: Album) => {
    // Store album info in sessionStorage for the album page
    sessionStorage.setItem(`album-${album.id}`, JSON.stringify(album));
    router.push(`/album/${album.id}`);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🎤 Rap Resume
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Professional artist discographies and career timelines
            </p>
            <div className="flex justify-center">
              <div className="w-full max-w-2xl mx-auto">
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg"></div>
                  <div className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                    Search
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎤 Rap Resume
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Professional artist discographies and career timelines
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading && (
          <div className="text-center text-gray-700 text-xl">Loading...</div>
        )}

        {selectedArtist && (
          <div className="mb-12">
            <button
              onClick={() => {
                setSelectedArtist(null);
                setAlbums([]);
              }}
              className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              ← Back to Search Results
            </button>
            
            {/* Resume Document */}
            <div className="bg-white shadow-lg max-w-4xl mx-auto">
              {/* Header Section */}
              <div className="border-b-4 border-blue-600 p-8">
                <div className="flex items-start gap-6">
                  {selectedArtist.images && selectedArtist.images.length > 0 ? (
                    <img
                      src={selectedArtist.images[0].url}
                      alt={selectedArtist.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-blue-600 flex items-center justify-center text-5xl">
                      🎤
                    </div>
                  )}
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {selectedArtist.name}
                    </h1>
                    <p className="text-xl text-blue-600 mb-3">
                      {selectedArtist.genres?.[0] || selectedArtist.type || 'Artist'}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {selectedArtist.popularity && (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">⭐</span> Popularity: {selectedArtist.popularity}/100
                        </div>
                      )}
                      {selectedArtist.followers?.total && (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">👥</span> {selectedArtist.followers.total.toLocaleString()} followers
                        </div>
                      )}
                      {selectedArtist.type && (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">🎵</span> {selectedArtist.type}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="p-8 border-b bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600"></span>
                  Core Competencies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {selectedArtist.genres?.slice(0, 8).map((genre) => (
                    <span key={`genre-${genre}`} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {genre}
                    </span>
                  ))}
                  {selectedArtist.type && (
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {selectedArtist.type}
                    </span>
                  )}
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Recording Artist
                  </span>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Music Production
                  </span>
                </div>
              </div>

              {/* Professional Experience (Albums) */}
              {albums.length > 0 && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-600"></span>
                    Discography
                  </h2>
                  <div className="space-y-6">
                    {albums
                      .sort((a, b) => (b.year || '0').localeCompare(a.year || '0'))
                      .map((album) => (
                      <div 
                        key={album.id} 
                        className="flex gap-4 pb-6 border-b last:border-b-0 hover:bg-gray-50 -mx-4 px-4 py-2 rounded cursor-pointer transition-colors"
                        onClick={() => handleAlbumClick(album)}
                      >
                        {/* Timeline dot */}
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                          <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
                        </div>
                        
                        {/* Album Thumbnail */}
                        {album.coverArtUrl ? (
                          <img
                            src={album.coverArtUrl}
                            alt={album.title}
                            className="w-20 h-20 rounded object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded bg-gray-200 flex items-center justify-center text-3xl shadow-md">
                            💿
                          </div>
                        )}
                        
                        {/* Album Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                {album.title}
                              </h3>
                              {album['label-info']?.[0]?.label?.name && (
                                <p className="text-blue-600 font-medium">
                                  {album['label-info'][0].label.name}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-gray-600 font-semibold">
                                {album.year || 'TBA'}
                              </p>
                              {album['primary-type'] && (
                                <p className="text-sm text-gray-500">
                                  {album['primary-type']}
                                </p>
                              )}
                            </div>
                          </div>
                          {album.disambiguation && (
                            <p className="text-gray-700 text-sm leading-relaxed mt-2 italic">
                              {album.disambiguation}
                            </p>
                          )}
                          {album.media?.[0] && (
                            <p className="text-gray-600 text-sm mt-2">
                              <span className="font-semibold">Tracks:</span> {album.media[0]['track-count'] || 'N/A'}
                              {album.media[0].format && ` • ${album.media[0].format}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedArtist && artists.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  onClick={() => handleArtistClick(artist)}
                />
              ))}
            </div>
          </div>
        )}

        {!selectedArtist && !loading && artists.length === 0 && (
          <div className="text-center text-gray-600 mt-12">
            <p className="text-xl">Search for your favorite rap artists to get started!</p>
            <p className="mt-4">Try searching for: Eminem, Kendrick Lamar, J. Cole, or Drake</p>
          </div>
        )}
      </main>
    </div>
  );
}
