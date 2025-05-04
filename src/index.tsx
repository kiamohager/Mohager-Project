import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App";

import "./assets/styles/global.scss";
import { BrowserRouter, Route, Routes } from "react-router";

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
        </Routes>
    </BrowserRouter>
);
