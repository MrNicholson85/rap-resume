# 🎤 Rap Resume

A Next.js application that transforms rap artist discographies into professional resume-style documents. Search for any hip-hop artist and view their complete career timeline presented as a polished CV with full album details and track listings.

## ✨ Features

- 🔍 **Artist Search** - Search for rap artists using MusicBrainz comprehensive database
- 📄 **Resume-Style Layout** - Artist profiles displayed as professional CVs with:
  - Header section with gradient placeholder for artists (no photos available from MusicBrainz)
  - Professional summary (biography when available)
  - Core competencies (genres/tags)
  - Discography presented as work experience with vertical timeline
- 💿 **Complete Discographies** - Full album listings from MusicBrainz (albums only, no EPs/singles)
- 🎵 **Album Detail Pages** - Click any album to view:
  - Large album cover art from Cover Art Archive
  - Complete track listing with track numbers and durations
  - Label and release information
  - **Streaming service links** (Spotify, Apple Music, YouTube, Deezer) when available
- 🎨 **Traditional Resume Aesthetics** - Clean white background with blue accents
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Optimized Loading** - Cover art fetched for first 10 albums to balance speed and data completeness

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: 
  - MusicBrainz API (artist/album/track data)
  - Cover Art Archive (album artwork)
- **Package Manager**: npm

## 📋 Project Structure

```
rap-resume/
├── src/
│   ├── app/
│   │   ├── album/[id]/
│   │   │   └── page.tsx        # Album detail page with track listing
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Home page with search and resume view
│   │   └── globals.css         # Global styles and Tailwind imports
│   ├── components/
│   │   ├── ArtistCard.tsx      # Card component for artist search results
│   │   ├── AlbumCard.tsx       # Card component (legacy)
│   │   └── SearchBar.tsx       # Search input with submit handler
│   └── lib/
│       └── audiodb.ts          # MusicBrainz API utilities and types
├── public/                     # Static assets
├── .github/
│   └── copilot-instructions.md # GitHub Copilot context
├── next.config.ts              # Next.js configuration
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ installed
- npm package manager

### Installation Steps

1. Clone the repository:
```bash
git clone <your-repo-url>
cd rap-resume
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

1. **Search for an Artist**
   - Enter a rap artist name in the search bar (e.g., "Eminem", "Kendrick Lamar", "J. Cole")
   - Click "Search" or press Enter

2. **View Artist Resume**
   - Click on an artist card from the search results
   - View their professional resume including:
     - Artist photo and basic info
     - Biography/professional summary
     - Skills and genres
     - Complete discography timeline

3. **Explore Albums**
   - Click on any album in the discography
   - View album cover art and complete track listing
   - See track durations and total track count
   - Use the back button to return to the artist resume

## 🔧 Development Commands

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 API Integration

### MusicBrainz API

The app uses the MusicBrainz API with the following features:

- **Rate Limiting**: 1 request per second (built-in throttling)
- **No API Key Required**: Free and open access
- **Endpoints Used**:
  - Artist search: `/ws/2/artist?query={name}`
  - Artist details: `/ws/2/artist/{id}?inc=tags+genres+url-rels`
  - Albums: `/ws/2/release-group?artist={id}&type=album`
  - Album details with streaming links: `/ws/2/release/{id}?inc=labels+recordings+url-rels`
  - Tracks: `/ws/2/release/{id}?inc=recordings`

### Cover Art Archive

- Fetches album artwork from coverartarchive.org
- Falls back to 💿 icon when artwork is unavailable
- Optimized to fetch cover art for first 10 albums only
- Additional albums load with placeholder icon

### Streaming Services

MusicBrainz provides external URL relationships for albums, which may include:
- **Spotify** - Direct album links
- **Apple Music** - Album pages
- **YouTube** - Album playlists or full album videos
- **Deezer** - Streaming links

*Note: Availability depends on data contributed to MusicBrainz database*

## 🎨 Design Specifications

### Color Palette
- **Primary Background**: `#F9FAFB` (gray-50)
- **Accent Color**: `#2563EB` (blue-600)
- **Text Primary**: `#111827` (gray-900)
- **Text Secondary**: `#4B5563` (gray-600)
- **Card Background**: `#FFFFFF` (white)

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Inter/system font stack
- **Resume Style**: Professional, clean, and scannable

### Layout Features
- **Timeline Design**: Vertical timeline with blue dots and connecting lines for discography
- **Card Grid**: 3-column responsive grid for search results
- **Resume Document**: Single column, max-width 4xl, white background with shadow
- **Hover States**: Gray background on album entries, blue text on titles
- **Artist Placeholders**: Gradient background (blue to purple) with microphone emoji

## 🔑 Key Components

### Artist Resume View
```typescript
- Header: Gradient placeholder or photo, name, genre, location, active years
- Professional Summary: Biography text (when available)
- Core Competencies: Genre/tag pills with blue styling
- Discography: Chronological timeline with clickable album entries
```

### Album Detail Page
```typescript
- Album cover (264x264px) or disc placeholder
- Album metadata (title, year, label, type)
- Streaming service buttons (Spotify, Apple Music, YouTube, Deezer)
- Track listing (number, title, duration)
- Total track count
```

### API Functions
```typescript
searchArtists(artistName: string): Promise<Artist[]>
getArtistDetails(artistId: string): Promise<Artist | null>
getArtistAlbums(artistId: string): Promise<Album[]>
getAlbumDetails(albumId: string): Promise<Album | null>
getAlbumTracks(albumId: string): Promise<Track[]>
```

## 🚧 Known Limitations

- **Rate Limiting**: MusicBrainz API allows 1 request/second (may cause slower loading for albums)
- **Data Completeness**: Some artists may have incomplete data in MusicBrainz
- **Cover Art**: Only first 10 albums fetch cover art to improve performance; others show placeholder
- **Artist Photos**: MusicBrainz doesn't provide artist images; gradient placeholders used instead
- **Biography**: Not all artists have biography text in MusicBrainz
- **Streaming Links**: Availability varies by album; depends on MusicBrainz contributor data

## 🔮 Future Enhancements

- [ ] Add search filters (genre, country, year)
- [ ] Implement artist image fetching from Last.fm or other sources (requires API key)
- [ ] Lazy load cover art for albums beyond the first 10
- [ ] Add album reviews/ratings from external sources
- [ ] Export resume as PDF
- [ ] Share resume via URL
- [ ] Add music video links in track listings
- [ ] Include related artists section
- [ ] Dark mode toggle
- [ ] Cache API responses for faster subsequent loads

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **MusicBrainz**: Open music encyclopedia providing artist/album data
- **Cover Art Archive**: Album artwork repository
- **Next.js**: React framework
- **Tailwind CSS**: Utility-first CSS framework

---

Built with ❤️ for hip-hop culture and professional presentation.
