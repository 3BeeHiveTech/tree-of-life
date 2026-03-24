import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { LayoutResult } from "../../types";

interface TreeEdgesProps {
  edges: LayoutResult["edges"];
}

export function TreeEdges({ edges }: TreeEdgesProps) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    if (edges.length === 0) return null;

    const positions = new Float32Array(edges.length * 6);
    const colors = new Float32Array(edges.length * 6);

    for (let i = 0; i < edges.length; i++) {
      const [x1, y1, z1, x2, y2, z2] = edges[i];
      const offset = i * 6;

      positions[offset] = x1;
      positions[offset + 1] = y1;
      positions[offset + 2] = z1;
      positions[offset + 3] = x2;
      positions[offset + 4] = y2;
      positions[offset + 5] = z2;

      colors[offset] = 0.2;
      colors[offset + 1] = 0.3;
      colors[offset + 2] = 0.5;
      colors[offset + 3] = 0.3;
      colors[offset + 4] = 0.5;
      colors[offset + 5] = 0.8;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [edges]);

  if (!geometry) return null;

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
