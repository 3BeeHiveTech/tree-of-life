import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import type { TreeNode } from "../../types";

interface TreeLabelsProps {
  nodes: TreeNode[];
  maxLabels?: number;
}

const RANK_PRIORITY: Record<string, number> = {
  kingdom: 0,
  phylum: 1,
  class: 2,
  order: 3,
  family: 4,
  genus: 5,
  species: 6,
};

const tempVec = new THREE.Vector3();

export function TreeLabels({ nodes, maxLabels = 30 }: TreeLabelsProps) {
  const { camera } = useThree();

  // Show labels for nodes closest to camera AND highest rank
  const visibleNodes = useMemo(() => {
    const cameraPos = camera.position;

    return [...nodes]
      .map((node) => ({
        node,
        score:
          (RANK_PRIORITY[node.rank] ?? 6) * 100 +
          tempVec.set(node.x, node.y, node.z).distanceTo(cameraPos) * 0.1,
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, maxLabels)
      .map((x) => x.node);
  }, [nodes, maxLabels, camera.position.x, camera.position.y, camera.position.z]);

  return (
    <group>
      {visibleNodes.map((node) => (
        <Billboard
          key={node.id}
          position={[node.x, node.y + node.size * 1.8, node.z]}
        >
          <Text
            fontSize={Math.max(node.size * 0.7, 0.3)}
            color={`rgb(${Math.round(node.color[0] * 255)}, ${Math.round(node.color[1] * 255)}, ${Math.round(node.color[2] * 255)})`}
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.03}
            outlineColor="#000000"
            maxWidth={12}
          >
            {node.common_name || node.name}
            {node.has_children && !node.expanded ? " +" : ""}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}
