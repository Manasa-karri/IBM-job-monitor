import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";
import { BlochVector } from "@/lib/utils/bloch";

interface BlochSphereProps {
  vector: BlochVector;
  className?: string;
}

function BlochSphereScene({ vector }: { vector: BlochVector }) {
  const vectorRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.005;
    }
  });

  // Coordinate system lines
  const xAxisPoints: [number, number, number][] = [[-1, 0, 0], [1, 0, 0]];
  const yAxisPoints: [number, number, number][] = [[0, -1, 0], [0, 1, 0]];
  const zAxisPoints: [number, number, number][] = [[0, 0, -1], [0, 0, 1]];

  // Bloch vector line
  const vectorPoints: [number, number, number][] = [[0, 0, 0], [vector.x, vector.y, vector.z]];

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      {/* Bloch sphere */}
      <Sphere ref={sphereRef} args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.1} 
          wireframe 
        />
      </Sphere>

      {/* Coordinate axes */}
      <Line
        points={xAxisPoints}
        color="#ef4444"
        lineWidth={2}
        transparent
        opacity={0.7}
      />
      <Line
        points={yAxisPoints}
        color="#22c55e"
        lineWidth={2}
        transparent
        opacity={0.7}
      />
      <Line
        points={zAxisPoints}
        color="#3b82f6"
        lineWidth={2}
        transparent
        opacity={0.7}
      />

      {/* Bloch vector */}
      <Line
        points={vectorPoints}
        color="#f59e0b"
        lineWidth={4}
      />

      {/* Vector endpoint sphere */}
      <Sphere args={[0.05]} position={[vector.x, vector.y, vector.z]}>
        <meshPhongMaterial color="#f59e0b" />
      </Sphere>

      {/* Axis labels */}
      <group>
        {/* X axis label */}
        <mesh position={[1.2, 0, 0]}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        
        {/* Y axis label */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        
        {/* Z axis label */}
        <mesh position={[0, 0, 1.2]}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={0.6}
        rotateSpeed={0.5}
        maxDistance={5}
        minDistance={2}
      />
    </>
  );
}

export function BlochSphere({ vector, className }: BlochSphereProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [2, 2, 2], fov: 45 }}>
        <Suspense fallback={null}>
          <BlochSphereScene vector={vector} />
        </Suspense>
      </Canvas>
      
      {/* Vector coordinates display */}
      <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded p-2 text-xs font-mono">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>X: {vector.x.toFixed(3)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Y: {vector.y.toFixed(3)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Z: {vector.z.toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}