# 🎤 Rap Resume

A Next.js application that transforms rap artist discographies into professional resume-style documents. Search for any hip-hop artist and view their complete career timeline presented as a polished CV with full album details, track listings, and streaming links.

## ✨ Features

- 🔍 **Artist Search** - Search for rap artists using Spotify's comprehensive database
- 📄 **Resume-Style Layout** - Artist profiles displayed as professional CVs with:
  - Header section with artist photo from Spotify
  - Artist statistics (popularity score, follower count)
  - Core competencies (genres)
  - Discography presented as work experience with vertical timeline
- 💿 **Complete Discographies** - Full album listings from Spotify (albums only, no EPs/singles)
- 🎵 **Album Detail Pages** - Click any album to view:
  - High-quality album cover art from Spotify
  - Complete track listing with track numbers, durations, and featured artists
  - Album metadata (release year, type, track count)
  - **Direct streaming links** to:
    - 🎵 Spotify (direct album link)
    - 🍎 Apple Music (search link)
    - ▶️ YouTube (search link)
    - 🎧 Deezer (search link)
- 🎨 **Traditional Resume Aesthetics** - Clean white background with blue accents
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Data** - Always shows current, accurate information from Spotify

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Spotify Web API (Client Credentials flow)
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
│   │   └── SearchBar.tsx       # Search input with submit handler
│   └── lib/
│       └── audiodb.ts          # Spotify API utilities and types
├── public/                     # Static assets
├── .env.local                  # Environment variables (not in git)
├── .env.local.example          # Environment variables template
├── .github/
│   └── copilot-instructions.md # GitHub Copilot context
├── SPOTIFY_SETUP.md            # Spotify API setup guide
├── next.config.ts              # Next.js configuration
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ installed
- npm package manager
- Spotify Developer account (free)

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

3. Set up Spotify API credentials:
   - Follow the detailed instructions in [SPOTIFY_SETUP.md](./SPOTIFY_SETUP.md)
   - Or quick setup:
     1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
     2. Create a new app
     3. Copy your Client ID and Client Secret
     4. Add them to `.env.local`:
        ```
        NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
        NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_client_secret_here
        ```

4. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

1. **Search for an Artist**
   - Enter an artist name in the search bar (e.g., "Eminem", "Kendrick Lamar", "Drake")
   - Click "Search" or press Enter

2. **View Artist Resume**
   - Click on an artist card from the search results
   - View their professional resume including:
     - Artist photo and profile
     - Popularity score and follower count
     - Genres and music style
     - Complete discography timeline

3. **Explore Albums**
   - Click on any album in the discography
   - View high-quality album cover art and complete track listing
   - Click streaming service buttons to listen on your preferred platform
   - Use the back button to return to the artist resume

## 🔧 Development Commands

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 API Integration

### Spotify Web API

The app uses the Spotify Web API with Client Credentials OAuth flow:

- **Authentication**: Automatic token management with refresh
- **Endpoints Used**:
  - Artist search: `/v1/search?q={name}&type=artist`
  - Artist details: `/v1/artists/{id}`
  - Albums: `/v1/artists/{id}/albums?include_groups=album`
  - Album details: `/v1/albums/{id}`
  - Album tracks: `/v1/albums/{id}/tracks`

### Streaming Links

Each album includes links to multiple streaming platforms:
- **Spotify** - Direct album link from Spotify API
- **Apple Music** - Generated search link based on artist + album name
- **YouTube** - Generated search link for the album
- **Deezer** - Generated search link for the album

All streaming links are functional and lead directly to the album or search results on each platform.

## 🎨 Design Specifications

### Color Palette
- **Primary Background**: `#F9FAFB` (gray-50)
- **Accent Color**: `#2563EB` (blue-600)
- **Text Primary**: `#111827` (gray-900)
- **Text Secondary**: `#4B5563` (gray-600)
- **Card Background**: `#FFFFFF` (white)
- **Streaming Buttons**:
  - Spotify: Green (`#16A34A`)
  - Apple Music: Pink (`#DB2777`)
  - YouTube: Red (`#DC2626`)
  - Deezer: Purple (`#9333EA`)

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Inter/system font stack
- **Resume Style**: Professional, clean, and scannable

### Layout Features
- **Timeline Design**: Vertical timeline with blue dots and connecting lines for discography
- **Card Grid**: 3-column responsive grid for search results
- **Resume Document**: Single column, max-width 4xl, white background with shadow
- **Hover States**: Gray background on album entries, blue text on titles
- **Artist Photos**: High-quality images from Spotify with gradient fallback

## 🔑 Key Components

### Artist Resume View
```typescript
- Header: Artist photo, name, genres, popularity, follower count
- Core Competencies: Genre pills with blue styling
- Discography: Chronological timeline with clickable album entries
```

### Album Detail Page
```typescript
- Album cover (high-res from Spotify)
- Album metadata (title, year, artist, type, track count)
- Streaming service buttons (Spotify, Apple Music, YouTube, Deezer)
- Track listing (number, title, duration, featured artists)
- Explicit content indicators
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

- **API Rate Limits**: Spotify API has rate limits; excessive requests may be throttled
- **Authentication**: Uses Client Credentials flow (public data only, no user-specific data)
- **Album Filtering**: Only shows albums (not EPs, singles, or compilations) for cleaner results
- **Market Restrictions**: Some content may vary by region (using US market by default)

## 🔮 Future Enhancements

- [ ] Add search filters (genre, popularity, year)
- [ ] Implement pagination for large discographies
- [ ] Add album reviews/ratings
- [ ] Export resume as PDF
- [ ] Share resume via URL
- [ ] Include related artists section
- [ ] Dark mode toggle
- [ ] Play preview clips directly in the app
- [ ] Add top tracks section for artists
- [ ] Include artist biography from additional sources
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
