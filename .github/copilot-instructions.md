# Rap Resume - GitHub Copilot Instructions

## Project Overview

Rap Resume is a Next.js application that allows users to discover and explore rap artists and their discographies using TheAudioDB free API.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: TheAudioDB (free tier, no API key required)
- **Package Manager**: npm

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Home page with search and display logic
│   └── globals.css      # Global styles and Tailwind imports
├── components/
│   ├── ArtistCard.tsx   # Card component for displaying artists
│   ├── AlbumCard.tsx    # Card component for displaying albums
│   └── SearchBar.tsx    # Search input with submit handler
└── lib/
    └── audiodb.ts       # TheAudioDB API utilities and types
```

## Key Components

### API Layer (`src/lib/audiodb.ts`)
- Contains TypeScript interfaces for Artist, Album, and Track data
- Provides functions to interact with TheAudioDB API:
  - `searchArtists(artistName)` - Search for artists
  - `getArtistDetails(artistId)` - Get artist details
  - `getArtistAlbums(artistId)` - Get artist albums
  - `getAlbumTracks(albumId)` - Get album tracks
  - `getAlbumDetails(albumId)` - Get album details

### Components
- **ArtistCard**: Displays artist thumbnail, name, genre, country, and formed year
- **AlbumCard**: Displays album artwork, name, release year, and genre
- **SearchBar**: Input field with search functionality

### Main Page (`src/app/page.tsx`)
- Client component with state management for:
  - Search results (artists)
  - Selected artist
  - Artist albums
  - Loading states
- Handles search, artist selection, and navigation

## Coding Conventions

1. **TypeScript**: All components and utilities should be strongly typed
2. **Client Components**: Use `'use client'` directive for interactive components
3. **Styling**: Use Tailwind CSS utility classes
4. **Color Scheme**: Dark theme with purple accents
   - Background: gradient from gray-900 via purple-900 to gray-900
   - Cards: gray-800 background
   - Accents: purple-400, purple-600
5. **Image Handling**: Use Next.js `Image` component with proper sizing
6. **Error Handling**: Wrap API calls in try-catch blocks

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Usage Notes

- TheAudioDB free tier doesn't require an API key
- Base URL: `https://www.theaudiodb.com/api/v1/json/2`
- All responses are JSON
- Some data fields may be null
- Images are served via direct URLs

## Future Enhancement Ideas

- Add album track listings
- Implement music video previews
- Add favorites/bookmarking functionality
- Include social media links
- Add filtering by genre/year
- Implement pagination for search results

## Common Tasks

### Adding a new component
1. Create in `src/components/` directory
2. Use TypeScript with proper prop types
3. Import and use in `page.tsx` or other components
4. Style with Tailwind CSS following the dark/purple theme

### Adding new API functions
1. Add to `src/lib/audiodb.ts`
2. Define proper TypeScript interfaces
3. Use consistent error handling
4. Test with various inputs

### Styling modifications
1. Maintain the dark theme aesthetic
2. Use existing color palette (gray-900, purple-900, purple-400, etc.)
3. Ensure responsive design (use md:, lg: breakpoints)
4. Keep consistent spacing and padding

## Debugging Tips

- Check browser console for API errors
- Verify API responses match TypeScript interfaces
- Ensure images have fallback displays
- Test with various artist names (some may not exist in database)
