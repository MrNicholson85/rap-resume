# 🎤 Rap Resume

A Next.js application that transforms rap artist discographies into professional resume-style documents. Search for any hip-hop artist and view their complete career timeline presented as a polished CV with full album details and track listings.

## ✨ Features

- 🔍 **Artist Search** - Search for rap artists using MusicBrainz comprehensive database
- 📄 **Resume-Style Layout** - Artist profiles displayed as professional CVs with:
  - Header section with artist photo and key information
  - Professional summary (biography)
  - Core competencies (genres/tags)
  - Discography presented as work experience with timeline
- 💿 **Complete Discographies** - Full album listings from MusicBrainz (albums only, no EPs/singles)
- 🎵 **Album Detail Pages** - Click any album to view:
  - Large album cover art
  - Complete track listing with durations
  - Label and release information
- 🎨 **Traditional Resume Aesthetics** - Clean white background with blue accents
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

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
  - Tracks: `/ws/2/release/{id}?inc=recordings`

### Cover Art Archive

- Fetches album artwork from coverartarchive.org
- Falls back to 💿 icon when artwork is unavailable
- Images loaded asynchronously for better performance

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
- **Timeline Design**: Vertical timeline with dots for discography
- **Card Grid**: 3-column responsive grid for search results
- **Resume Document**: Single column, max-width 4xl
- **Hover States**: Subtle transitions on interactive elements

## 🔑 Key Components

### Artist Resume View
```typescript
- Header: Artist photo, name, genre, location, active years
- Professional Summary: Biography text
- Core Competencies: Genre/tag pills
- Discography: Chronological timeline with album entries
```

### Album Detail Page
```typescript
- Album cover (264x264px)
- Album metadata (title, year, label, type)
- Track listing (number, title, duration)
- Total track count
```

### API Functions
```typescript
searchArtists(artistName: string): Promise<Artist[]>
getArtistDetails(artistId: string): Promise<Artist | null>
getArtistAlbums(artistId: string): Promise<Album[]>
getAlbumTracks(albumId: string): Promise<Track[]>
```

## 🚧 Known Limitations

- **Rate Limiting**: MusicBrainz API allows 1 request/second
- **Data Completeness**: Some artists may have incomplete data
- **Cover Art**: Not all albums have artwork available
- **Biography**: Not all artists have biography text in MusicBrainz

## 🔮 Future Enhancements

- [ ] Add search filters (genre, country, year)
- [ ] Implement artist image fetching from external sources
- [ ] Add album reviews/ratings
- [ ] Export resume as PDF
- [ ] Share resume via URL
- [ ] Add music video links
- [ ] Include related artists section
- [ ] Dark mode toggle

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **MusicBrainz**: Open music encyclopedia providing artist/album data
- **Cover Art Archive**: Album artwork repository
- **Next.js**: React framework
- **Tailwind CSS**: Utility-first CSS framework

---

Built with ❤️ for hip-hop culture and professional presentation.
