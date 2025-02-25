import React, { useEffect, useState } from "react";
import { fetchUserProfile, fetchUserPlaylists } from "./lib/api";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=playlist-read-private playlist-read-collaborative`;

function App() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("spotify_access_token"));
    const [user, setUser] = useState(null);
    const [playlists, setPlaylists] = useState([]);

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
    }

    return (
        <div className="container">
            <h1>Spotify Playlist Analyzer</h1>
            
            {!accessToken ? (
                <a className="login-btn" href={AUTH_URL}>Login with Spotify</a>
            ) : (
                <div className="profile">
                    {user ? (
                        <>
                            <img className="avatar" src={user.images[0]?.url} alt="User avatar" />
                            <h2>{user.display_name}</h2>
                            <p>@{user.id}</p>
                        </>
                    ) : (
                        <p>Loading user info...</p>
                    )}
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
            )}

            {playlists.length > 0 && (
                <div className="playlists">
                    <h2>Your Playlists</h2>
                    <div className="playlist-grid">
                        {playlists.map(playlist => (
                            <div key={playlist.id} className="playlist-card">
                                <img src={playlist.images[0]?.url} alt={playlist.name} />
                                <h3>{playlist.name}</h3>
                                <p>{playlist.tracks.total} tracks</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
