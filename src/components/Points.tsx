import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import circleImg from "../assets/styles/circle.png";
import { BufferAttribute, Color, PointsMaterial, TextureLoader } from "three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type AnalyserProp = { analyser: AnalyserNode | null; paused: boolean};

function Points(props: AnalyserProp) {
    const imgTex = useLoader(TextureLoader, circleImg);
    const bufferRef = useRef<BufferAttribute>(null);
    const materialRef = useRef<PointsMaterial | null>(null);

    const initialT = 0
    const initialF = 0.002
    const initialA = 3;

    const [t, setT] = useState(initialT);
    const [f, setF] = useState(initialF);
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

    useEffect(() => {
        if (props.paused) {
            setT(initialT);
            setF(initialF);
            setA(initialA);
        }
    }, [props.paused]);


    useFrame(() => {
        if (!bufferRef.current) {
            return;
        }

        setT((t) => t + 10);

        const positions = bufferRef.current.array;
        const newArray = new Uint8Array(128);
        props.analyser?.getByteFrequencyData(newArray);

        const amplitude = newArray.reduce((a, b) => a + b, 0) / 128 / 255;
        const adjustedAmp = amplitude * 10;

        let i = 0;
        for (let xi = 0; xi < count; xi++) {
            for (let zi = 0; zi < count; zi++) {
                const x = sep * (xi - count / 2);
                const z = sep * (zi - count / 2);
                
                if (!props.paused) {
                    positions[i + 1] = graph(x, z) * (props.analyser ? adjustedAmp : 1);
                    i += 3;
                } else {
                    positions[i + 1] = graph(x, z)
                    i += 3;
                }
            }
        }

        bufferRef.current.needsUpdate = true;
        
        const color = new Color();
        color.setRGB(amplitude*3, amplitude ? 0 : 0.3, 1 - amplitude*3);
        materialRef.current?.color.copy(color);
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
        <Canvas camera={{ position: [100, 100, 0], fov: 45 }}>
            <Points {...props} />
        </Canvas>
    );
}

function Run(props: AnalyserProp) {
    return <AnimationCanvas {...props} />;
}

export default Run;
