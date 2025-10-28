# Bernieflix

Bernieflix is a movie discovery web application built with Next.js and The Movie Database (TMDB) API. It allows users to browse trending, popular, and top-rated movies, search for movies, explore genres, and manage a personal watchlist.

The app also features AI-powered recommendations based on the user's watchlist.

## Features

- **Browse Movies:** Discover trending, now playing, popular, and top-rated movies.
- **Movie Details:** View detailed information for each movie, including synopsis, rating, runtime, and genres.
- **Watch Trailers:** Watch movie trailers directly within the app.
- **Search:** Find movies by title.
- **Genres:** Explore movies by genre.
- **Watchlist:** Add and remove movies from a personal watchlist (stored in local storage).
- **AI Recommendations:** Get personalized movie recommendations based on your watchlist.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **AI:** [Google's Genkit](https://firebase.google.com/docs/genkit)
- **Movie Data:** [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Bernieflix.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Get a free API Key at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
4. Enter your API key in `src/lib/constants.ts`
   ```ts
   export const TMDB_API_KEY = 'ENTER YOUR API KEY';
   ```

### Running the Development Server

To run the app in development mode, execute the following command:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.