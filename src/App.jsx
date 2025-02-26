import React, { useEffect, useState } from "react";
import { fetchUserProfile, fetchUserPlaylists, fetchPlaylistTracks, fetchTrackFeatures } from "./lib/api";
import Chart from "chart.js/auto";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=playlist-read-private playlist-read-collaborative user-library-read`;

function App() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("spotify_access_token"));
    const [user, setUser] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [trackFeatures, setTrackFeatures] = useState(null);
    const chartRef = React.useRef(null);
    console.log("Access Token:", accessToken);

    useEffect(() => {
        if (accessToken) {
            fetchUserProfile(accessToken).then(setUser);
            fetchUserPlaylists(accessToken).then(data => {
                if (data?.items) setPlaylists(data.items);
            });
        }
    }, [accessToken]);

    async function handlePlaylistSelect(playlist) {
      setSelectedPlaylist(playlist);
      setTracks([]); 
      setTrackFeatures(null); 
  
      const trackData = await fetchPlaylistTracks(playlist.id, accessToken);
      if (trackData?.items) {
          setTracks(trackData.items);
  
          const trackIds = trackData.items.map(item => item.track.id);
          const featuresData = await fetchTrackFeatures(trackIds, accessToken);
  
          if (featuresData?.error?.status === 401) {
              console.warn("Token expired, logging out...");
              logout(); // Force re-login
              return;
          }
  
          if (featuresData?.audio_features) {
              setTrackFeatures(featuresData.audio_features);
          }
      }
  }

    function logout() {
        localStorage.removeItem("spotify_access_token");
        setAccessToken(null);
        setUser(null);
        setPlaylists([]);
        setSelectedPlaylist(null);
        setTracks([]);
        setTrackFeatures(null);
    }

    useEffect(() => {
        if (!trackFeatures || trackFeatures.length === 0) return;

        const ctx = chartRef.current.getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: tracks.map(t => t.track.name),
                datasets: [
                    {
                        label: "Danceability",
                        data: trackFeatures.map(f => f.danceability),
                        backgroundColor: "rgba(54, 162, 235, 0.6)"
                    },
                    {
                        label: "Energy",
                        data: trackFeatures.map(f => f.energy),
                        backgroundColor: "rgba(255, 99, 132, 0.6)"
                    },
                    {
                        label: "Popularity",
                        data: tracks.map(t => t.track.popularity / 100),
                        backgroundColor: "rgba(75, 192, 192, 0.6)"
                    }
                ]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        });

    }, [trackFeatures]);

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
                            <div 
                                key={playlist.id} 
                                className="playlist-card"
                                onClick={() => handlePlaylistSelect(playlist)}
                            >
                                <img src={playlist?.images?.[0]?.url || "/default-playlist.png"} alt={playlist.name} />
                                <h3>{playlist.name}</h3>
                                <p>{playlist.tracks.total} tracks</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedPlaylist && (
                <div className="playlist-details">
                    <h2>{selectedPlaylist.name}</h2>
                    <p>Tracks:</p>
                    <ul>
                        {tracks.map(item => (
                            <li key={item.track.id}>
                                {item.track.name} - {item.track.artists.map(a => a.name).join(", ")}
                            </li>
                        ))}
                    </ul>

                    {trackFeatures && (
                        <div className="chart-container">
                            <canvas ref={chartRef}></canvas>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
