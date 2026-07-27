import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { prefersReducedMotion, isSmallScreen } from "@/lib/env";
import { useUIStore } from "@/store/uiStore";
import ChestModel from "@/components/three/ChestModel";

function ProgressReporter() {
  const setProgress = useUIStore((s) => s.setProgress);
  useEffect(() => {
    // Geometry is generated synchronously, so the scene is ready once mounted.
    setProgress(100);
  }, [setProgress]);
  return null;
}

/**
 * WebGL stage for the hero. Lighting is a three-point clinical rig plus a
 * locally generated environment (Lightformers, no remote HDR fetch) so the
 * glass lung material has something to refract without a network round-trip.
 */
export default function HeroScene() {
  const reduced = prefersReducedMotion();
  const small = isSmallScreen();

  return (
    <Canvas
      dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, small ? 1.5 : 2)]}
      camera={{ position: [0, 0.1, small ? 6.9 : 5.7], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ProgressReporter />

      {/* Clinical key / fill / rim. */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={2.1} color="#ffffff" />
      <directionalLight position={[-5, 1, 2]} intensity={1.3} color="#22d3ee" />
      <pointLight position={[0, -1.5, 3]} intensity={4} distance={7} color="#2dd4bf" />
      {/* Warm underlight so the heart reads as tissue, not plastic. */}
      <pointLight position={[0.4, 0, 1.6]} intensity={2.2} distance={3.4} color="#fb7185" />

      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 3, 3]} scale={[6, 4, 1]} color="#dff7fb" />
        <Lightformer form="rect" intensity={1.5} position={[-4, 0, 2]} scale={[4, 6, 1]} color="#22d3ee" />
        <Lightformer form="circle" intensity={1.1} position={[3, -2, 2]} scale={3} color="#0891b2" />
      </Environment>

      <ChestModel reduced={reduced} small={small} />

      {!small && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.62} luminanceThreshold={0.42} luminanceSmoothing={0.85} mipmapBlur />
          <Vignette offset={0.32} darkness={0.68} eskil={false} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
