import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Callback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get("code");
    if (code) {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/token`, { code })
        .then(response => {
          localStorage.setItem("spotify_access_token", response.data.access_token);
          navigate("/"); // Redirect to homepage
        })
        .catch(error => console.error("Failed to get token:", error));
    }
  }, [params, navigate]);

  return <p>Processing login...</p>;
}

export default Callback;