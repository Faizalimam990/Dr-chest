import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Procedural thoracic anatomy.
 *
 * Every structure here is generated from code rather than loaded from a GLTF.
 * That is a deliberate trade: a downloaded scan mesh is a single rigid blob,
 * whereas generated geometry gives us per-rib meshes, a parametric lung
 * surface, and a recursive bronchial tree — all of which can be driven
 * independently by scroll position. It also keeps the bundle free of a
 * multi-megabyte binary and of third-party asset licensing.
 *
 * Coordinate space: +y up (apex of lungs), +z anterior (towards the viewer's
 * chest), +x to the patient's left. Roughly 3.4 units tall overall.
 */

/* ─────────────────────────── shared profiles ─────────────────────────── */

/**
 * Clamp to 0–1. Needed before any fractional Math.pow: sphere poles land on
 * ±radius with a float error of ~1e-8, and Math.pow(-1e-8, 0.5) is NaN, which
 * silently poisons the whole buffer.
 */
const unit = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Half-width of the rib cage at normalised height t (0 = first rib). */
const cageWidth = (t: number) => 0.58 + 0.95 * Math.sin(Math.PI * (0.18 + 0.66 * t));

/** Anterior depth of the rib cage at normalised height t. */
const cageDepth = (t: number) => 0.4 + 0.3 * Math.sin(Math.PI * (0.2 + 0.65 * t));

export const RIB_PAIRS = 12;

/* ───────────────────────────────── ribs ───────────────────────────────── */

export interface RibSpec {
  geometry: THREE.BufferGeometry;
  /** -1 = patient's right, +1 = patient's left. */
  side: 1 | -1;
  /** 0 = first rib (top). */
  index: number;
  /** Height of the vertebral attachment — the pivot for the fan animation. */
  pivotY: number;
  /** True for ribs 11–12, which never reach the sternum. */
  floating: boolean;
}

/**
 * One rib as a tube swept along its costal arc: posterior attachment at the
 * vertebra, out past the lateral maximum, then forward and down towards the
 * sternum. Ribs 8–10 stop at the costal margin, 11–12 float free.
 */
function ribGeometry(index: number, side: 1 | -1, detail: number): THREE.BufferGeometry {
  const t = index / (RIB_PAIRS - 1);
  const w = cageWidth(t);
  const d = cageDepth(t);
  const y = 1.5 - index * 0.245;
  const s = side;

  const drop = 0.16 + t * 0.42; // lower ribs slope down much more steeply
  const pts: THREE.Vector3[] = [
    new THREE.Vector3(s * 0.09, y, -0.5), // costovertebral joint
    new THREE.Vector3(s * w * 0.5, y - 0.04, -0.44), // angle of the rib
    new THREE.Vector3(s * w * 0.95, y - 0.13, -0.12), // lateral maximum
    new THREE.Vector3(s * w, y - drop * 0.9, d * 0.6), // anterolateral turn
  ];

  const floating = index >= 10;
  if (floating) {
    // Free anterior end, tapering inwards and downwards.
    pts.push(new THREE.Vector3(s * w * 0.72, y - drop * 1.35, d * 0.95));
  } else if (index >= 7) {
    // Costal margin — converges towards the midline but joins the rib above.
    pts.push(new THREE.Vector3(s * w * 0.6, y - drop * 1.5, d * 1.0));
    pts.push(new THREE.Vector3(s * w * 0.26, y - drop * 1.9, d * 1.02));
  } else {
    // True ribs — costal cartilage running into the sternum.
    pts.push(new THREE.Vector3(s * w * 0.55, y - drop * 1.4, d * 0.95));
    pts.push(new THREE.Vector3(s * 0.11, y - drop * 1.7, d * 1.06));
  }

  const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.4);
  const radius = 0.034 - t * 0.004;
  return new THREE.TubeGeometry(curve, detail, radius, Math.max(5, Math.round(detail / 6)), false);
}

export function buildRibs(detail = 44): RibSpec[] {
  const ribs: RibSpec[] = [];
  for (let i = 0; i < RIB_PAIRS; i++) {
    for (const side of [-1, 1] as const) {
      ribs.push({
        geometry: ribGeometry(i, side, detail),
        side,
        index: i,
        pivotY: 1.5 - i * 0.245,
        floating: i >= 10,
      });
    }
  }
  return ribs;
}

/* ───────────────────────── spine, sternum, girdle ───────────────────────── */

/** Thoracic vertebrae T1–T12 plus spinous processes, merged into one mesh. */
export function buildSpine(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < RIB_PAIRS; i++) {
    const y = 1.52 - i * 0.245;
    const t = i / (RIB_PAIRS - 1);
    const r = 0.105 + t * 0.03; // vertebral bodies widen going down

    const body = new THREE.CylinderGeometry(r, r * 1.04, 0.17, 14);
    body.translate(0, y, -0.52);
    parts.push(body);

    const disc = new THREE.CylinderGeometry(r * 0.86, r * 0.86, 0.055, 12);
    disc.translate(0, y - 0.12, -0.52);
    parts.push(disc);

    // Spinous process pointing posteriorly and down.
    const spine = new THREE.CapsuleGeometry(0.032, 0.14, 3, 8);
    spine.rotateX(Math.PI / 2.6);
    spine.translate(0, y - 0.05, -0.68);
    parts.push(spine);
  }
  return mergeGeometries(parts, false)!;
}

/** Sternum: manubrium, body and xiphoid process. */
export function buildSternum(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  // Depths chosen to meet the anterior ends of the true ribs, which sit at
  // cageDepth(t) * 1.06 — roughly 0.61 at the top and 0.74 at the costal margin.
  const manubrium = new THREE.BoxGeometry(0.34, 0.24, 0.075);
  manubrium.translate(0, 1.3, 0.6);
  parts.push(manubrium);

  const body = new THREE.BoxGeometry(0.24, 0.78, 0.07);
  body.translate(0, 0.86, 0.66);
  parts.push(body);

  const xiphoid = new THREE.ConeGeometry(0.09, 0.2, 8);
  xiphoid.rotateX(Math.PI);
  xiphoid.translate(0, 0.37, 0.66);
  parts.push(xiphoid);

  return mergeGeometries(parts, false)!;
}

/** Clavicles — the visual "shoulders" that frame the apex of the lungs. */
export function buildClavicles(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const s of [-1, 1] as const) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(s * 0.16, 1.46, cageDepth(0.05) * 1.05),
      new THREE.Vector3(s * 0.5, 1.52, 0.24),
      new THREE.Vector3(s * 0.82, 1.5, -0.06),
      new THREE.Vector3(s * 1.02, 1.44, -0.3),
    ]);
    parts.push(new THREE.TubeGeometry(curve, 26, 0.036, 7, false));
  }
  return mergeGeometries(parts, false)!;
}

/* ───────────────────────────────── lungs ───────────────────────────────── */

/**
 * A single lung as a deformed sphere: narrow apex, broad base hollowed by the
 * diaphragm, and a flattened medial face where it meets the mediastinum.
 * Returns geometry for the patient's right lung (medial face towards +x when
 * `side` is -1); mirror it on the x axis for the left.
 */
export function buildLung(side: 1 | -1, segments = 46): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, segments, Math.round(segments * 0.8));
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Vertical taper: apex is roughly 45% of the width of the base.
    const h = unit((v.y + 1) / 2); // 0 base → 1 apex
    const taper = 0.44 + 0.56 * Math.pow(1 - h, 0.5);
    v.x *= taper;
    v.z *= taper * 0.74;

    // Flatten the medial surface against the mediastinum.
    const medial = side === -1 ? v.x > 0 : v.x < 0;
    if (medial) v.x *= 0.34;

    // Hollow the base into a dome that sits on the diaphragm.
    if (v.y < -0.25) {
      const inset = (-v.y - 0.25) / 0.75;
      const radial = Math.min(1, Math.hypot(v.x, v.z) / 0.85);
      v.y += inset * 0.52 * (1 - radial * radial);
    }

    // Round the apex off rather than leaving a sphere pole.
    if (v.y > 0.72) v.y = 0.72 + (v.y - 0.72) * 0.55;

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  return geo;
}

/* ────────────────────────── airways / bronchial tree ────────────────────── */

/**
 * Trachea, carina, and a recursive bronchial tree down to sub-segmental
 * branches. Merged into one geometry — the tree is 60+ segments and each one
 * as its own mesh would cost more in draw calls than it earns in detail.
 */
export function buildAirways(depth = 5, detail = 12): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  const tube = (from: THREE.Vector3, to: THREE.Vector3, r0: number, r1: number) => {
    const mid = from.clone().lerp(to, 0.5);
    // Bow each segment slightly so branches read as organic, not as a truss.
    mid.x += (to.x - from.x) * 0.12;
    mid.z += 0.04;
    const curve = new THREE.CatmullRomCurve3([from, mid, to]);
    const g = new THREE.TubeGeometry(curve, 8, (r0 + r1) / 2, detail > 8 ? 7 : 5, false);
    parts.push(g);
    // Cap the joint so branch points don't show a seam.
    const joint = new THREE.SphereGeometry(r1 * 1.15, 8, 6);
    joint.translate(to.x, to.y, to.z);
    parts.push(joint);
  };

  const trachea = new THREE.Vector3(0, 1.62, 0.02);
  const carina = new THREE.Vector3(0, 0.66, 0.0);
  tube(trachea, carina, 0.082, 0.072);

  /** Recursively branch from `origin` along `dir`. */
  const branch = (
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    length: number,
    radius: number,
    level: number,
    lateral: THREE.Vector3,
  ) => {
    if (level > depth || radius < 0.008) return;
    const end = origin.clone().add(dir.clone().normalize().multiplyScalar(length));
    tube(origin, end, radius, radius * 0.78);

    const nextLen = length * 0.7;
    const nextRad = radius * 0.7;
    // Alternate the branching plane each generation so the tree fills volume.
    const nextLateral = dir.clone().cross(lateral).normalize();
    const spread = level === 1 ? 0.62 : 0.5;

    for (const sign of [-1, 1] as const) {
      const nd = dir
        .clone()
        .normalize()
        .add(lateral.clone().multiplyScalar(sign * spread))
        .add(new THREE.Vector3(0, -0.3, 0)) // gravity bias — the tree descends
        .normalize();
      branch(end, nd, nextLen, nextRad, level + 1, nextLateral);
    }
  };

  for (const s of [-1, 1] as const) {
    // Main bronchi leave the carina at ~35°, the right one more vertically.
    const dir = new THREE.Vector3(s * 0.7, -0.62, 0.06).normalize();
    branch(carina, dir, 0.46, 0.058, 1, new THREE.Vector3(0, 0, 1));
  }

  return mergeGeometries(parts, false)!;
}

/* ───────────────────────────────── heart ───────────────────────────────── */

/** Heart mass: a sphere pulled into an apex and tilted to the patient's left. */
export function buildHeart(segments = 32): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.34, segments, segments);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const h = unit((v.y / 0.34 + 1) / 2); // 0 apex → 1 base
    const taper = 0.42 + 0.58 * Math.pow(h, 0.8);
    v.x *= taper;
    v.z *= taper * 0.86;
    v.y *= 1.28;
    // Slight cleft between the ventricles.
    if (v.z > 0) v.z -= 0.05 * Math.exp(-Math.pow(v.x / 0.09, 2));
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  geo.rotateZ(0.3);
  return geo;
}

/** Diaphragm: a shallow dome closing the base of the thorax. */
export function buildDiaphragm(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1.02, 40, 16, 0, Math.PI * 2, 0, Math.PI * 0.42);
  geo.scale(1, 0.5, 0.78);
  return geo;
}
