import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import circleImg from "../assets/styles/circle.png";
import { BufferAttribute, PointsMaterial, TextureLoader } from "three";
import { useCallback, useMemo, useRef, useState } from "react";
import { FFT_SIZE } from "./hooks/useAudioPlayer";

type AnalyserProp = { analyser: AnalyserNode | null; paused: boolean; isSmallScreen: boolean };

function Points(props: AnalyserProp) {
    const imgTex = useLoader(TextureLoader, circleImg);
    const bufferRef = useRef<BufferAttribute>(null);
    const materialRef = useRef<PointsMaterial | null>(null);

    const initialT = 0;
    const f = 0.002;
    const initialA = 1.5;

    const [t, setT] = useState(initialT);
    const [a, setA] = useState(initialA);

    const graph = useCallback(
        (x: number, z: number) => {
            return Math.sin(f * (x ** 2 + z ** 2 + t)) * a;
        },
        [t, f, a]
    );

    const count = 100;
    const sep = 3;
    const positions = useMemo(() => {
        const positions = [];

        for (let xi = 0; xi < count; xi++) {
            for (let zi = 0; zi < count; zi++) {
                const x = sep * (xi - count / 2);
                const z = sep * (zi - count / 2);
                const y = graph(x, z);
                positions.push(x, y, z);
            }
        }
        return new Float32Array(positions);
    }, [count, sep, graph]);

    useFrame(() => {
        if (!bufferRef.current) {
            return;
        }

        setT((t) => t + 10);

        const positions = bufferRef.current.array;
        const newArray = new Uint8Array(FFT_SIZE / 2);
        props.analyser?.getByteFrequencyData(newArray);

        const amplitude = newArray.reduce((a, b) => a + b, 0) / newArray.length / 255;
        const adjustedAmp = amplitude * 10;
        const interpolationSpeed = 0.01;

        if (props.paused) {
            setA((prev) => prev + (1.5 - prev) * interpolationSpeed);
        } else {
            setA(adjustedAmp);
        }

        let i = 0;
        for (let xi = 0; xi < count; xi++) {
            for (let zi = 0; zi < count; zi++) {
                const x = sep * (xi - count / 2);
                const z = sep * (zi - count / 2);
                positions[i + 1] = graph(x, z) * a;
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
                ref={materialRef}
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

function AnimationCanvas(props: AnalyserProp) {
    return (
        <Canvas
            camera={{
                position: props.isSmallScreen ? [100, 100, 0] : [100, 100, 0],
                fov: props.isSmallScreen ? 75 : 45
            }}
        >
            <Points {...props} />
        </Canvas>
    );
}

function Run(props: AnalyserProp) {
    return <AnimationCanvas {...props} />;
}

export default Run;
