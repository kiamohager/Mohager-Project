import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import circleImg from "../assets/styles/circle.png";
import { Box, Grid2 as Grid } from "@mui/material";
import { BufferAttribute, TextureLoader } from "three";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";

function Points() {
    const imgTex = useLoader(TextureLoader, circleImg);
    const bufferRef = useRef<BufferAttribute>(null);

    const [t, setT] = useState(0);
    const [f, setF] = useState(0.002);
    const [a, setA] = useState(3);
    
    const graph = useCallback((x: number, z: number) => {
      return Math.sin(f * (x ** 2 + z ** 2 + t)) * a;
    }, [t, f, a])
  

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

    useFrame(() => {
        if (!bufferRef.current) {
            return;
        }

        setT(t => t + 10);
        
        const positions = bufferRef.current.array;
    
        let i = 0;
        for (let xi = 0; xi < count; xi++) {
          for (let zi = 0; zi < count; zi++) {
            let x = sep * (xi - count / 2);
            let z = sep * (zi - count / 2);
    
            positions[i + 1] = graph(x, z);
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
                color={0x00AAFF}
                size={0.5}
                sizeAttenuation
                transparent={false}
                alphaTest={0.5}
                opacity={1.0}
            />
        </points>
    );
}

function AnimationCanvas() {
    return (
        <Canvas camera={{ position: [100, 80, 0], fov: 45 }}>
            <Points />
        </Canvas>
    );
}

function Run() {
    return (
        <AnimationCanvas />
    );
}

export default Run;
