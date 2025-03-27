import { Box, Button, Grid2 as Grid, Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import Weather from "./Weather";
import { DesktopSocialButtonList } from "./Socials";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import useAudio from "./hooks/useAudio";
import goodNightAudio from "../audio/good-night.mp3";
import Run from "./Points";
import circleImg from "../assets/styles/circle.png";
import { TextureLoader } from "three";
import { Suspense, useMemo } from "react";

const Layout = () => {
    const [fadeState, setFadeState] = useState(1);
    const audioFile = goodNightAudio;
    const { isPlaying, setIsPlaying } = useAudio(audioFile);

    const handlePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeState(0);
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Box display={"flex"} flexDirection={"column"} height={"100vh"} zIndex={55}>
                <Grid container justifyContent={"space-between"}>
                    <Button variant="text">
                        <Weather />
                    </Button>
                    <DesktopSocialButtonList />
                </Grid>
                <Grid container justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
                    <Button onClick={handlePlayPause} variant="contained" color="primary">
                        {isPlaying ? "Pause Audio" : "Play Audio"}
                    </Button>
                </Grid>
                <Grid
                    container
                    direction={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    spacing={2}
                    flexGrow={1}
                >
                    <Grid>
                        <motion.div
                            style={{ opacity: 1 }}
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: fadeState,
                                transition: { duration: 4, repeatType: "loop" }
                            }}
                        >
                            <Typography fontSize={100} color={"white"}>
                                Welcome
                            </Typography>
                        </motion.div>
                    </Grid>
                </Grid>
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
            <Box position={"absolute"} width={"100vw"} height={"100vh"} top={0} left={0} zIndex={-50}>
                <Run />
            </Box>
        </>
    );
};

// render(<Layout />, document.getElementById("root"));

export default Layout;
