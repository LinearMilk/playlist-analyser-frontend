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
