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

    const handleAudio = async (currentIndex: number) => {
        if (audioElement.current) {
            audioElement.current.src = songs[playlist[currentIndex]].audioFile;
            audioElement.current.load();

            setTimeout(() => {
                audioElement.current!.play();
                setIsPlaying(true);
            }, 50);

            return;
        }

        audioElement.current = new Audio(songs[playlist[currentIndex]].audioFile);
        audioElement.current.volume = 0.2;

        const audioContext = new AudioContext();
        const newAnalyser = audioContext.createAnalyser();
        newAnalyser.fftSize = FFT_SIZE;
        const source = audioContext.createMediaElementSource(audioElement.current);
        source.connect(newAnalyser);
        newAnalyser.connect(audioContext.destination);
        setAnalyser(newAnalyser);

        audioElement.current.addEventListener("ended", skipNext);

        audioElement.current.load();
        await audioElement.current.play();
        setIsPlaying(true);
    };

    const playAudio = async () => {
        if (!audioElement.current) {
            handleAudio(0);
        } else {
            await audioElement.current.play();
            setIsPlaying(true);
        }
    };

    const pauseAudio = () => {
        if (audioElement.current) {
            audioElement.current.pause();
        }
        setIsPlaying(false);
    };

    const skipNext = async () => {
        console.log(audioElement.current);
        setCurrentIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % playlist.length;
            handleAudio(nextIndex);
            return nextIndex;
        });
    };

    const skipPrevious = async () => {
        setCurrentIndex((prevIndex) => {
            const lastIndex = prevIndex === 0 ? playlist.length - 1 : prevIndex - 1;
            handleAudio(lastIndex);
            return lastIndex;
        });
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
