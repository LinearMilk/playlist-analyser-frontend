import React from "react";

function AuthSection({ accessToken, user, logout, AUTH_URL }) {
    return (
        <>
            {!accessToken ? (
                <a className="login-btn" href={AUTH_URL}>Login with Spotify</a>
            ) : (
                <div className="profile">
                    {user ? (
                        <>
                            <img className="avatar" src={user.images?.[0]?.url} alt="User avatar" />
                            <h2>{user.display_name}</h2>
                            <p>@{user.id}</p>
                        </>
                    ) : (
                        <p>Loading user info...</p>
                    )}
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
            )}
        </>
    );
}

export default AuthSection;
