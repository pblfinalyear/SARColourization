/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { useTexture, Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ================= SUN ================= */
function Sun() {
  const sunRef = useRef();

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      {/* Sun light */}
      <pointLight intensity={8} position={[30, 0, 10]} color="#ffffff" />

      {/* Sun sphere */}
      <mesh ref={sunRef} position={[30, 0, 10]}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshBasicMaterial color="#ffcc66" />
      </mesh>

      {/* Sun glow */}
      <mesh position={[30, 0, 10]}>
        <sphereGeometry args={[5.5, 64, 64]} />
        <meshBasicMaterial
          color="#ffaa33"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

/* ================= SATELLITE ================= */
function MovingSatellite() {
  const groupRef = useRef();
  const progress = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;

    progress.current += 0.0015;

    const radius = 6;
    const angle = progress.current;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.5; // smaller vertical sweep to match closer orbit
    const z = 2.5; // closer in Z too

    groupRef.current.position.set(x, y, z);
    groupRef.current.rotation.z = -angle;
  });

  useEffect(() => {
    gsap.to(progress, {
      current: 6,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });
  }, []);

  return (
    <group ref={groupRef} scale={0.22}>
      <mesh>
        <cylinderGeometry args={[0.6, 0.6, 2, 32]} />
        <meshStandardMaterial color="#7f7f7f" metalness={0.85} roughness={0.25} />
      </mesh>

      <mesh position={[0, 0, 1.3]}>
        <coneGeometry args={[0.8, 1.2, 32]} />
        <meshStandardMaterial color="#bfbfbf" metalness={0.8} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0, -1.3]}>
        <coneGeometry args={[0.8, 1.2, 32]} />
        <meshStandardMaterial color="#bfbfbf" metalness={0.8} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.05, 16, 100]} />
        <meshStandardMaterial color="#606060" metalness={0.95} roughness={0.2} />
      </mesh>

      <mesh position={[-4, 0, 0]}>
        <boxGeometry args={[6, 0.15, 2]} />
        <meshStandardMaterial color="#eaecef" emissive="#112b66" />
      </mesh>

      <mesh position={[4, 0, 0]}>
        <boxGeometry args={[6, 0.15, 2]} />
        <meshStandardMaterial color="#ebecef" emissive="#112b66" />
      </mesh>

      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color="#999999" metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  );
}

/* ================= EARTH ================= */
function Earth() {
  const earthRef = useRef();
  const cloudsRef = useRef();

  const earthMap = useTexture("/earthmap.jpg");
  const cloudMap = useTexture("/clouds.png");
  const nightMap = useTexture("/nightlights.jpg");

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0004;
    if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0006;
  });

  useEffect(() => {
    if (!earthRef.current) return;

    gsap.to(earthRef.current.rotation, {
      y: "+=" + Math.PI * 4,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });
  }, []);

  return (
    <group position={[0, -0.3, 0]}>
      <ambientLight intensity={0.2} />

      {/* Earth with Night Lights */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[4.2, 128, 128]} />
        <meshStandardMaterial
          map={earthMap}
          emissiveMap={nightMap}
          emissive="#ffffff"
          emissiveIntensity={0.7}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[4.23, 128, 128]} />
        <meshStandardMaterial map={cloudMap} transparent opacity={0.35} />
      </mesh>

      {/* Atmosphere */}
      <mesh>
        <sphereGeometry args={[4.35, 128, 128]} />
        <meshBasicMaterial
          color="#4fc3ff"
          side={THREE.BackSide}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[4.45, 128, 128]} />
        <meshBasicMaterial
          color="#1e90ff"
          side={THREE.BackSide}
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}

/* ================= MAIN SCENE ================= */
export default function EarthScene() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: -1,
      }}
    >
      <Canvas camera={{ position: [0, 0, 13], fov: 45 }}>
        <Stars radius={1200} depth={600} count={30000} factor={4} fade />

        <Sun />
        <Earth />
        <MovingSatellite />
      </Canvas>
    </div>
  );
}