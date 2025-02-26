import React, { useEffect, useState, useRef } from "react";
import { fetchPlaylistTracks, fetchTrackFeatures } from "../lib/api";
import ChartComponent from "./ChartComponent";

function PlaylistDetails({ playlist, accessToken }) {
    const [tracks, setTracks] = useState([]);
    const [trackFeatures, setTrackFeatures] = useState(null);

    useEffect(() => {
        async function loadTracks() {
            setTracks([]);
            setTrackFeatures(null);

            const trackData = await fetchPlaylistTracks(playlist.id, accessToken);
            if (trackData?.items) {
                setTracks(trackData.items);

                const trackIds = trackData.items.map(item => item.track.id);
                const featuresData = await fetchTrackFeatures(trackIds, accessToken);

                if (featuresData?.audio_features) {
                    setTrackFeatures(featuresData.audio_features);
                }
            }
        }

        loadTracks();
    }, [playlist, accessToken]);

    return (
        <div className="playlist-details">
            <h2>{playlist.name}</h2>
            <p>Tracks:</p>
            <ul>
                {tracks.map(item => (
                    <li key={item.track.id}>
                        {item.track.name} - {item.track.artists.map(a => a.name).join(", ")}
                    </li>
                ))}
            </ul>

            {trackFeatures && <ChartComponent tracks={tracks} trackFeatures={trackFeatures} />}
        </div>
    );
}

export default PlaylistDetails;
