import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildRibs,
  buildSpine,
  buildSternum,
  buildClavicles,
  buildLung,
  buildAirways,
  buildHeart,
  buildDiaphragm,
  RIB_PAIRS,
} from "./anatomy";
import { heroScroll, clamp01, smoothstep } from "@/lib/scrollSignal";

/** Resting respiratory rate — 14 breaths/min. */
const BREATH_PERIOD = 60 / 14;
/** Resting heart rate — 72 bpm. */
const BEAT_PERIOD = 60 / 72;

/**
 * Per-side lung placement. `scale` is [x, y, z]; a negative x mirrors the
 * geometry (built with its medial face towards +x) onto the left side.
 */
const LUNGS = [
  { side: -1, y: 0.14, scale: [1, 1.46, 1] as const }, // right: wider, shorter
  { side: 1, y: 0.1, scale: [-0.9, 1.56, 0.96] as const }, // left: taller, notched
];

interface Props {
  reduced: boolean;
  small: boolean;
}

/**
 * The scroll-driven thoracic sequence.
 *
 * Phase 1 (0.00–0.20)  intact chest, breathing, slow rotation
 * Phase 2 (0.18–0.55)  rib cage fans open on the costovertebral joints
 * Phase 3 (0.42–0.78)  bone drops to an X-ray shell, lungs turn to glass
 * Phase 4 (0.62–1.00)  bronchial tree lights up and the camera pushes in
 */
export default function ChestModel({ reduced, small }: Props) {
  /* ── geometry, built once per detail level ── */
  const geo = useMemo(() => {
    const ribs = buildRibs(small ? 30 : 46).map((r) => {
      // Re-origin each rib on its costovertebral joint so the fan animation
      // hinges exactly where a real rib does.
      const g = r.geometry.clone();
      g.translate(-r.side * 0.09, -r.pivotY, 0.5);
      r.geometry.dispose();
      return { ...r, geometry: g };
    });
    return {
      ribs,
      spine: buildSpine(),
      sternum: buildSternum(),
      clavicles: buildClavicles(),
      lung: buildLung(-1, small ? 30 : 46),
      airways: buildAirways(small ? 4 : 5, small ? 8 : 12),
      heart: buildHeart(small ? 20 : 32),
      diaphragm: buildDiaphragm(),
    };
  }, [small]);

  /* ── materials, shared across meshes and mutated in the frame loop ── */
  const mat = useMemo(() => {
    const bone = new THREE.MeshPhysicalMaterial({
      color: "#e6f1f3",
      emissive: new THREE.Color("#2dd4bf"),
      emissiveIntensity: 0.04,
      roughness: 0.42,
      metalness: 0.08,
      clearcoat: 0.55,
      clearcoatRoughness: 0.35,
      transparent: true,
      opacity: 1,
    });
    return {
      bone,
      lung: new THREE.MeshPhysicalMaterial({
        color: "#0e6f6a",
        emissive: new THREE.Color("#2dd4bf"),
        emissiveIntensity: 0.12,
        roughness: 0.16,
        metalness: 0,
        transmission: small ? 0 : 0.5,
        thickness: 1.1,
        ior: 1.34,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      }),
      lungWire: new THREE.MeshBasicMaterial({
        color: "#67e8f9",
        wireframe: true,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide,
      }),
      airway: new THREE.MeshStandardMaterial({
        color: "#22d3ee",
        emissive: new THREE.Color("#22d3ee"),
        emissiveIntensity: 0.35,
        roughness: 0.28,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35,
      }),
      heart: new THREE.MeshStandardMaterial({
        color: "#7f1d3a",
        emissive: new THREE.Color("#fb7185"),
        emissiveIntensity: 0.3,
        roughness: 0.35,
        transparent: true,
        opacity: 0.5,
      }),
      diaphragm: new THREE.MeshBasicMaterial({
        color: "#2dd4bf",
        wireframe: true,
        transparent: true,
        opacity: 0.06,
      }),
      scan: new THREE.MeshBasicMaterial({
        color: "#67e8f9",
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      dust: new THREE.PointsMaterial({
        size: small ? 0.02 : 0.014,
        color: "#7dd3fc",
        transparent: true,
        opacity: 0.2,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    };
  }, [small]);

  // Free GPU memory when the detail level changes or the hero unmounts.
  useEffect(
    () => () => {
      Object.values(mat).forEach((m) => m.dispose());
      geo.ribs.forEach((r) => r.geometry.dispose());
      [geo.spine, geo.sternum, geo.clavicles, geo.lung, geo.airways, geo.heart, geo.diaphragm].forEach(
        (g) => g.dispose(),
      );
    },
    [mat, geo],
  );

  /* ── refs into the scene graph ── */
  const root = useRef<THREE.Group>(null);
  const ribRefs = useRef<(THREE.Group | null)[]>([]);
  const lungGroup = useRef<THREE.Group>(null);
  const heartRef = useRef<THREE.Mesh>(null);
  const diaphragmRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);

  /* ── inhaled-air particle field ── */
  const dust = useMemo(() => {
    const count = small ? 260 : 620;
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.random() * 1.9;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = -2 + Math.random() * 4.4;
      pos[i * 3 + 2] = Math.sin(a) * r * 0.7;
      seed[i] = 0.25 + Math.random() * 0.85;
    }
    return { count, pos, seed };
  }, [small]);

  const { camera } = useThree();
  const drift = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = clamp01(heroScroll.value);

    /* ── phase envelopes ── */
    const open = smoothstep(0.18, 0.55, p); // rib cage fans out
    const xray = smoothstep(0.42, 0.78, p); // bone → translucent shell
    const focus = smoothstep(0.62, 1.0, p); // airways take over

    /* ── respiratory cycle: inhale over 40%, exhale over 60% ── */
    let breath = 0;
    if (!reduced) {
      const c = (t % BREATH_PERIOD) / BREATH_PERIOD;
      breath =
        c < 0.4
          ? 0.5 - 0.5 * Math.cos((c / 0.4) * Math.PI)
          : 0.5 + 0.5 * Math.cos(((c - 0.4) / 0.6) * Math.PI);
    }

    /* ── cardiac cycle: systolic spike, smaller diastolic bump ── */
    let beat = 0;
    if (!reduced) {
      const c = (t % BEAT_PERIOD) / BEAT_PERIOD;
      beat =
        Math.exp(-Math.pow((c - 0.1) / 0.055, 2)) +
        0.55 * Math.exp(-Math.pow((c - 0.3) / 0.075, 2));
    }

    /* ── whole-body orientation ── */
    if (root.current) {
      const tx = reduced ? 0 : state.pointer.x;
      const ty = reduced ? 0 : state.pointer.y;
      drift.current.x += (tx - drift.current.x) * 0.045;
      drift.current.y += (ty - drift.current.y) * 0.045;

      root.current.rotation.y = -0.62 + p * 1.5 + drift.current.x * 0.3;
      root.current.rotation.x = 0.04 + p * 0.1 - drift.current.y * 0.16;
      root.current.position.y = -0.12 - p * 0.18;
      root.current.scale.setScalar(1 + focus * 0.16);
    }

    /* ── camera push-in ── */
    const zBase = small ? 6.9 : 5.7;
    const zEnd = small ? 5.0 : 3.55;
    camera.position.z += (THREE.MathUtils.lerp(zBase, zEnd, focus) - camera.position.z) * 0.08;
    camera.position.x += (drift.current.x * 0.35 - camera.position.x) * 0.05;
    camera.position.y += (0.1 + drift.current.y * 0.25 - camera.position.y) * 0.05;
    camera.lookAt(0, -0.1 - p * 0.25, 0);

    /* ── ribs: bucket-handle breathing plus a staggered fan ── */
    ribRefs.current.forEach((g, i) => {
      if (!g) return;
      const spec = geo.ribs[i];
      const norm = spec.index / (RIB_PAIRS - 1);
      // Lower ribs lead, so the cage peels open from the bottom up.
      const stagger = clamp01((open - (1 - norm) * 0.22) / 0.78);
      const eased = stagger * stagger * (3 - 2 * stagger);

      g.rotation.z = spec.side * (breath * 0.045 + eased * 0.1);
      g.rotation.y = spec.side * eased * 0.62;
      g.position.x = spec.side * (0.09 + eased * 0.34);
      g.position.z = -0.5 + eased * 0.12;
    });

    /* ── lungs inflate, then thin out as the airways take focus ── */
    if (lungGroup.current) {
      const inflate = breath * (1 - focus * 0.45);
      lungGroup.current.scale.set(1 + inflate * 0.085, 1 + inflate * 0.05, 1 + inflate * 0.1);
      lungGroup.current.position.y = -0.02 - inflate * 0.03;
    }

    /* ── material response across the X-ray phase ── */
    mat.bone.opacity = 1 - xray * 0.62;
    mat.bone.emissiveIntensity = 0.04 + xray * 0.5;
    mat.bone.roughness = 0.42 - xray * 0.2;

    mat.lung.opacity = 0.92 - xray * 0.45;
    mat.lung.emissiveIntensity = 0.12 + xray * 0.55 + breath * 0.28;
    if (!small) mat.lung.transmission = 0.5 + xray * 0.45;

    mat.lungWire.opacity = 0.04 + xray * 0.3;

    mat.airway.emissiveIntensity = 0.35 + xray * 0.9 + focus * 1.6 + beat * 0.15;
    mat.airway.opacity = 0.35 + xray * 0.65;

    mat.heart.emissiveIntensity = 0.3 + beat * 1.5;
    mat.heart.opacity = 0.5 + xray * 0.45;
    if (heartRef.current) heartRef.current.scale.setScalar(1 + beat * 0.085);

    /* ── diaphragm flattens downwards on inhale ── */
    mat.diaphragm.opacity = 0.06 + xray * 0.16;
    if (diaphragmRef.current) {
      diaphragmRef.current.position.y = -1.05 - breath * 0.12;
      diaphragmRef.current.scale.y = 1 - breath * 0.22;
    }

    /* ── CT-style slice sweeping the thorax ── */
    if (scanRef.current) {
      const sweep = (t * 0.19) % 1;
      scanRef.current.position.y = 1.75 - sweep * 3.5;
      mat.scan.opacity = (0.1 + xray * 0.42) * Math.sin(sweep * Math.PI);
    }

    /* ── inspired air drifting up towards the airways ── */
    if (dustRef.current) {
      const attr = dustRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const a = attr.array as Float32Array;
      for (let i = 0; i < dust.count; i++) {
        const iy = i * 3 + 1;
        a[iy] += delta * dust.seed[i] * (0.16 + breath * 0.5);
        if (a[iy] > 2.3) a[iy] = -2.1;
        // Converge on the midline while rising, like air drawn into the hilum.
        const pull = 1 - delta * 0.05 * dust.seed[i];
        a[i * 3] *= pull;
        a[i * 3 + 2] *= pull;
      }
      attr.needsUpdate = true;
      mat.dust.opacity = 0.18 + breath * 0.22 + focus * 0.3;
    }
  });

  return (
    <group ref={root} dispose={null}>
      {/* ── rib cage ── */}
      {geo.ribs.map((r, i) => (
        <group
          key={`${r.side}-${r.index}`}
          ref={(el) => {
            ribRefs.current[i] = el;
          }}
          position={[r.side * 0.09, r.pivotY, -0.5]}
        >
          <mesh geometry={r.geometry} material={mat.bone} />
        </group>
      ))}

      <mesh geometry={geo.spine} material={mat.bone} />
      <mesh geometry={geo.sternum} material={mat.bone} />
      <mesh geometry={geo.clavicles} material={mat.bone} />

      {/* ── lungs ──
          The right lung is wider but shorter (the liver pushes its base up);
          the left is taller and narrowed by the cardiac notch. Both are scaled
          to span from the first rib down onto the diaphragm dome. */}
      <group ref={lungGroup}>
        {LUNGS.map((l) => (
          <group key={l.side} position={[l.side * 0.5, l.y, 0.02]} scale={l.scale}>
            <mesh geometry={geo.lung} material={mat.lung} scale={0.92} />
            <mesh geometry={geo.lung} material={mat.lungWire} scale={0.94} />
          </group>
        ))}
      </group>

      {/* ── trachea and bronchial tree ── */}
      <mesh geometry={geo.airways} material={mat.airway} />

      {/* ── heart, sitting in the cardiac notch of the left lung ── */}
      <mesh ref={heartRef} geometry={geo.heart} material={mat.heart} position={[0.18, -0.04, 0.16]} />

      {/* ── diaphragm: dome apex points up into the thorax ── */}
      <mesh
        ref={diaphragmRef}
        geometry={geo.diaphragm}
        material={mat.diaphragm}
        position={[0, -1.05, 0]}
      />

      {/* ── CT slice ── */}
      <mesh ref={scanRef} material={mat.scan} rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.6, 0]}>
        <ringGeometry args={[1.36, 1.72, 72]} />
      </mesh>

      {/* ── inspired air ── */}
      <points ref={dustRef} material={mat.dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust.pos, 3]} />
        </bufferGeometry>
      </points>
    </group>
  );
}
