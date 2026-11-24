import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import { Gloss } from './parts'
import { P } from './palette'

const DEFAULT_PALETTE = {
  fur: '#f7e6d3',
  furShade: '#ecd3bb',
  inner: '#ff9dbc',
  eye: '#2c1119',
  collar: '#c2113a',
}

/** A fully procedural, easily recoloured cat. No external model files. */
export default function FluffyCat({
  palette = DEFAULT_PALETTE,
  pulse = 0,
  hovered = false,
  ...props
}) {
  const root = useRef(null)
  const head = useRef(null)
  const body = useRef(null)
  const tail = useRef(null)
  const earL = useRef(null)
  const earR = useRef(null)
  const eyes = useRef(null)
  const pop = useRef(0)
  const blink = useRef(0)
  const reduce = useReducedMotion()
  const colors = { ...DEFAULT_PALETTE, ...palette }

  useEffect(() => {
    if (pulse) pop.current = 1
  }, [pulse])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    pop.current = Math.max(0, pop.current - delta * 1.15)
    const p = reduce ? 0 : pop.current
    const breathe = reduce ? 0 : Math.sin(t * 1.5) * 0.018

    if (root.current) {
      root.current.position.y = -1.0 + (reduce ? 0 : Math.sin(t * 1.2) * 0.02) + p * 0.16
      root.current.rotation.z = p * 0.05
    }
    if (body.current) {
      body.current.scale.set(1 + breathe + p * 0.05, 1 - breathe * 0.6 - p * 0.07, 1 + breathe)
    }
    if (head.current) {
      const px = state.pointer.x
      const py = state.pointer.y
      const look = reduce ? 0 : 1
      head.current.rotation.y = THREE.MathUtils.damp(
        head.current.rotation.y,
        px * 0.28 * look,
        5,
        delta,
      )
      head.current.rotation.x = THREE.MathUtils.damp(
        head.current.rotation.x,
        -py * 0.12 * look + p * 0.18,
        5,
        delta,
      )
      head.current.rotation.z = Math.sin(t * 0.7) * (reduce ? 0 : 0.025) + p * 0.08
    }
    if (tail.current) {
      tail.current.rotation.z = Math.sin(t * 1.6) * (reduce ? 0 : 0.09) + p * 0.2
      tail.current.rotation.y = Math.sin(t * 0.9) * (reduce ? 0 : 0.07)
    }
    if (earL.current && earR.current) {
      const twitch = p > 0.15 ? Math.sin(t * 26) * 0.12 * p : 0
      earL.current.rotation.z = 0.16 + (reduce ? 0 : Math.sin(t * 2.1) * 0.02) + twitch
      earR.current.rotation.z = -0.16 - (reduce ? 0 : Math.sin(t * 1.7) * 0.02) - twitch
    }
    if (eyes.current) {
      if (!reduce && !blink.current && Math.random() < 0.004) blink.current = 1
      blink.current = Math.max(0, blink.current - delta * 4.5)
      const s = 1 - blink.current * 0.9
      eyes.current.scale.y = s
    }
  })

  const whisker = (side, i) => {
    const y = 1.9 + i * 0.09
    const z = 0.66 - i * 0.02
    return (
      <mesh
        key={`w${side}${i}`}
        position={[side * 0.52, y, z]}
        rotation={[0, 0, side * (0.22 + i * 0.14)]}
      >
        <cylinderGeometry args={[0.007, 0.004, 0.42, 4]} />
        <meshBasicMaterial color="#7a5260" opacity={0.55} transparent />
      </mesh>
    )
  }

  return (
    <group {...props} ref={root} position={[0, -1, 0]}>
      <group ref={body}>
        {/* torso */}
        <mesh position={[0, 0.92, 0]} scale={[1, 0.98, 0.86]} castShadow>
          <sphereGeometry args={[0.98, 40, 30]} />
          <Gloss color={colors.fur} roughness={0.72} clearcoat={0.35} clearcoatRoughness={0.4} />
        </mesh>
        {/* chest fluff */}
        {[
          [0, 1.22, 0.7, 0.3],
          [-0.24, 1.05, 0.76, 0.24],
          [0.24, 1.05, 0.76, 0.24],
          [-0.12, 0.86, 0.82, 0.2],
          [0.14, 0.86, 0.82, 0.2],
        ].map(([x, y, z, r], i) => (
          <mesh key={`f${i}`} position={[x, y, z]} scale={[1, 1.1, 0.8]}>
            <sphereGeometry args={[r, 20, 16]} />
            <Gloss color={colors.fur} roughness={0.8} clearcoat={0.2} />
          </mesh>
        ))}
        {/* paws */}
        <mesh position={[-0.34, 0.14, 0.62]} scale={[0.3, 0.19, 0.42]}>
          <sphereGeometry args={[1, 22, 16]} />
          <Gloss color={colors.fur} roughness={0.72} clearcoat={0.3} />
        </mesh>
        <mesh position={[0.34, 0.14, 0.62]} scale={[0.3, 0.19, 0.42]}>
          <sphereGeometry args={[1, 22, 16]} />
          <Gloss color={colors.fur} roughness={0.72} clearcoat={0.3} />
        </mesh>
        {/* tail */}
        <group ref={tail} position={[0.72, 0.72, -0.45]}>
          <mesh rotation={[0, 0, 0.7]}>
            <tubeGeometry
              args={[
                new THREE.CatmullRomCurve3([
                  new THREE.Vector3(0, 0, 0),
                  new THREE.Vector3(0.5, -0.05, -0.16),
                  new THREE.Vector3(0.82, 0.4, -0.3),
                  new THREE.Vector3(0.62, 0.86, -0.34),
                ]),
                32,
                0.15,
                12,
                false,
              ]}
            />
            <Gloss color={colors.fur} roughness={0.78} clearcoat={0.3} />
          </mesh>
          <mesh position={[0.62, 0.86, -0.34]}>
            <sphereGeometry args={[0.16, 18, 14]} />
            <Gloss color={colors.fur} roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* head */}
      <group ref={head} position={[0, 2.02, 0.04]}>
        <mesh scale={[1.06, 1, 0.96]} castShadow>
          <sphereGeometry args={[0.78, 40, 30]} />
          <Gloss color={colors.fur} roughness={0.72} clearcoat={0.35} clearcoatRoughness={0.4} />
        </mesh>
        {/* cheek fluff */}
        <mesh position={[-0.6, -0.1, 0.16]} scale={[0.9, 0.8, 0.7]}>
          <sphereGeometry args={[0.34, 22, 16]} />
          <Gloss color={colors.fur} roughness={0.82} clearcoat={0.2} />
        </mesh>
        <mesh position={[0.6, -0.1, 0.16]} scale={[0.9, 0.8, 0.7]}>
          <sphereGeometry args={[0.34, 22, 16]} />
          <Gloss color={colors.fur} roughness={0.82} clearcoat={0.2} />
        </mesh>
        {/* forehead tuft */}
        <mesh position={[0, 0.58, 0.28]} scale={[0.3, 0.26, 0.22]}>
          <sphereGeometry args={[0.34, 18, 14]} />
          <Gloss color={colors.fur} roughness={0.84} />
        </mesh>

        {/* ears */}
        <group ref={earL} position={[-0.42, 0.58, -0.02]}>
          <mesh position={[0, 0.16, 0]}>
            <coneGeometry args={[0.26, 0.52, 18]} />
            <Gloss color={colors.fur} roughness={0.76} clearcoat={0.3} />
          </mesh>
          <mesh position={[0, 0.12, 0.12]} rotation={[0.12, 0, 0]} scale={[0.62, 0.68, 0.5]}>
            <coneGeometry args={[0.26, 0.52, 16]} />
            <Gloss color={colors.inner} roughness={0.55} />
          </mesh>
        </group>
        <group ref={earR} position={[0.42, 0.58, -0.02]}>
          <mesh position={[0, 0.16, 0]} rotation={[0, 0, 0.02]}>
            <coneGeometry args={[0.26, 0.52, 18]} />
            <Gloss color={colors.fur} roughness={0.76} clearcoat={0.3} />
          </mesh>
          <mesh position={[0, 0.12, 0.12]} rotation={[0.12, 0, 0]} scale={[0.62, 0.68, 0.5]}>
            <coneGeometry args={[0.26, 0.52, 16]} />
            <Gloss color={colors.inner} roughness={0.55} />
          </mesh>
        </group>

        {/* eyes */}
        <group ref={eyes}>
          <mesh position={[-0.28, 0.06, 0.68]} scale={[1, 1.12, 0.6]}>
            <sphereGeometry args={[0.095, 22, 18]} />
            <Gloss color={colors.eye} roughness={0.12} />
          </mesh>
          <mesh position={[0.28, 0.06, 0.68]} scale={[1, 1.12, 0.6]}>
            <sphereGeometry args={[0.095, 22, 18]} />
            <Gloss color={colors.eye} roughness={0.12} />
          </mesh>
          <mesh position={[-0.255, 0.1, 0.75]}>
            <sphereGeometry args={[0.032, 12, 10]} />
            <meshBasicMaterial color="#fffaf3" />
          </mesh>
          <mesh position={[0.305, 0.1, 0.75]}>
            <sphereGeometry args={[0.032, 12, 10]} />
            <meshBasicMaterial color="#fffaf3" />
          </mesh>
        </group>

        {/* blush */}
        <mesh position={[-0.5, -0.16, 0.6]} scale={[0.9, 0.5, 0.4]}>
          <sphereGeometry args={[0.16, 16, 12]} />
          <meshBasicMaterial color={P.pink} transparent opacity={0.28} />
        </mesh>
        <mesh position={[0.5, -0.16, 0.6]} scale={[0.9, 0.5, 0.4]}>
          <sphereGeometry args={[0.16, 16, 12]} />
          <meshBasicMaterial color={P.pink} transparent opacity={0.28} />
        </mesh>

        {/* nose + mouth */}
        <mesh position={[0, -0.1, 0.76]} scale={[1.5, 1, 0.9]}>
          <sphereGeometry args={[0.058, 18, 14]} />
          <Gloss color={colors.inner} roughness={0.3} />
        </mesh>
        <mesh position={[-0.055, -0.22, 0.72]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.055, 0.011, 8, 18, Math.PI]} />
          <meshBasicMaterial color="#7a5260" />
        </mesh>
        <mesh position={[0.055, -0.22, 0.72]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.055, 0.011, 8, 18, Math.PI]} />
          <meshBasicMaterial color="#7a5260" />
        </mesh>

        {[-1, 1].flatMap((side) => [0, 1, 2].map((i) => whisker(side, i)))}

        {/* collar + tag */}
        <mesh position={[0, -0.62, 0.02]} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.62, 0.06, 12, 44]} />
          <Gloss color={colors.collar} roughness={0.28} />
        </mesh>
        <mesh position={[0, -0.82, 0.5]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.3, 0.3, 0.05]} />
          <Gloss color="#f2cfa0" roughness={0.16} metalness={0.6} />
        </mesh>
      </group>

      {/* pedestal */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[1.34, 1.42, 0.08, 56]} />
        <Gloss color={P.blush} roughness={0.55} clearcoat={0.3} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 0.22, 48]} />
        <Gloss color={P.cream} roughness={0.6} />
      </mesh>

      {/* hover halo */}
      {hovered && (
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.012, 8, 60]} />
          <meshBasicMaterial color={P.pink} />
        </mesh>
      )}
    </group>
  )
}
