import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Callback from "./Callback";
import "./styles.css"; // Add this line

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  </Router>
);