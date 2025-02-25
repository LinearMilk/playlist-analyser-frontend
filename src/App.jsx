import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "./lib/api";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=playlist-read-private playlist-read-collaborative`;

function App() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("spotify_access_token"));
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (accessToken) {
            fetchUserProfile(accessToken).then(setUser);
        }
    }, [accessToken]);

    function logout() {
        localStorage.removeItem("spotify_access_token");
        setAccessToken(null);
        setUser(null);
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
        </div>
    );
}

export default App;
