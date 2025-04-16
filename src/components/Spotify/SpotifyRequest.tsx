import { useEffect } from "react";
import { redirectToAuthCodeFlow, getAccessToken } from "./auth";
import { useNavigate, useSearchParams } from "react-router";
import { DateTime } from "luxon";

export const CLIENT_ID = "3406e6930f66445eb9d3b82f709357bf";

const SpotifyRequest = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (searchParams.get("error")) {
                console.log("Im here");
                return navigate("/");
            }
            const codeParams = searchParams.get("code");
            if (!codeParams) {
                await redirectToAuthCodeFlow(CLIENT_ID);
            } else {
                const jsonData = await getAccessToken(CLIENT_ID, codeParams);
                localStorage.setItem("accessToken", jsonData.access_token);
                localStorage.setItem("refreshToken", jsonData.refresh_token);
                const currTime = DateTime.now();
                const expiration = currTime.plus({ seconds: jsonData.expires_in });
                localStorage.setItem("expiration", expiration.toMillis().toString());
            }
            console.log("Code Params: ", searchParams.get("code"));
            console.log("Access Token: ", localStorage.getItem("accessToken"));
            navigate("/");
        };
        fetchData();
    }, [searchParams, navigate]);

    return <></>;
};

export default SpotifyRequest;
