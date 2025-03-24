import { Box, Button, Grid2 as Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Weather from "./Weather";
import { DesktopSocialButtonList } from "./Socials";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import useAudio from "./hooks/Audio";
import goodNightAudio from "../audio/good-night.mp3"

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
        <Box display={"flex"} flexDirection={"column"} height={"100vh"} bgcolor={"black"}>
            <Grid container justifyContent={"space-between"}>
                <Button variant="text">
                    <Weather />
                </Button>
                <DesktopSocialButtonList />
            </Grid>

            <Grid>
                <Canvas>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 10]} intensity={1} />
                    <OrbitControls />
                </Canvas>
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
    );
};

export default Layout;
