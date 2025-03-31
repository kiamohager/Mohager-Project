import { Box, Button, Grid2 as Grid, Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import Weather from "./Weather";
import { DesktopSocialButtonList } from "./Socials";
import useAudio from "./hooks/useAudio";
import goodNightAudio from "../audio/good-night.mp3";
import Run from "./Points";

const Layout = () => {
    const [fadeState, setFadeState] = useState(1);
    const { isPlaying, setIsPlaying, audioElement } = useAudio(goodNightAudio);

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

    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const audioPlayer = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeState(0);
        }, 200);
        return () => clearTimeout(timer);
    }, []);

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
        <>
            <Box display={"flex"} flexDirection={"column"} height={"100vh"} zIndex={55}>
                <Grid
                    container
                    position={"absolute"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    top={20}
                    left="48%"
                >
                    <Button onClick={handlePlayPause} variant="text">
                        {isPlaying ? "Pause" : "Play"}
                    </Button>
                </Grid>
                <Grid container justifyContent={"space-between"}>
                    <Grid position={"relative"} left="10px" top="20px">
                        <Typography color="white">
                            Kia Mohager
                        </Typography>
                    </Grid> 
                    <Grid position={"absolute"} left="75%" top="25px">
                        <Weather />
                    </Grid>
                    <DesktopSocialButtonList />
                </Grid>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ flexGrow: 1 }}
                ></Grid>
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
        </>
    );
};

export default Layout;
