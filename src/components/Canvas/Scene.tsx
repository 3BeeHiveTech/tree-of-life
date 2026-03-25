import { Canvas } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { TreeNodes } from "../Tree/TreeNodes";
import { TreeEdges } from "../Tree/TreeEdges";
import { TreeLabels } from "../Tree/TreeLabels";
import { CameraController } from "./CameraController";
import type { LayoutResult } from "../../types";

interface SceneProps {
  layout: LayoutResult;
  onExpand: (nodeId: number) => void;
}

export function Scene({ layout, onExpand }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [120, 80, 120], fov: 50, near: 0.1, far: 2000 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{ background: "#050510" }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[20, 30, 10]} intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={0.6} color="#4488ff" />
      <pointLight position={[-15, 5, 15]} intensity={0.3} color="#ff8844" />

      <Stars
        radius={800}
        depth={300}
        count={5000}
        factor={4}
        saturation={0.3}
        fade
        speed={0.5}
      />

      <Sparkles
        count={200}
        scale={80}
        size={2}
        speed={0.3}
        opacity={0.4}
        color="#4488ff"
      />

      <TreeEdges edges={layout.edges} />
      <TreeNodes nodes={layout.nodes} onExpand={onExpand} />
      <TreeLabels nodes={layout.nodes} />

      <CameraController />

      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0005, 0.0005)}
        />
        <Vignette darkness={0.7} offset={0.3} />
      </EffectComposer>
    </Canvas>
  );
}
