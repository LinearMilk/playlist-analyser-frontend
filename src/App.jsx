import React, { useEffect, useState } from "react";
import { fetchUserProfile, fetchUserPlaylists } from "./lib/api";
import AuthSection from "./components/AuthSection";
import PlaylistList from "./components/PlaylistList";
import PlaylistDetails from "./components/PlaylistDetails";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read"
].join(" "); 

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

function App() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("spotify_access_token"));
    const [user, setUser] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    useEffect(() => {
        if (accessToken) {
            fetchUserProfile(accessToken).then(setUser);
            fetchUserPlaylists(accessToken).then(data => {
                if (data?.items) setPlaylists(data.items);
            });
        }
    }, [accessToken]);

    function logout() {
        localStorage.removeItem("spotify_access_token");
        setAccessToken(null);
        setUser(null);
        setPlaylists([]);
        setSelectedPlaylist(null);
    }

    return (
        <div className="container">
            <h1>Spotify Playlist Analyzer</h1>
            <AuthSection accessToken={accessToken} user={user} logout={logout} AUTH_URL={AUTH_URL} />

            {playlists.length > 0 && (
                <PlaylistList playlists={playlists} onSelect={setSelectedPlaylist} />
            )}

            {selectedPlaylist && <PlaylistDetails playlist={selectedPlaylist} accessToken={accessToken} />}
        </div>
    );
}

export default App;
