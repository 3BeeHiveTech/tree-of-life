import { useRef, useEffect, useCallback } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { TreeNode } from "../../types";
import { useTreeStore } from "../../stores/tree";
import { getNodeHDRColor } from "../../utils/colors";

interface TreeNodesProps {
  nodes: TreeNode[];
  onExpand: (nodeId: number) => void;
}

const MAX_INSTANCES = 50000;
const tempMatrix = new THREE.Matrix4();
const tempColor = new THREE.Color();
const tempVec = new THREE.Vector3();

// Custom shader for per-instance glowing orbs
const orbVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vColor;

  void main() {
    vColor = instanceColor.rgb;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const orbFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vColor;

  void main() {
    // Fresnel rim glow — brighter at edges
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = 1.0 - abs(dot(viewDir, vNormal));
    fresnel = pow(fresnel, 2.0);

    // Core color with radial gradient (brighter center)
    float centerGlow = pow(max(dot(viewDir, vNormal), 0.0), 1.0);

    // Combine: soft core + subtle rim
    vec3 core = vColor * centerGlow * 0.8;
    vec3 rim = vColor * fresnel * 0.6;
    vec3 ambient = vColor * 0.12;

    vec3 finalColor = core + rim + ambient;

    // Subtle inner light variation
    float sparkle = sin(dot(vNormal.xy, vec2(12.9898, 78.233))) * 0.05 + 0.95;
    finalColor *= sparkle;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Halo/glow sprite shader
const haloVertexShader = /* glsl */ `
  varying vec3 vColor;

  void main() {
    vColor = instanceColor.rgb;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const haloFragmentShader = /* glsl */ `
  varying vec3 vColor;

  void main() {
    // Circular gradient from center
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float dist = length(uv);
    if (dist > 1.0) discard;

    // Soft radial falloff
    float alpha = pow(1.0 - dist, 3.0) * 0.4;
    vec3 color = vColor * 0.6;

    gl_FragColor = vec4(color, alpha);
  }
`;

export function TreeNodes({ nodes, onExpand }: TreeNodesProps) {
  const orbRef = useRef<THREE.InstancedMesh>(null);
  const haloRef = useRef<THREE.InstancedMesh>(null);
  const hoveredRef = useRef<number | null>(null);
  const { selectNode, setHoveredNode } = useTreeStore();


  // Update instances when nodes change
  useEffect(() => {
    const orb = orbRef.current;
    const halo = haloRef.current;
    if (!orb || nodes.length === 0) return;

    const count = Math.min(nodes.length, MAX_INSTANCES);

    for (let i = 0; i < count; i++) {
      const node = nodes[i];
      const hdrColor = getNodeHDRColor(node.color, node.rank);

      // Orb sphere
      const scale = node.size;
      tempMatrix.makeTranslation(node.x, node.y, node.z);
      tempMatrix.scale(tempVec.set(scale, scale, scale));
      orb.setMatrixAt(i, tempMatrix);
      tempColor.setRGB(hdrColor[0], hdrColor[1], hdrColor[2]);
      orb.setColorAt(i, tempColor);

      // Halo (bigger, same position)
      if (halo) {
        const haloScale = scale * 2.5;
        tempMatrix.makeTranslation(node.x, node.y, node.z);
        tempMatrix.scale(tempVec.set(haloScale, haloScale, haloScale));
        halo.setMatrixAt(i, tempMatrix);
        // Dimmer color for halo
        tempColor.setRGB(hdrColor[0] * 0.4, hdrColor[1] * 0.4, hdrColor[2] * 0.4);
        halo.setColorAt(i, tempColor);
      }
    }

    // Zero out unused
    for (let i = count; i < MAX_INSTANCES; i++) {
      tempMatrix.makeScale(0, 0, 0);
      orb.setMatrixAt(i, tempMatrix);
      if (halo) halo.setMatrixAt(i, tempMatrix);
    }

    orb.instanceMatrix.needsUpdate = true;
    if (orb.instanceColor) orb.instanceColor.needsUpdate = true;
    orb.count = count;

    if (halo) {
      halo.instanceMatrix.needsUpdate = true;
      if (halo.instanceColor) halo.instanceColor.needsUpdate = true;
      halo.count = count;
    }
  }, [nodes]);

  // Animate only selected/hovered — not all every frame
  useFrame(() => {
    const orb = orbRef.current;
    if (!orb) return;

    const selectedNode = useTreeStore.getState().selectedNode;
    const hovered = hoveredRef.current;

    if (selectedNode) {
      const idx = nodes.findIndex((n) => n.id === selectedNode.id);
      if (idx >= 0) {
        const node = nodes[idx];
        const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.15;
        const scale = node.size * 1.8 * pulse;
        tempMatrix.makeTranslation(node.x, node.y, node.z);
        tempMatrix.scale(tempVec.set(scale, scale, scale));
        orb.setMatrixAt(idx, tempMatrix);
        orb.instanceMatrix.needsUpdate = true;
      }
    }

    if (hovered !== null && hovered < nodes.length) {
      const node = nodes[hovered];
      const scale = node.size * 1.5;
      tempMatrix.makeTranslation(node.x, node.y, node.z);
      tempMatrix.scale(tempVec.set(scale, scale, scale));
      orb.setMatrixAt(hovered, tempMatrix);
      orb.instanceMatrix.needsUpdate = true;
    }
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (e.instanceId === undefined || e.instanceId >= nodes.length) return;
      const node = nodes[e.instanceId];
      selectNode(node);
      if (node.has_children) {
        onExpand(node.id);
      }
    },
    [nodes, selectNode, onExpand]
  );

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (e.instanceId !== undefined && e.instanceId < nodes.length) {
        hoveredRef.current = e.instanceId;
        setHoveredNode(nodes[e.instanceId]);
        document.body.style.cursor = "pointer";
      }
    },
    [nodes, setHoveredNode]
  );

  const handlePointerOut = useCallback(() => {
    const orb = orbRef.current;
    if (orb && hoveredRef.current !== null && hoveredRef.current < nodes.length) {
      const node = nodes[hoveredRef.current];
      const scale = node.size;
      tempMatrix.makeTranslation(node.x, node.y, node.z);
      tempMatrix.scale(tempVec.set(scale, scale, scale));
      orb.setMatrixAt(hoveredRef.current, tempMatrix);
      orb.instanceMatrix.needsUpdate = true;
    }
    hoveredRef.current = null;
    setHoveredNode(null);
    document.body.style.cursor = "default";
  }, [nodes, setHoveredNode]);

  if (nodes.length === 0) return null;

  return (
    <group>
      {/* Halo glow layer — behind the orbs, additive blended */}
      <instancedMesh
        ref={haloRef}
        args={[undefined, undefined, Math.min(MAX_INSTANCES, Math.max(nodes.length, 1))]}
        frustumCulled={false}
        renderOrder={-1}
      >
        <sphereGeometry args={[1, 8, 6]} />
        <shaderMaterial
          vertexShader={haloVertexShader}
          fragmentShader={haloFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </instancedMesh>

      {/* Main orb layer — custom fresnel shader */}
      <instancedMesh
        ref={orbRef}
        args={[undefined, undefined, Math.min(MAX_INSTANCES, Math.max(nodes.length, 1))]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 24, 16]} />
        <shaderMaterial
          vertexShader={orbVertexShader}
          fragmentShader={orbFragmentShader}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
