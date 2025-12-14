'use client';

import Image from 'next/image';
import { Album } from '@/lib/audiodb';

interface AlbumCardProps {
  album: Album;
  onClick?: () => void;
}

export default function AlbumCard({ album, onClick }: AlbumCardProps) {
  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-64 bg-gray-700">
        {album.strAlbumThumb ? (
          <Image
            src={album.strAlbumThumb}
            alt={album.strAlbum}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No Image Available
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{album.strAlbum}</h3>
        {album.intYearReleased && (
          <p className="text-purple-400 text-sm mb-1">Released: {album.intYearReleased}</p>
        )}
        {album.strGenre && (
          <p className="text-gray-400 text-sm">{album.strGenre}</p>
        )}
      </div>
    </div>
  );
}
