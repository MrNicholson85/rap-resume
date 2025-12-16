'use client';

import Image from 'next/image';
import { Album } from '@/lib/audiodb';

interface AlbumCardProps {
  album: Album;
  onClick?: () => void;
}

export default function AlbumCard({ album, onClick }: AlbumCardProps) {
  const imageUrl = album.coverArtUrl || (album.images && album.images.length > 0 ? album.images[0].url : null);
  const albumName = album.title || album.name || 'Unknown Album';
  
  return (
    <div
      className="bg-[#2e2e2e] dark:bg-[#1F1F1F] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer border border-[#464646] dark:border-[#464646]"
      onClick={onClick}
    >
      <div className="relative h-64 bg-[#464646] dark:bg-[#2e2e2e]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={albumName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[#464646] dark:text-[#464646]">
            <div className="text-center">
              <div className="text-6xl mb-2">💿</div>
              <div className="text-sm text-[#e0e0e0]">No Image</div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white dark:text-white mb-2">{albumName}</h3>
        {album.year && (
          <p className="text-[#FFD700] dark:text-[#FFD700] text-sm mb-1">Released: {album.year}</p>
        )}
        {album.album_type && (
          <p className="text-[#e0e0e0] dark:text-[#e0e0e0] text-sm capitalize">{album.album_type}</p>
        )}
      </div>
    </div>
  );
}
