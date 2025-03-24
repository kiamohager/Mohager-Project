import { useEffect, useRef, useState } from "react";

const useAudio = (audioFile: string) => {
  const audioElement = useRef<HTMLAudioElement | null>(new Audio(audioFile));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      if (audioElement.current) {
        audioElement.current.play();
      }
    } else {
      if (audioElement.current) {
        audioElement.current.pause();
      }
    }

    return () => {
      if (audioElement.current) {
        audioElement.current.pause();
      }
    };
  }, [isPlaying]);

  return { isPlaying, setIsPlaying };
};

export default useAudio;
