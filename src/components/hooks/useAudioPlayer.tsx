// hooks/useAudioPlayer.ts
import { useState, useEffect, useRef } from "react";
import { playlist, songs } from "../AudioPlayer/Songs";

export const FFT_SIZE = 256;

const useAudioPlayer = () => {
    const audioElement = useRef<HTMLAudioElement | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

    const currentSong = songs[playlist[currentIndex]];

    useEffect(() => {
        if (audioElement.current) {
            audioElement.current.pause();
        }

        audioElement.current = new Audio(currentSong.audioFile || "");
        audioElement.current.volume = 0.2;

        const audioContext = new AudioContext();
        const newAnalyser = audioContext.createAnalyser();
        newAnalyser.fftSize = FFT_SIZE;
        const source = audioContext.createMediaElementSource(audioElement.current);
        source.connect(newAnalyser);
        newAnalyser.connect(audioContext.destination);
        setAnalyser(newAnalyser);

        const handleEnded = () => {
            skipNext();
            setTimeout(() => {
                playAudio();
            }, 10);
        };

        audioElement.current.addEventListener("ended", handleEnded);

        audioElement.current
            .play()
            .then(() => {
                setIsPlaying(true);
            })
            .catch((err) => {
                console.error("Playback failed:", err);
            });

        return () => {
            if (audioElement.current) {
                audioElement.current.pause();
                audioElement.current.removeEventListener("ended", handleEnded);
                audioElement.current = null;
            }
        };
    }, [currentIndex, currentSong]);

    const playAudio = () => {
        if (audioElement.current) {
            try {
                audioElement.current.play();
                setIsPlaying(true);
            } catch (err) {
                console.error("Playback failed:", err);
            }
        }
    };

    const pauseAudio = () => {
        if (audioElement.current) {
            audioElement.current.pause();
        }
        setIsPlaying(false);
    };

    const skipNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % playlist.length);
        playAudio();
    };

    const skipPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? playlist.length - 1 : prevIndex - 1));
        playAudio();
    };

    return {
        isPlaying,
        playAudio,
        pauseAudio,
        skipNext,
        skipPrevious,
        audioElement: audioElement.current,
        analyser,
        setIsPlaying,
        currentSong
    };
};

export default useAudioPlayer;
