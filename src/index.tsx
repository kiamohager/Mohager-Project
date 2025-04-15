import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App";

import "./assets/styles/global.scss";
import { BrowserRouter, Route, Routes } from "react-router";
import SpotifyRequest from "./components/Spotify/SpotifyRequest";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Routes>
            <Route
                path="/"
                element={
                    <React.StrictMode>
                        <App />
                    </React.StrictMode>
                }
            />
            <Route path="/callback" element={<SpotifyRequest />} />
        </Routes>
    </BrowserRouter>
);
