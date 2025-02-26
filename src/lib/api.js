export async function fetchUserProfile(accessToken) {
    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok) throw new Error("Failed to fetch user profile");

        return await response.json();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

export async function fetchUserPlaylists(accessToken) {
    try {
        const response = await fetch("/api/playlists", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user playlists");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        return null;
    }
}


export async function fetchPlaylistTracks(playlistId, accessToken) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok) throw new Error("Failed to fetch playlist tracks");

        return await response.json();
    } catch (error) {
        console.error("Error fetching playlist tracks:", error);
        return null;
    }
}

export async function fetchTrackFeatures(trackIds, accessToken) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`, {
            headers: { 
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Failed to fetch track features");

        return await response.json();
    } catch (error) {
        console.error("Error fetching track features:", error);
        return null;
    }
}
