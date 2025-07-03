import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#111" />
    </mesh>
  );
}

function Tree() {
  const { scene } = useGLTF('/tree_ps1psx_style.glb');
  return <primitive object={scene} position={[2, 0, -5]} scale={0.5} />;
}

function MarkerCube() {
  return (
    <mesh position={[-2, 0.5, -6]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

function Flashlight() {
  const { camera } = useThree();
  const lightRef = useRef();
  const targetRef = useRef(new THREE.Object3D());

  useFrame(() => {
    if (lightRef.current) {
      const dir = camera.getWorldDirection(new THREE.Vector3());
      lightRef.current.position.copy(camera.position);
      targetRef.current.position.copy(camera.position.clone().add(dir));
      lightRef.current.target.position.copy(targetRef.current.position);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        angle={0.3}
        distance={10}
        intensity={3}
        penumbra={0.5}
        castShadow
      />
      <primitive object={targetRef.current} />
    </>
  );
}



function Player() {
  const { camera } = useThree();
  const keys = useRef({});
  const speed = 5;

  // Listen for WASD input
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const direction = new THREE.Vector3();

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    right.crossVectors(forward, camera.up);
    right.y = 0;
    right.normalize();

    if (keys.current['w']) direction.add(forward);
    if (keys.current['s']) direction.sub(forward);
    if (keys.current['a']) direction.sub(right);
    if (keys.current['e']) direction.add(right);

    direction.normalize().multiplyScalar(speed * delta);
    camera.position.add(direction);

    camera.position.y = 1.5;
  });

  return null;
}



function SceneCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.5, 3], fov: 75 }}
    >
      <fog attach="fog" args={['#000000', 10, 30]} />
      <ambientLight intensity={0.05} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} castShadow />
      <Suspense fallback={null}>
        <Ground />
        <Tree />
        <MarkerCube />
        <Flashlight />
        <Player />
      </Suspense>
      <PointerLockControls />
    </Canvas>
  );
}

export default function Scene() {
  return (
    <div style={{ height: '100vh', background: '#000' }}>
      <SceneCanvas />
    </div>
  );
}
