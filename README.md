# ZenithAnime (AniStream Pro)

Anime streaming demo site built with React 19, Vite and Tailwind CSS v4.
Everything is stored in the browser (localStorage). There is no server.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy (live URL)

```bash
npm run build      # creates the dist/ folder
```

Drag the `dist/` folder onto https://app.netlify.com/drop to get a public link.

> Use `npm run build`, NOT `npm run build:single`. The single-file build puts every
> video inside one HTML file, and the videos in this project are ~250 MB, so that
> file would be unusable.

## Accounts

- Register with an email, username and password (min. 6 characters).
- Passwords are stored as salted SHA-256 hashes in the browser, never as plain text.
  This is a demo: it is not production-grade security because there is no server.
- The profile picture of a new account is the first letter of the email.
- Demo accounts (password `password123`): `admin@zenithanime.com` (admin),
  `muhammadfaiza903@gmail.com`, `sakura@animefan.net`.

## Videos

Episode videos live in `src/assets/videos/` (720p MP4). To replace one, overwrite the
file with the same name. New videos are wired up in `src/assets/images.ts` and
`src/data/animeData.ts`.

When you change the saved data shape, bump the `zenith_anime_list_vNN` key in
`src/context/AppContext.tsx` so browsers drop the old saved copy.
