import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import circleImg from "../assets/styles/circle.png";
import { Box, Grid2 as Grid } from "@mui/material";
import { BufferAttribute, TextureLoader } from "three";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import goodNightAudio from "../audio/good-night.mp3";
type AudioProps = { audioElement: HTMLAudioElement };

function Points(props: AudioProps) {
    const imgTex = useLoader(TextureLoader, circleImg);
    const bufferRef = useRef<BufferAttribute>(null);
    const analyser = useRef<AnalyserNode>(null);
    // const audioSourceRef = useRef<MediaElementAudioSourceNode>(null);

    useEffect(() => {
        // if (analyser.current) {
        //     return;
        // }
        const audio = new Audio(goodNightAudio);
        const audioContext = new AudioContext();
        analyser.current = audioContext.createAnalyser();
        analyser.current.fftSize = 256;

        const analyserBufferLength = analyser.current.frequencyBinCount;
        // console.log(dataArray.current);

        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser.current);
        analyser.current.connect(audioContext.destination);
        setTimeout(()=> audio.play(), 3000);
        // console.log(anal);
    }, []);

    const [t, setT] = useState(0);
    const [f, setF] = useState(0.002);
    const [a, setA] = useState(3);

    const graph = useCallback(
        (x: number, z: number) => {
            return Math.sin(f * (x ** 2 + z ** 2 + t)) * a;
        },
        [t, f, a]
    );

    const count = 100;
    const sep = 3;
    let positions = useMemo(() => {
        let positions = [];

        for (let xi = 0; xi < count; xi++) {
            for (let zi = 0; zi < count; zi++) {
                let x = sep * (xi - count / 2);
                let z = sep * (zi - count / 2);
                let y = graph(x, z);
                positions.push(x, y, z);
            }
        }
        return new Float32Array(positions);
    }, [count, sep, graph]);
    // console.log(dataArray);

    useFrame(() => {
        if (!bufferRef.current || !analyser.current) {
            return;
        }

        setT((t) => t + 10);

        const positions = bufferRef.current.array;
        // analyser.current.getByteFrequencyData(dataArray.current);

        const newArray = new Uint8Array(128);
        analyser.current?.getByteFrequencyData(newArray);
        console.log(newArray);

        //console.log(analyser.current);
        //console.log(audioSourceRef.current);
        const amplitude = newArray[32] / 255;
        const adjustedAmp = amplitude * 10;
        // console.log(adjustedAmp);

        let i = 0;
        for (let xi = 0; xi < count; xi++) {
            for (let zi = 0; zi < count; zi++) {
                let x = sep * (xi - count / 2);
                let z = sep * (zi - count / 2);

                positions[i + 1] = graph(x, z) * adjustedAmp;
                i += 3;
            }
        }

        bufferRef.current.needsUpdate = true;
    });

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    ref={bufferRef}
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                map={imgTex}
                color={0x00aaff}
                size={0.5}
                sizeAttenuation
                transparent={false}
                alphaTest={0.5}
                opacity={1.0}
            />
        </points>
    );
}

function AnimationCanvas(props: AudioProps) {
    return (
        <Canvas camera={{ position: [100, 100, 0]/*position: [100, 80, 0]*/, fov: 45 }}>
            <Points {...props} />
        </Canvas>
    );
}

function Run(props: AudioProps) {
    return <AnimationCanvas {...props} />;
}

export default Run;
