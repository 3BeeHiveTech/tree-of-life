import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useTreeStore } from "../../stores/tree";

export function CameraController() {
  const controlsRef = useRef<CameraControls>(null);
  const cameraTarget = useTreeStore((s) => s.cameraTarget);
  const setCameraDistance = useTreeStore((s) => s.setCameraDistance);
  const prevTarget = useRef<[number, number, number] | null>(null);

  // Fly-to on target change
  useEffect(() => {
    if (!controlsRef.current || !cameraTarget) return;
    if (
      prevTarget.current &&
      prevTarget.current[0] === cameraTarget[0] &&
      prevTarget.current[1] === cameraTarget[1] &&
      prevTarget.current[2] === cameraTarget[2]
    )
      return;

    prevTarget.current = cameraTarget;
    const [x, y, z] = cameraTarget;

    controlsRef.current.setLookAt(
      x + 8,
      y + 6,
      z + 8,
      x,
      y,
      z,
      true
    );
  }, [cameraTarget]);

  // Track camera distance for semantic zoom
  useFrame(() => {
    if (!controlsRef.current) return;
    const dist = controlsRef.current.distance;
    setCameraDistance(dist);
  });

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={3}
      maxDistance={200}
      dollySpeed={0.5}
      truckSpeed={1}
      smoothTime={0.5}
    />
  );
}
