import React from "react";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=playlist-read-private playlist-read-collaborative`;

function App() {
  return (
    <div>
      <h1>Spotify Playlist Analyzer</h1>
      <a href={AUTH_URL}>Login with Spotify</a>
    </div>
  );
}

export default App;
