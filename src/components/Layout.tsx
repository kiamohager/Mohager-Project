import { Box, Button, Container, Grid2 as Grid, Typography } from "@mui/material";
import TabComponent from "./Tabs";
import { useState, useEffect } from "react";
import { useTransform, useTime, motion } from "motion/react";
import { Opacity } from "@mui/icons-material";
import Weather from "./Weather";

const Layout = () => {
    const [fadeState, setFadeState] = useState(1);
    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeState(0);
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    const [animationStarted, setAnimationStarted] = useState(1);

    // Use effect to trigger animation after a delay
    useEffect(() => {
      const timer = setTimeout(() => {
    	setAnimationStarted(0); // Start the animation after 3 seconds
      }, 2000); // 3000ms = 3 seconds

      // Cleanup timer on unmount
      return () => clearTimeout(timer);
    }, []);

    return (
        <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
            <Grid>
                <Button variant="contained">
                    <Weather></Weather>
                </Button>
            </Grid>
            <Grid
                container
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={2}
                flexGrow={1}
                bgcolor={"black"}
            >
                <Grid>
                    <motion.div
                        style={{ opacity: 1 }}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: fadeState,
                            transition: { duration: 4, repeat: 1, repeatType: "loop" }
                        }}
                    >
                        <Typography fontSize={100} color={"white"}>
                            Welcome
                        </Typography>
                    </motion.div>
                    <Grid
                        container
                        direction={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <motion.div
                            style={{
                                width: "50px",
                                height: "50px",
                                display: "flex",
                                borderRadius: "0%",
                                backgroundColor: "white"
                            }}
                            animate={{
                                borderRadius: "50%",
                                x: 300,
                                rotate: 720,
                                scale: 0.3,
                                opacity: animationStarted
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 40,
                                duration: 1,
                            }}
                        ></motion.div>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Layout;
