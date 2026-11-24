import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float, Environment, Lightformer } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import { P } from './palette'
/* ------------------------------------------------------------------ */
/* materials                                                           */
/* ------------------------------------------------------------------ */

export function Gloss({ color = P.pink, roughness = 0.19, metalness = 0.02, ...rest }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      clearcoat={1}
      clearcoatRoughness={0.1}
      {...rest}
    />
  )
}

export function Chrome({ color = P.chrome, roughness = 0.1 }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={1}
      roughness={roughness}
      clearcoat={1}
      envMapIntensity={1.4}
    />
  )
}

/* ------------------------------------------------------------------ */
/* lighting                                                            */
/* ------------------------------------------------------------------ */

export function StudioLights({ intensity = 1 }) {
  return (
    <>
      <ambientLight intensity={0.42 * intensity} color="#fff1e6" />
      <directionalLight position={[5, 7, 5]} intensity={2.4 * intensity} color="#ffffff" />
      <directionalLight position={[-6, 3, 2]} intensity={1.15 * intensity} color="#ffbcd4" />
      <pointLight position={[0, -3, 4]} intensity={1.2 * intensity} color="#ffe3ca" />
    </>
  )
}

/** Studio reflections rendered in-engine, so no external HDR is needed. */
export function StudioReflections({ resolution = 96 }) {
  return (
    <Environment resolution={resolution} frames={1}>
      <Lightformer form="rect" intensity={3} position={[0, 5, -6]} scale={[12, 6, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={2.2} position={[-6, 1, 2]} scale={[6, 8, 1]} color="#ffb6cd" />
      <Lightformer form="rect" intensity={2} position={[6, -1, 1]} scale={[5, 8, 1]} color="#ffe0c8" />
      <Lightformer
        form="circle"
        intensity={1.5}
        position={[0, -5, 1]}
        scale={[8, 8, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#ffdce8"
      />
    </Environment>
  )
}

export function Floaty({ children, speed = 1.1, rotation = 0.22, float = 0.65, ...props }) {
  const reduce = useReducedMotion()
  if (reduce) return <group {...props}>{children}</group>
  return (
    <Float
      speed={speed}
      rotationIntensity={rotation}
      floatIntensity={float}
      floatingRange={[-0.12, 0.18]}
      {...props}
    >
      {children}
    </Float>
  )
}

/* ------------------------------------------------------------------ */
/* shared geometry                                                     */
/* ------------------------------------------------------------------ */

let heartGeo = null
export function getHeartGeometry() {
  if (heartGeo) return heartGeo
  const s = new THREE.Shape()
  s.moveTo(0, 0.4)
  s.bezierCurveTo(-0.04, 0.76, -0.6, 0.88, -0.66, 0.42)
  s.bezierCurveTo(-0.71, 0.02, -0.2, -0.22, 0, -0.62)
  s.bezierCurveTo(0.2, -0.22, 0.71, 0.02, 0.66, 0.42)
  s.bezierCurveTo(0.6, 0.88, 0.04, 0.76, 0, 0.4)
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.48,
    bevelEnabled: true,
    bevelSize: 0.24,
    bevelThickness: 0.22,
    bevelSegments: 8,
    curveSegments: 26,
  })
  g.center()
  g.computeVertexNormals()
  heartGeo = g
  return g
}

let stemCurve = null
function getStemCurve() {
  if (!stemCurve) {
    stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.24, 0),
      new THREE.Vector3(0.07, 0.52, 0.01),
      new THREE.Vector3(-0.04, 0.76, 0.03),
      new THREE.Vector3(0.2, 0.96, 0.02),
    ])
  }
  return stemCurve
}

/* ------------------------------------------------------------------ */
/* decorative objects                                                  */
/* ------------------------------------------------------------------ */

export function Heart({ scale = 1, color = P.pink, ...props }) {
  return (
    <mesh geometry={getHeartGeometry()} scale={scale} castShadow {...props}>
      <Gloss color={color} roughness={0.16} />
    </mesh>
  )
}

export function Cherry({ scale = 1, color = P.red, stem = true, ...props }) {
  return (
    <group scale={scale} {...props}>
      <mesh scale={[1, 0.94, 1]} castShadow>
        <sphereGeometry args={[0.4, 30, 22]} />
        <Gloss color={color} roughness={0.11} />
      </mesh>
      <mesh position={[-0.13, 0.14, 0.33]} scale={[0.26, 0.19, 0.15]}>
        <sphereGeometry args={[0.4, 14, 10]} />
        <meshBasicMaterial color="#fff6ec" transparent opacity={0.5} />
      </mesh>
      {stem && (
        <>
          <mesh>
            <tubeGeometry args={[getStemCurve(), 26, 0.032, 8, false]} />
            <Gloss color={P.wine} roughness={0.45} />
          </mesh>
          <mesh position={[0.24, 0.82, 0]} rotation={[0, 0.3, -0.55]} scale={[0.34, 0.08, 0.18]}>
            <sphereGeometry args={[0.5, 18, 12]} />
            <Gloss color={P.leaf} roughness={0.5} />
          </mesh>
        </>
      )}
    </group>
  )
}

export function Bow({ scale = 1, color = P.pink, ...props }) {
  return (
    <group scale={scale} {...props}>
      {/* soft loops */}
      <mesh position={[-0.36, 0.04, 0]} rotation={[0.16, 0.32, 0.32]} scale={[0.82, 0.54, 0.34]}>
        <sphereGeometry args={[0.62, 28, 20]} />
        <Gloss color={color} roughness={0.14} />
      </mesh>
      <mesh position={[0.36, 0.04, 0]} rotation={[0.16, -0.32, -0.32]} scale={[0.82, 0.54, 0.34]}>
        <sphereGeometry args={[0.62, 28, 20]} />
        <Gloss color={color} roughness={0.14} />
      </mesh>
      {/* crease shadows inside the loops */}
      <mesh position={[-0.18, 0, 0.14]} rotation={[0, 0.2, 0.34]} scale={[0.3, 0.2, 0.1]}>
        <sphereGeometry args={[0.5, 18, 14]} />
        <Gloss color={P.pinkDeep} roughness={0.3} />
      </mesh>
      <mesh position={[0.18, 0, 0.14]} rotation={[0, -0.2, -0.34]} scale={[0.3, 0.2, 0.1]}>
        <sphereGeometry args={[0.5, 18, 14]} />
        <Gloss color={P.pinkDeep} roughness={0.3} />
      </mesh>
      {/* knot */}
      <mesh position={[0, 0, 0.05]} scale={[1, 0.9, 0.8]}>
        <sphereGeometry args={[0.15, 24, 18]} />
        <Gloss color={color} roughness={0.14} />
      </mesh>
      {/* tails */}
      <mesh position={[-0.13, -0.36, -0.02]} rotation={[0.2, 0.2, 0.34]} scale={[0.55, 1, 0.34]}>
        <capsuleGeometry args={[0.1, 0.38, 8, 16]} />
        <Gloss color={P.pinkDeep} roughness={0.22} />
      </mesh>
      <mesh position={[0.16, -0.34, -0.04]} rotation={[0.2, -0.24, -0.42]} scale={[0.55, 1, 0.34]}>
        <capsuleGeometry args={[0.1, 0.36, 8, 16]} />
        <Gloss color={P.pinkDeep} roughness={0.22} />
      </mesh>
    </group>
  )
}

export function Flower({ scale = 1, color = P.pink, center = P.peach, petals = 6, ...props }) {
  return (
    <group scale={scale} {...props}>
      {Array.from({ length: petals }).map((_, i) => {
        const a = (i / petals) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0]}
            rotation={[0, 0, a]}
            scale={[0.52, 0.24, 0.18]}
          >
            <sphereGeometry args={[0.5, 18, 12]} />
            <Gloss color={color} roughness={0.24} />
          </mesh>
        )
      })}
      <mesh position={[0, 0, 0.12]}>
        <sphereGeometry args={[0.2, 22, 16]} />
        <Gloss color={center} roughness={0.3} />
      </mesh>
    </group>
  )
}

export function Ribbon({
  color = P.pink,
  scale = 1,
  turns = 1.35,
  radius = 0.85,
  height = 2.4,
  thickness = 0.075,
  ...props
}) {
  const curve = new THREE.CatmullRomCurve3(
    Array.from({ length: 46 }).map((_, i) => {
      const t = i / 45
      const a = t * Math.PI * 2 * turns
      return new THREE.Vector3(
        Math.cos(a) * radius * (1 - t * 0.2),
        (t - 0.5) * height,
        Math.sin(a) * radius * 0.55,
      )
    }),
  )
  return (
    <mesh scale={scale} {...props}>
      <tubeGeometry args={[curve, 70, thickness, 10, false]} />
      <Gloss color={color} roughness={0.14} />
    </mesh>
  )
}

export function Balloon({ scale = 1, color = P.pink, ...props }) {
  return (
    <group scale={scale} {...props}>
      <mesh scale={[1, 1.16, 1]} castShadow>
        <sphereGeometry args={[0.5, 28, 22]} />
        <Gloss color={color} roughness={0.13} />
      </mesh>
      <mesh position={[0, -0.62, 0]}>
        <coneGeometry args={[0.075, 0.16, 12]} />
        <Gloss color={color} roughness={0.2} />
      </mesh>
      <mesh position={[0.02, -1.15, 0]} rotation={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.006, 0.006, 1, 5]} />
        <meshBasicMaterial color={P.rose} />
      </mesh>
    </group>
  )
}

export function Sparkle({ scale = 1, color = P.cream, ...props }) {
  return (
    <mesh scale={scale} {...props}>
      <octahedronGeometry args={[0.28, 0]} />
      <meshPhysicalMaterial color={color} metalness={1} roughness={0.16} envMapIntensity={1.5} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* the number 19                                                       */
/* ------------------------------------------------------------------ */

function One({ color = P.pink, accent = P.pinkDeep }) {
  return (
    <group position={[-1.24, 0, 0]}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <capsuleGeometry args={[0.335, 2.18, 14, 30]} />
        <Gloss color={color} roughness={0.13} />
      </mesh>
      <mesh position={[-0.4, 1.3, 0]} rotation={[0, 0, -0.58]} castShadow>
        <capsuleGeometry args={[0.3, 0.4, 14, 26]} />
        <Gloss color={color} roughness={0.13} />
      </mesh>
      <mesh position={[0.04, -1.14, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.295, 1.02, 14, 26]} />
        <Gloss color={color} roughness={0.15} />
      </mesh>
      <mesh position={[0.04, -1.2, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1, 0.92, 0.94]}>
        <capsuleGeometry args={[0.2, 0.96, 12, 22]} />
        <Gloss color={accent} roughness={0.24} />
      </mesh>
    </group>
  )
}

function Nine({ color = P.pink, accent = P.pinkDeep }) {
  const tail = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.68, 0.46, 0),
    new THREE.Vector3(0.68, -0.16, 0),
    new THREE.Vector3(0.52, -0.68, 0),
    new THREE.Vector3(0.1, -1.0, 0),
    new THREE.Vector3(-0.22, -1.08, 0),
  ])
  return (
    <group position={[1.12, 0, 0]}>
      <mesh position={[0, 0.84, 0]} castShadow>
        <torusGeometry args={[0.7, 0.33, 30, 60]} />
        <Gloss color={color} roughness={0.13} />
      </mesh>
      <mesh position={[0.68, 0.02, 0]} castShadow>
        <capsuleGeometry args={[0.33, 0.66, 14, 28]} />
        <Gloss color={color} roughness={0.13} />
      </mesh>
      <mesh castShadow>
        <tubeGeometry args={[tail, 36, 0.325, 22, false]} />
        <Gloss color={accent} roughness={0.16} />
      </mesh>
      <mesh position={[-0.22, -1.08, 0]}>
        <sphereGeometry args={[0.325, 26, 20]} />
        <Gloss color={accent} roughness={0.16} />
      </mesh>
    </group>
  )
}

export function Numeral19({
  scale = 1,
  spinKey = 0,
  colorA = P.pink,
  colorB = P.red,
  idle = true,
  ...props
}) {
  const group = useRef(null)
  const target = useRef(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (spinKey) target.current += Math.PI * 2
  }, [spinKey])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const drift = reduce || !idle ? 0 : Math.sin(t * 0.34) * 0.14
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target.current + drift, 4.5, delta)
    g.rotation.z = reduce || !idle ? 0 : Math.sin(t * 0.45) * 0.018
    g.position.y = reduce || !idle ? 0 : Math.sin(t * 0.8) * 0.055
  })

  return (
    <group ref={group} scale={scale} {...props}>
      <One color={colorA} accent={colorB} />
      <Nine color={colorA} accent={colorB} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* cake                                                                */
/* ------------------------------------------------------------------ */

function Candle({ x = 0, z = 0, height = 0.5, color = P.cream }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.055, 0.06, height, 14]} />
        <Gloss color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0, height + 0.015, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.1, 5]} />
        <meshBasicMaterial color={P.wine} />
      </mesh>
      <mesh position={[0, height + 0.12, 0]} scale={[1, 1.7, 1]}>
        <sphereGeometry args={[0.05, 12, 10]} />
        <meshStandardMaterial color="#ffb25e" emissive="#ff8a3d" emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
    </group>
  )
}

export function Cake({ scale = 1, cherryColor = P.red, ...props }) {
  const cherries = 9
  return (
    <group scale={scale} {...props}>
      {/* stand */}
      <mesh position={[0, -1.14, 0]}>
        <cylinderGeometry args={[1.55, 1.62, 0.09, 64]} />
        <Gloss color={P.cream} roughness={0.34} />
      </mesh>
      <mesh position={[0, -1.36, 0]}>
        <cylinderGeometry args={[0.52, 0.8, 0.38, 48]} />
        <Gloss color={P.cream} roughness={0.34} />
      </mesh>

      {/* tier one */}
      <mesh position={[0, -0.72, 0]} castShadow>
        <cylinderGeometry args={[1.24, 1.3, 0.62, 64]} />
        <Gloss color={P.cream} roughness={0.42} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[1.25, 1.27, 0.1, 64]} />
        <Gloss color={P.pink} roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.24, 0.09, 12, 64]} />
        <Gloss color={P.pink} roughness={0.2} />
      </mesh>

      {/* tier two */}
      <mesh position={[0, -0.12, 0]} castShadow>
        <cylinderGeometry args={[0.88, 0.94, 0.5, 64]} />
        <Gloss color={P.blush} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.9, 0.91, 0.09, 64]} />
        <Gloss color={P.cream} roughness={0.28} />
      </mesh>

      {/* tier three */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.54, 0.6, 0.42, 56]} />
        <Gloss color={P.pink} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.57, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 0.08, 56]} />
        <Gloss color={P.cream} roughness={0.28} />
      </mesh>

      {/* drips on the top two tiers */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2
        const r = 0.92
        return (
          <mesh key={`d${i}`} position={[Math.cos(a) * r, 0.06 - (i % 3) * 0.02, Math.sin(a) * r]}>
            <sphereGeometry args={[0.075, 12, 10]} />
            <Gloss color={P.cream} roughness={0.26} />
          </mesh>
        )
      })}

      {/* cherries around the base tier */}
      {Array.from({ length: cherries }).map((_, i) => {
        const a = (i / cherries) * Math.PI * 2
        return (
          <Cherry
            key={`c${i}`}
            scale={0.55}
            color={cherryColor}
            stem={false}
            position={[Math.cos(a) * 0.92, -0.34, Math.sin(a) * 0.92]}
          />
        )
      })}

      {/* crown of candles */}
      <Candle x={-0.28} z={0.1} height={0.52} />
      <Candle x={0.05} z={-0.2} height={0.62} color={P.blush} />
      <Candle x={0.28} z={0.12} height={0.46} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* envelope                                                            */
/* ------------------------------------------------------------------ */

function flapShape() {
  const s = new THREE.Shape()
  s.moveTo(-1.38, 0)
  s.lineTo(1.38, 0)
  s.lineTo(0, -0.96)
  s.closePath()
  return s
}

export function Envelope({ open = false, ...props }) {
  const flap = useRef(null)
  const card = useRef(null)
  const seal = useRef(null)
  const reduce = useReducedMotion()

  useFrame((_, delta) => {
    const f = flap.current
    const c = card.current
    if (!f || !c) return
    const flapTarget = open ? -2.5 : 0
    const cardTarget = open ? 0.62 : -0.35
    const lift = reduce ? 1 : 3.4
    f.rotation.x = THREE.MathUtils.damp(f.rotation.x, flapTarget, lift, delta)
    c.position.y = THREE.MathUtils.damp(c.position.y, cardTarget, lift, delta)
    c.position.z = THREE.MathUtils.damp(c.position.z, open ? 0.16 : 0.0, lift, delta)
    if (seal.current) {
      seal.current.scale.setScalar(THREE.MathUtils.damp(seal.current.scale.x, open ? 0 : 1, 4, delta))
    }
  })

  return (
    <group {...props}>
      {/* back panel */}
      <mesh position={[0, 0, -0.06]} castShadow>
        <boxGeometry args={[2.78, 1.8, 0.09]} />
        <Gloss color={P.blush} roughness={0.5} />
      </mesh>

      {/* card */}
      <group ref={card} position={[0, -0.35, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[2.42, 1.62, 0.035]} />
          <meshPhysicalMaterial color={P.paper} roughness={0.72} clearcoat={0.15} />
        </mesh>
        {[0.36, 0.2, 0.04, -0.12].map((y, i) => (
          <mesh key={y} position={[0, y, 0.025]}>
            <planeGeometry args={[i === 0 ? 1.1 : 1.9 - (i % 2) * 0.35, 0.018]} />
            <meshBasicMaterial color={i === 0 ? '#e9457b' : '#d9b8ae'} />
          </mesh>
        ))}
        <mesh position={[0, -0.48, 0.03]}>
          <planeGeometry args={[0.24, 0.16]} />
          <meshBasicMaterial color={P.red} />
        </mesh>
      </group>

      {/* front pocket */}
      <group position={[0, 0, 0.03]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.78, 1.8, 0.055]} />
          <Gloss color={P.cream} roughness={0.46} />
        </mesh>
        <mesh position={[0, -0.03, 0.04]} rotation={[0, 0, 0.66]}>
          <boxGeometry args={[3.1, 0.02, 0.01]} />
          <meshBasicMaterial color="#d6b0a3" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, -0.03, 0.04]} rotation={[0, 0, -0.66]}>
          <boxGeometry args={[3.1, 0.02, 0.01]} />
          <meshBasicMaterial color="#d6b0a3" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* flap */}
      <group ref={flap} position={[0, 0.9, 0.08]}>
        <mesh position={[0, 0, 0]}>
          <extrudeGeometry args={[flapShape(), { depth: 0.04, bevelEnabled: false }]} />
          <Gloss color={P.cream} roughness={0.44} />
        </mesh>
        <mesh ref={seal} position={[0, -0.9, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.055, 32]} />
          <Gloss color={P.red} roughness={0.2} />
        </mesh>
      </group>
    </group>
  )
}
