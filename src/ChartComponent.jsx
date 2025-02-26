import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function ChartComponent({ tracks, trackFeatures }) {
    const chartRef = useRef(null);

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

    return <canvas ref={chartRef}></canvas>;
}

export default ChartComponent;
