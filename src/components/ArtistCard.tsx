'use client';

import Image from 'next/image';
import { Artist } from '@/lib/audiodb';

interface ArtistCardProps {
  artist: Artist;
  onClick?: () => void;
}

export default function ArtistCard({ artist, onClick }: ArtistCardProps) {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-200 hover:border-blue-500"
      onClick={onClick}
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
        {artist.imageUrl ? (
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <div className="text-7xl mb-2">🎤</div>
              <div className="text-sm font-semibold px-4">{artist.name}</div>
            </div>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{artist.name}</h3>
        {artist.disambiguation && (
          <p className="text-gray-500 text-xs mb-2 italic">{artist.disambiguation}</p>
        )}
        {(artist.genres && artist.genres.length > 0) && (
          <p className="text-blue-600 font-medium text-sm mb-1">{artist.genres[0].name}</p>
        )}
        <div className="flex items-center gap-4 text-gray-600 text-sm mt-3">
          {artist.country && (
            <span className="flex items-center gap-1">
              📍 {artist.country}
            </span>
          )}
          {artist['life-span']?.begin && (
            <span className="flex items-center gap-1">
              📅 {artist['life-span'].begin.split('-')[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
