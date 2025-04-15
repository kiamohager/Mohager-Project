import { Box, Button, Grid2 as Grid, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { DesktopSocialButtonList } from "./Socials";
import useAudio from "./hooks/useAudio";
import goodNightAudio from "../audio/good-night.mp3";
import Run from "./Points";
import useUpdateToken from "./hooks/useUpdateToken";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import Player from "./Spotify/Player";

const Layout = () => {
    const { isPlaying, setIsPlaying, audioElement } = useAudio(goodNightAudio);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const audioPlayer = useRef<HTMLAudioElement>(null);
    const [token, _] = useUpdateToken("accessToken", null);

    const handlePlayPause = () => {
        setIsPlaying((prev) => !prev);

        if (!isPlaying) {
            playAudio();
        } else {
            if (audioPlayer.current) {
                audioPlayer.current.pause();
            }
        }
    };

    const handleSpotifyClick = () => {
        window.location.href = "/callback";
    };

    function playAudio() {
        audioPlayer.current = audioElement;
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        const source = audioContext.createMediaElementSource(audioPlayer.current);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        audioPlayer.current.volume = 0.2;
        audioPlayer.current?.play();
        setAnalyser(analyser);
    }

    return (
        <WebPlaybackSDK
            initialDeviceName={"kiamohager device"}
            getOAuthToken={(cb) => {
                cb(token as string);
            }}
            connectOnInitialized={true}
            initialVolume={0.15}
        >
            <Box display={"flex"} flexDirection={"column"} height={"100vh"} zIndex={55}>
                <Grid container justifyContent={"space-between"}>
                    <Typography p={2} color="white">
                        Kia Mohager
                    </Typography>
                    {!token && (
                        <Button color={"secondary"} onClick={handleSpotifyClick} variant="text">
                            Login with Spotify
                        </Button>
                    )}
                    <Box p={2}>
                        <Button onClick={handlePlayPause} variant="text">
                            {isPlaying ? "Pause" : "Play"}
                        </Button>
                    </Box>
                    <DesktopSocialButtonList />
                </Grid>
                <Box flex={1} />
                <Box p={2}>
                    <Player token={token} />
                </Box>
            </Box>
            <Box
                position={"absolute"}
                height={"100vh"}
                width={"100vw"}
                top={0}
                left={0}
                zIndex={-1000}
                bgcolor={"black"}
            ></Box>
            <Box
                position={"absolute"}
                width={"100vw"}
                height={"100vh"}
                sx={{ background: "linear-gradient(black, 30%, transparent)" }}
                zIndex={-10}
                top={0}
                left={0}
            ></Box>
            <Box
                position={"absolute"}
                width={"100vw"}
                height={"100vh"}
                top={0}
                left={0}
                zIndex={-50}
            >
                <Run analyser={analyser} paused={!isPlaying} />
            </Box>
        </WebPlaybackSDK>
    );
};

export default Layout;
