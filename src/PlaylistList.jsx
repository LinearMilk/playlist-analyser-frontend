import React from "react";

function PlaylistList({ playlists, onSelect }) {
    return (
        <div className="playlists">
            <h2>Your Playlists</h2>
            <div className="playlist-grid">
                {playlists.map(playlist => (
                    <div 
                        key={playlist.id} 
                        className="playlist-card"
                        onClick={() => onSelect(playlist)}
                    >
                        <img src={playlist?.images?.[0]?.url || "/default-playlist.png"} alt={playlist.name} />
                        <h3>{playlist.name}</h3>
                        <p>{playlist.tracks.total} tracks</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlaylistList;
