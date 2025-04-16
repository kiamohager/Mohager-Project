import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App";

import "./assets/styles/global.scss";
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate } from "react-router";
import SpotifyRequest from "./components/Spotify/SpotifyRequest";

const Router404Inject = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const splitPath = location.search.split("/");
        if (splitPath[0] === "?") {
            navigate(splitPath[1]);
        }
    }, [location]);

    return <Outlet />;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Router404Inject />}>
                <Route
                    index
                    element={
                        <React.StrictMode>
                            <App />
                        </React.StrictMode>
                    }
                />
                <Route path="callback" element={<SpotifyRequest />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
