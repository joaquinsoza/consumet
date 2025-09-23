# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start server**: `npm start` - Runs the production server using ts-node
- **Development server**: `npm run dev` - Runs with nodemon for auto-restart on changes
- **Build**: `npm run build` - Compiles TypeScript to JavaScript in `/dist`
- **Lint**: `npm run lint` - Formats code using Prettier

## Project Architecture

This is a Fastify-based REST API that scrapes entertainment content from various providers to create a unified interface for accessing anime, manga, movies, books, and other media content.

### Core Structure

- **Entry point**: `src/main.ts` - Sets up Fastify server, Redis caching, CORS, and registers all route modules
- **Routes**: Organized by content type in `src/routes/`
  - `/anime` - Multiple anime providers (gogoanime, zoro, animepahe, etc.)
  - `/manga` - Manga content providers
  - `/movies` - Movie streaming providers
  - `/books` - Book content (libgen)
  - `/comics` - Comic providers
  - `/light-novels` - Light novel providers
  - `/meta` - Metadata providers (TMDB, AniList, MAL)
  - `/news` - News providers
  - `/utils` - Utility endpoints (image proxy, m3u8 proxy, provider lists)

### Key Dependencies

- **@consumet/extensions**: Core scraping library providing provider implementations
- **Fastify**: Web framework with plugin architecture
- **Redis**: Optional caching layer (configurable via environment)
- **Cheerio**: HTML parsing for scraping
- **Axios**: HTTP client for requests

### Environment Configuration

Uses `.env` file with these key variables:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Set to "DEMO" for demo mode with session management, "PROD" for production
- `REDIS_HOST/PORT/PASSWORD`: Optional Redis caching
- `TMDB_KEY`: TMDB API access token
- Provider-specific URLs and tokens for various scrapers

### Route Organization

Each content type follows a consistent pattern:
1. Main index file registers provider-specific sub-routes
2. Each provider has its own route file with endpoints for search, info, episodes/chapters
3. Providers are dynamically loaded from `@consumet/extensions` PROVIDERS_LIST

### Deployment Support

Configured for multiple deployment platforms:
- **Docker**: Dockerfile included
- **Vercel**: vercel.json configuration
- **Render**: render.yaml configuration
- **Heroku**: Deploy button in README
- **Railway**: Deploy button in README

## Development Notes

- TypeScript with strict mode enabled
- Code is formatted with Prettier (no manual linting rules)
- Uses CommonJS modules (`require`/`module.exports`)
- Provider implementations are imported from external `@consumet/extensions` package
- Demo mode includes IP-based session management for rate limiting
- All routes return JSON responses with consistent error handling