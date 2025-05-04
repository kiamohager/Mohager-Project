// components/Player.tsx
import { Box, Icon, IconButton, Slider, Typography, useTheme } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Duration } from "luxon";

type audioProp = {
    isSmallScreen: boolean;
    isMediumScreen: boolean;
    isPlaying: boolean;
    audio: HTMLAudioElement | null;
    playAudio: () => void;
    pauseAudio: () => void;
    skipNext: () => void;
    skipPrevious: () => void;
    trackTitle: string;
    albumImg: string | null;
    artist: string;
};

const Player = (props: audioProp) => {
    const [volume, setVolume] = useState<number>(30);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const theme = useTheme();

    useEffect(() => {
        const audio = props.audio;
        if (!audio) {
            return;
        }

        const onLoadedMetadata = () => setDuration(audio.duration);
        const onTimeUpdate = () => setCurrentTime(audio.currentTime);

        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("timeupdate", onTimeUpdate);

        return () => {
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("timeupdate", onTimeUpdate);
        };
    }, [props.audio]);

    useEffect(() => {
        if (props.audio) {
            props.audio.volume = volume / 100 / 5;
        }
    }, [props.audio, volume]);

    if (props.isSmallScreen) {
        return (
            <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                overflow={"hidden"}
                alignItems={"flex-end"}
            >
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    overflow={"hidden"}
                    alignItems={"flex-start"}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                    >
                        <Box display={"flex"} flexDirection={"column"} width={100}>
                            <Typography
                                color={"secondary"}
                                variant={"h5"}
                                fontSize={13}
                                fontFamily={"Special Gothic Expanded One"}
                                paddingLeft={1}
                            >
                                {props.trackTitle}
                            </Typography>
                            <Typography
                                color="neutral"
                                variant={"h5"}
                                fontSize={8}
                                fontFamily={"Special Gothic Expanded One"}
                                paddingLeft={1}
                            >
                                {props.artist}
                            </Typography>
                            <Box display={"flex"} alignItems={"center"}>
                                <IconButton
                                    sx={{ color: "neutral.light" }}
                                    onClick={props.skipPrevious}
                                >
                                    <SkipPreviousIcon />
                                </IconButton>
                                <IconButton
                                    sx={{ color: "neutral.light" }}
                                    onClick={props.isPlaying ? props.pauseAudio : props.playAudio}
                                >
                                    {props.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                                </IconButton>
                                <IconButton
                                    sx={{ color: "neutral.light" }}
                                    onClick={props.skipNext}
                                >
                                    <SkipNextIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                    >
                        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                            <Box display={"flex"} width={40}>
                                <Typography
                                    color="white"
                                    fontFamily={"Special Gothic Expanded One"}
                                    fontSize={13}
                                >
                                    {Duration.fromObject({ seconds: currentTime }).toFormat("m:ss")}
                                </Typography>
                            </Box>
                            <Slider
                                value={currentTime}
                                color="secondary"
                                min={0}
                                max={duration}
                                size={"small"}
                                onChange={(_e, value) => {
                                    setCurrentTime(value as number);
                                    if (props.audio) {
                                        props.audio.currentTime = value as number;
                                    }
                                }}
                                sx={{
                                    width: 100,
                                    ml: 1,
                                    mr: 1,
                                    "& .MuiSlider-thumb": {
                                        width: 8,
                                        height: 8,
                                        color: "neutral.light"
                                    },
                                    "& .MuiSlider-track": {
                                        color: "secondary.main"
                                    },
                                    "& .MuiSlider-rail": {
                                        color: "neutral.light"
                                    }
                                }}
                            />
                            <Box display={"flex"} justifyContent={"flex-end"} width={40}>
                                <Typography
                                    color="white"
                                    fontFamily={"Special Gothic Expanded One"}
                                    fontSize={13}
                                >
                                    {Duration.fromObject({ seconds: duration }).toFormat("m:ss")}
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>
                </Box>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                >
                    <Box display={"flex"} width={80} justifyContent={"flex-end"}>
                        <motion.img
                            animate={{ rotate: [0, 360] }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "linear"
                            }}
                            style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: "50%",
                                border: props.albumImg ? "1px solid white" : "none",
                                marginTop: "160px"
                            }}
                            src={props.albumImg ?? undefined}
                        />
                    </Box>
                </motion.div>
            </Box>
        );
    } else {
        return (
            <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                overflow={"hidden"}
                alignItems={"flex-end"}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                >
                    <Box
                        display={"flex"}
                        flexDirection={"column"}
                        width={props.isMediumScreen ? 100 : 300}
                    >
                        <Typography
                            color="secondary"
                            variant={"h5"}
                            fontSize={17}
                            fontFamily={"Special Gothic Expanded One"}
                            paddingLeft={1}
                        >
                            {props.trackTitle}
                        </Typography>
                        <Typography
                            color="neutral"
                            variant={"h5"}
                            fontSize={10}
                            fontFamily={"Special Gothic Expanded One"}
                            paddingLeft={1}
                        >
                            {props.artist}
                        </Typography>
                        <Box display={"flex"} alignItems={"center"}>
                            <IconButton
                                sx={{ color: "neutral.light" }}
                                onClick={props.skipPrevious}
                            >
                                <SkipPreviousIcon />
                            </IconButton>
                            <IconButton
                                sx={{ color: "neutral.light" }}
                                onClick={props.isPlaying ? props.pauseAudio : props.playAudio}
                            >
                                {props.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                            <IconButton sx={{ color: "neutral.light" }} onClick={props.skipNext}>
                                <SkipNextIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                >
                    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                        <Box display={"flex"} width={40}>
                            <Typography
                                color="white"
                                fontFamily={"Special Gothic Expanded One"}
                                fontSize={13}
                            >
                                {Duration.fromObject({ seconds: currentTime }).toFormat("m:ss")}
                            </Typography>
                        </Box>
                        <Slider
                            value={currentTime}
                            min={0}
                            max={duration}
                            size={"small"}
                            onChange={(_e, value) => {
                                setCurrentTime(value as number);
                                if (props.audio) {
                                    props.audio.currentTime = value as number;
                                }
                            }}
                            sx={{
                                width: props.isMediumScreen ? 200 : 500,
                                ml: 1,
                                mr: 1,
                                "& .MuiSlider-thumb": {
                                    width: 8,
                                    height: 8,
                                    color: "neutral.light"
                                },
                                "& .MuiSlider-track": {
                                    color: "secondary.main"
                                },
                                "& .MuiSlider-rail": {
                                    color: "neutral.light"
                                }
                            }}
                        />
                        <Box display={"flex"} justifyContent={"flex-end"} width={40}>
                            <Typography
                                color="white"
                                fontFamily={"Special Gothic Expanded One"}
                                fontSize={13}
                            >
                                {Duration.fromObject({ seconds: duration }).toFormat("m:ss")}
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                >
                    <Box
                        display={"flex"}
                        width={props.isMediumScreen ? 100 : 300}
                        justifyContent={"flex-end"}
                    >
                        <motion.img
                            animate={{ rotate: [0, 360] }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "linear"
                            }}
                            style={{
                                width: 100,
                                height: 100,
                                objectFit: "cover",
                                borderRadius: "50%",
                                border: props.albumImg ? "1px solid white" : "none",
                                marginTop: "120px"
                            }}
                            src={props.albumImg ?? undefined}
                        />
                        <Box
                            display={"flex"}
                            alignItems={"center"}
                            flexDirection={"column"}
                            marginTop={14}
                        >
                            <Icon sx={{ color: "neutral.light" }}>
                                {volume === 0 ? (
                                    <VolumeOffIcon />
                                ) : volume <= 50 ? (
                                    <VolumeDownIcon />
                                ) : (
                                    <VolumeUpIcon />
                                )}
                            </Icon>
                            <Box
                                height={90}
                                display={"flex"}
                                alignItems={"center"}
                                flexDirection={"column"}
                                paddingTop={1}
                                paddingBottom={1}
                            >
                                <Slider
                                    value={volume}
                                    min={0}
                                    max={100}
                                    step={1}
                                    size={"small"}
                                    orientation="vertical"
                                    onChange={(_e, value) => setVolume(value as number)}
                                    sx={{
                                        "& .MuiSlider-thumb": {
                                            color: "neutral.light"
                                        },
                                        "& .MuiSlider-track": {
                                            color: "neutral.light"
                                        },
                                        "& .MuiSlider-rail": {
                                            color: "neutral.light"
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </motion.div>
            </Box>
        );
    }
};

export default Player;
