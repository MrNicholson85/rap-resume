'use client';

import Image from 'next/image';
import { Artist } from '@/lib/audiodb';

interface ArtistCardProps {
  artist: Artist;
  onClick?: () => void;
}

export default function ArtistCard({ artist, onClick }: ArtistCardProps) {
  const imageUrl = artist.images && artist.images.length > 0 ? artist.images[0].url : null;
  
  return (
    <div
      className="bg-white dark:bg-[#2e2e2e] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-[#e0e0e0] dark:border-[#464646] hover:border-[#FF4500] dark:hover:border-[#FFD700]"
      onClick={onClick}
    >
      <div className="relative h-48 bg-gradient-to-br from-[#FF4500] to-[#FFD700]">
        {imageUrl ? (
          <Image
            src={imageUrl}
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
        <h3 className="text-xl font-bold text-[#1F1F1F] dark:text-white mb-2">{artist.name}</h3>
        {(artist.genres && artist.genres.length > 0) && (
          <p className="text-[#FF4500] dark:text-[#FFD700] font-medium text-sm mb-1">{artist.genres[0]}</p>
        )}
        {artist.type && (
          <p className="text-[#464646] dark:text-[#e0e0e0] text-xs mb-2">{artist.type}</p>
        )}
        <div className="flex items-center gap-4 text-[#464646] dark:text-[#e0e0e0] text-sm mt-3">
          {artist.popularity && (
            <span className="flex items-center gap-1">
              ⭐ {artist.popularity}
            </span>
          )}
          {artist.followers?.total && (
            <span className="flex items-center gap-1">
              👥 {artist.followers.total > 1000 ? `${Math.floor(artist.followers.total / 1000)}k` : artist.followers.total}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
