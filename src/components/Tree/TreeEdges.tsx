import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Edge } from "../../types";

interface TreeEdgesProps {
  edges: Edge[];
  galaxyEdges: Edge[];
}

function buildLineGeometry(edgeList: Edge[], color1: [number, number, number], color2: [number, number, number]) {
  if (edgeList.length === 0) return null;

  const positions = new Float32Array(edgeList.length * 6);
  const colors = new Float32Array(edgeList.length * 6);

  for (let i = 0; i < edgeList.length; i++) {
    const [x1, y1, z1, x2, y2, z2] = edgeList[i];
    const o = i * 6;
    positions[o] = x1; positions[o + 1] = y1; positions[o + 2] = z1;
    positions[o + 3] = x2; positions[o + 4] = y2; positions[o + 5] = z2;
    colors[o] = color1[0]; colors[o + 1] = color1[1]; colors[o + 2] = color1[2];
    colors[o + 3] = color2[0]; colors[o + 4] = color2[1]; colors[o + 5] = color2[2];
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

// Build dashed line: break each edge into segments with gaps
function buildDashedGeometry(edgeList: Edge[], color: [number, number, number], dashLength = 3, gapLength = 3) {
  if (edgeList.length === 0) return null;

  const allPositions: number[] = [];
  const allColors: number[] = [];

  for (const [x1, y1, z1, x2, y2, z2] of edgeList) {
    const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
    const totalLen = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const nx = dx / totalLen, ny = dy / totalLen, nz = dz / totalLen;

    let pos = 0;
    let drawing = true;
    while (pos < totalLen) {
      const segLen = drawing ? dashLength : gapLength;
      const end = Math.min(pos + segLen, totalLen);

      if (drawing) {
        allPositions.push(
          x1 + nx * pos, y1 + ny * pos, z1 + nz * pos,
          x1 + nx * end, y1 + ny * end, z1 + nz * end,
        );
        allColors.push(
          color[0], color[1], color[2],
          color[0] * 0.6, color[1] * 0.6, color[2] * 0.6,
        );
      }

      pos = end;
      drawing = !drawing;
    }
  }

  if (allPositions.length === 0) return null;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(allPositions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(allColors, 3));
  return geo;
}

export function TreeEdges({ edges, galaxyEdges }: TreeEdgesProps) {
  const solidRef = useRef<THREE.LineSegments>(null);
  const dashedRef = useRef<THREE.LineSegments>(null);

  const solidGeo = useMemo(
    () => buildLineGeometry(edges, [0.3, 0.45, 0.7], [0.5, 0.7, 1.0]),
    [edges]
  );

  const dashedGeo = useMemo(
    () => buildDashedGeometry(galaxyEdges, [0.7, 0.8, 1.0], 4, 4),
    [galaxyEdges]
  );

  return (
    <group>
      {/* Internal edges — solid */}
      {solidGeo && (
        <lineSegments ref={solidRef} geometry={solidGeo}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* Galaxy edges — dashed */}
      {dashedGeo && (
        <lineSegments ref={dashedRef} geometry={dashedGeo}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  );
}
