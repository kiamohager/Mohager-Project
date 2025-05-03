import { Box, Grid2 as Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DesktopSocialButtonList } from "./Socials";
import Run from "./Points";
import Player from "./AudioPlayer/Player";
import useAudioPlayer from "./hooks/useAudioPlayer";
import { useEffect } from "react";

type screenProps = { isSmallScreen: boolean; isMediumScreen: boolean };
const Layout = (props: screenProps) => {
    const {
        isPlaying,
        playAudio,
        pauseAudio,
        skipNext,
        skipPrevious,
        audioElement,
        analyser,
        setIsPlaying,
        currentSong
    } = useAudioPlayer();

    return (
        <>
            <Box display={"flex"} flexDirection={"column"} height={"100vh"} zIndex={55}>
                <Grid container justifyContent={"space-between"}>
                    <Typography p={2} fontFamily={"Special Gothic Expanded One"} color="secondary">
                        Kia Mohager
                    </Typography>
                    <DesktopSocialButtonList />
                </Grid>
                <Box flex={1} />
                <Box m={2}>
                    <Player
                        isSmallScreen={props.isSmallScreen}
                        isMediumScreen={props.isMediumScreen}
                        isPlaying={isPlaying}
                        audio={audioElement}
                        playAudio={playAudio}
                        pauseAudio={pauseAudio}
                        skipNext={skipNext}
                        skipPrevious={skipPrevious}
                        trackTitle={currentSong.title || "Unknown Track"}
                        albumImg={currentSong.albumImg}
                        artist={currentSong.artist}
                    />
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
                <Run analyser={analyser} paused={!isPlaying} isSmallScreen={props.isSmallScreen} />
            </Box>
        </>
    );
};

export default Layout;
