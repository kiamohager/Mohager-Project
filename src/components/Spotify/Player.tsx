import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk";
import SpotifyWebApi from "spotify-web-api-js";
import { refreshToken } from "./auth";
import { CLIENT_ID } from "./SpotifyRequest";
import { Box, Button, Grid2 as Grid, IconButton, Typography, Slider } from "@mui/material";
import { motion } from "motion/react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseIcon from "@mui/icons-material/Pause";

type tokenProp = { token: string | null };

const Player = (props: tokenProp) => {
    const state = usePlaybackState();
    const player = useSpotifyPlayer();
    const [volume, setVolume] = useState<number>(100);

    const volumeSlider = (events: Event, newValue: number | number[]) => {
        const value = Array.isArray(newValue) ? newValue[0] : newValue;
        setVolume(value);
        if (player) {
            player.setVolume(value / 100);
        }
    };

    useEffect(() => {
        const execute = async () => {
            const spotifyApi = new SpotifyWebApi();
            const expireDateTime = DateTime.fromMillis(
                parseInt(localStorage.getItem("expiration") as string)
            );
            const expireTime = expireDateTime.minus({ minutes: 5 }).toMillis();
            if (expireTime <= DateTime.now().toMillis()) {
                refreshToken(CLIENT_ID);
            }
            spotifyApi.setAccessToken(props.token);
            const deviceResponse = await spotifyApi.getMyDevices();
            const device = deviceResponse.devices.find(
                (device) => device.name == "kiamohager device"
            );
            console.log(deviceResponse);
            if (!device || !device.id) {
                return;
            }
            await spotifyApi.transferMyPlayback([device.id], { play: true });
        };
        setTimeout(() => {
            execute();
        }, 2000);
    }, [props.token]);

    return (
        props.token && (
            <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                overflow={"hidden"}
                alignItems={"flex-end"}
            >
                <Box display={"flex"} flexDirection={"column"}>
                    <Typography
                        color={"secondary"}
                        variant={"h5"}
                        fontSize={17}
                        fontFamily={"Special Gothic Expanded One"}
                        paddingLeft={1}
                    >
                        {state?.track_window.current_track.name}
                    </Typography>
                    <Box display={"flex"}>
                        <IconButton color="secondary" onClick={() => player?.previousTrack()}>
                            <SkipPreviousIcon />
                        </IconButton>
                        <IconButton
                            color="secondary"
                            onClick={() => {
                                player?.togglePlay();
                            }}
                        >
                            {!state?.paused ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton color="secondary" onClick={() => player?.nextTrack()}>
                            <SkipNextIcon />
                        </IconButton>
                        <Box ml={1} width={100} mt={1}>
                            <Slider
                                value={volume}
                                color="secondary"
                                min={0}
                                max={100}
                                onChange={volumeSlider}
                            />
                        </Box>
                    </Box>
                </Box>
                <motion.img
                    animate={{ rotate: [0, 360] }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear"
                    }}
                    style={{ width: 100, objectFit: "cover", borderRadius: "50%" }}
                    src={state?.track_window.current_track.album.images[2].url}
                />
            </Box>
        )
    );
};

export default Player;
