import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import { ContactShadows, Float } from '@react-three/drei'
import {
  Balloon,
  Bow,
  Cake,
  Cherry,
  Envelope,
  Flower,
  Heart,
  Numeral19,
  Ribbon,
  Sparkle,
  StudioLights,
  StudioReflections,
} from './parts'
import { P } from './palette'
import FluffyCat from './Cat'

function CameraParallax({ amount = 0.22, stiffness = 3 }) {
  const { camera } = useThree()
  const reduce = useReducedMotion()
  const base = useRef([camera.position.x, camera.position.y, camera.position.z])

  useFrame((state, delta) => {
    if (reduce) return
    const { pointer } = state
    camera.position.x += (base.current[0] + pointer.x * amount - camera.position.x) * Math.min(1, delta * stiffness)
    camera.position.y += (base.current[1] + pointer.y * amount * 0.6 - camera.position.y) * Math.min(1, delta * stiffness)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function useFit(maxWidth = 5) {
  const { viewport } = useThree()
  return Math.min(1, Math.max(0.4, viewport.width / maxWidth))
}

export function CatScene({ pulse = 0, hovered = false, palette }) {
  const fit = useFit(4.6)
  return (
    <>
      <StudioLights intensity={1.05} />
      <StudioReflections resolution={64} />
      <CameraParallax amount={0.11} />
      <group scale={fit}>
        <FluffyCat pulse={pulse} hovered={hovered} palette={palette} />
      </group>
      <ContactShadows
        position={[0, -1.08, 0]}
        opacity={0.38}
        scale={9}
        blur={2.6}
        far={2.6}
        color="#8a4050"
        resolution={512}
      />
    </>
  )
}

export function HeroScene({ spinKey = 0, onPoke }) {
  const fit = useFit(6.7)

  return (
    <>
      <StudioLights intensity={1.05} />
      <StudioReflections resolution={96} />
      <CameraParallax amount={0.26} />
      <group scale={fit}>
      <group position={[0, 0.06, 0]}>
        <Numeral19
          scale={0.88}
          spinKey={spinKey}
          onClick={onPoke}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        />
      </group>

      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1.1} floatingRange={[-0.2, 0.24]}>
        <Cherry scale={1.05} position={[-2.92, -0.3, 0.5]} rotation={[0, 0, 0.2]} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1} floatingRange={[-0.18, 0.2]}>
        <Bow scale={0.82} color={P.pink} position={[2.92, -0.95, 0.5]} rotation={[0.1, 0, -0.18]} />
      </Float>
      <Float speed={1.1} rotationIntensity={0.45} floatIntensity={1.2} floatingRange={[-0.15, 0.24]}>
        <Heart scale={0.48} color={P.red} position={[2.55, 0.55, -0.2]} rotation={[0.1, -0.2, 0.25]} />
      </Float>
      <Float speed={1.35} rotationIntensity={0.5} floatIntensity={0.9} floatingRange={[-0.2, 0.16]}>
        <Flower scale={0.56} color={P.peach} center={P.red} position={[-2.55, -1.4, 0.3]} rotation={[0.2, 0, 0.1]} />
      </Float>
      <Float speed={0.9} rotationIntensity={0.3} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
        <Ribbon
          scale={0.62}
          color={P.blush}
          position={[2.15, 1.45, -1.3]}
          rotation={[0.3, 0.4, 0.2]}
          turns={1.6}
          height={2.4}
          thickness={0.075}
        />
      </Float>
      <Float speed={1.8} rotationIntensity={0.7} floatIntensity={1.4} floatingRange={[-0.3, 0.3]}>
        <Sparkle scale={0.5} position={[-1.95, 1.62, -0.6]} />
      </Float>
      <Float speed={2} rotationIntensity={0.9} floatIntensity={1.6} floatingRange={[-0.3, 0.3]}>
        <Sparkle scale={0.32} color={P.blush} position={[1.5, -1.75, 0.2]} />
      </Float>
      </group>

      <ContactShadows
        position={[0, -1.82, 0]}
        opacity={0.32}
        scale={15}
        blur={2.9}
        far={3.4}
        color="#7a2b40"
        resolution={512}
      />
    </>
  )
}

export function UniverseScene() {
  const group = useRef(null)
  const fit = useFit(5.2)
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.16
  })

  return (
    <>
      <StudioLights intensity={1.1} />
      <StudioReflections resolution={96} />
      <CameraParallax amount={0.18} />
      <group ref={group} position={[0, -0.15, 0]} scale={fit}>
        <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.6} floatingRange={[-0.1, 0.12]}>
          <group>
            <Cake scale={1.12} />
          </group>
        </Float>

        <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
          <Cherry scale={1.15} position={[-2.55, 1.35, 0.4]} rotation={[0.2, 0, 0.3]} />
        </Float>
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.9} floatingRange={[-0.2, 0.2]}>
          <Cherry scale={0.9} position={[2.5, 1.9, -0.2]} rotation={[-0.2, 0.3, -0.4]} />
        </Float>
        <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.1} floatingRange={[-0.2, 0.2]}>
          <Bow scale={0.84} color={P.pink} position={[2.7, 0.15, 0.7]} rotation={[0.1, -0.2, 0.16]} />
        </Float>
        <Float speed={1.05} rotationIntensity={0.4} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
          <Heart scale={0.62} color={P.red} position={[-2.2, -0.55, 0.8]} rotation={[0, 0.2, -0.18]} />
        </Float>
        <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
          <Heart scale={0.4} color={P.pinkDeep} position={[1.9, -1.15, 1]} rotation={[0, -0.2, 0.3]} />
        </Float>
        <Float speed={1.15} rotationIntensity={0.4} floatIntensity={0.9} floatingRange={[-0.2, 0.2]}>
          <Flower scale={0.82} color={P.blush} center={P.red} position={[-1.95, 2.15, -0.6]} rotation={[0.1, 0.2, 0.2]} />
        </Float>
        <Float speed={0.95} rotationIntensity={0.35} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
          <Ribbon
            scale={1}
            color={P.pink}
            position={[0.4, 2.6, -1.4]}
            rotation={[0.2, 0.6, -0.3]}
            turns={1.4}
            height={3.2}
            thickness={0.06}
          />
        </Float>
        <Float speed={1.7} rotationIntensity={0.7} floatIntensity={1.3} floatingRange={[-0.2, 0.2]}>
          <Balloon scale={0.9} color={P.pink} position={[-3.2, -1.6, -0.6]} rotation={[0, 0, 0.1]} />
        </Float>
      </group>
      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.34}
        scale={16}
        blur={2.8}
        far={3.6}
        color="#7a2b40"
        resolution={512}
      />
    </>
  )
}

export function ArchiveScene({ pointer = 0 }) {
  const group = useRef(null)
  const fit = useFit(4.4)
  useFrame((state, delta) => {
    if (!group.current) return
    const target = 0.35 + state.pointer.x * 0.35 + pointer * 0.4
    group.current.rotation.y += (target - group.current.rotation.y) * Math.min(1, delta * 3)
    group.current.rotation.x = -0.06 + state.pointer.y * 0.08
  })

  return (
    <>
      <StudioLights intensity={1} />
      <StudioReflections resolution={64} />
      <group ref={group} position={[0, 0, 0]} scale={fit}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.72, 0.035, 12, 80]} />
          <meshPhysicalMaterial color={P.red} roughness={0.3} metalness={0.3} />
        </mesh>
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8} floatingRange={[-0.12, 0.14]}>
          <Cherry scale={1.45} position={[-0.1, 0.3, 0.2]} rotation={[0.1, 0, 0.2]} />
        </Float>
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.9} floatingRange={[-0.12, 0.14]}>
          <Bow scale={0.9} color={P.pinkDeep} position={[1.05, -0.75, -0.3]} rotation={[0.2, 0.3, 0.1]} />
        </Float>
        <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.9} floatingRange={[-0.12, 0.14]}>
          <Heart scale={0.58} color={P.pink} position={[-1.15, -0.7, 0.1]} rotation={[0.1, 0, -0.2]} />
        </Float>
        <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.2} floatingRange={[-0.2, 0.2]}>
          <Sparkle scale={0.42} position={[0.9, 1.15, -0.4]} />
        </Float>
        <Float speed={1.7} rotationIntensity={0.7} floatIntensity={1.2} floatingRange={[-0.2, 0.2]}>
          <Sparkle scale={0.28} color={P.blush} position={[-1.45, 1.05, -0.2]} />
        </Float>
        <mesh position={[0, -1.15, -0.6]} scale={[1, 0.35, 1]}>
          <sphereGeometry args={[1.6, 32, 20]} />
          <meshPhysicalMaterial color={P.blush} transparent opacity={0.45} roughness={0.5} />
        </mesh>
      </group>
    </>
  )
}

export function LetterScene({ open = false, onToggle }) {
  const group = useRef(null)
  const fit = useFit(5.6)
  useFrame((state, delta) => {
    if (!group.current) return
    const target = state.pointer.x * 0.18
    group.current.rotation.y += (target - group.current.rotation.y) * Math.min(1, delta * 3)
    group.current.rotation.x = -0.05 - state.pointer.y * 0.06
  })

  return (
    <>
      <StudioLights intensity={1.05} />
      <StudioReflections resolution={64} />
      <group
        ref={group}
        onClick={onToggle}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <Float speed={0.9} rotationIntensity={0.12} floatIntensity={0.4} floatingRange={[-0.06, 0.08]}>
          <Envelope open={open} scale={1.25 * fit} />
        </Float>
        <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
          <Heart scale={0.34} color={P.pink} position={[-1.95, 1.35, -0.4]} rotation={[0.2, 0, 0.2]} />
        </Float>
        <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
          <Heart scale={0.24} color={P.red} position={[2.05, 0.9, -0.2]} rotation={[-0.1, 0, -0.3]} />
        </Float>
        <Float speed={1.7} rotationIntensity={0.8} floatIntensity={1.2} floatingRange={[-0.2, 0.2]}>
          <Sparkle scale={0.34} position={[1.7, -1.2, 0]} />
        </Float>
      </group>
      <ContactShadows
        position={[0, -1.75, 0]}
        opacity={0.3}
        scale={12}
        blur={3}
        far={3}
        color="#7a2b40"
        resolution={512}
      />
    </>
  )
}

export function FinaleScene({ spinKey = 0, celebrateKey = 0 }) {
  const group = useRef(null)
  const fit = useFit(7)
  const burst = useRef(0)
  const heartsRef = useRef(null)

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.12
    burst.current = Math.max(0, burst.current - delta * 0.55)
    if (heartsRef.current) {
      heartsRef.current.children.forEach((child, i) => {
        const t = burst.current
        const a = (i / heartsRef.current.children.length) * Math.PI * 2
        child.position.set(Math.cos(a) * (1.6 + (1 - t) * 2.4), -0.4 + (1 - t) * 2.4 + Math.sin(i) * 0.4, Math.sin(a) * 1.2)
        child.scale.setScalar(Math.max(0, t) * 0.7 + 0.0001)
        child.rotation.z = a + (1 - t) * 2
      })
    }
  })

  const prev = useRef(celebrateKey)
  if (prev.current !== celebrateKey) {
    prev.current = celebrateKey
    burst.current = 1
  }

  return (
    <>
      <StudioLights intensity={1.15} />
      <StudioReflections resolution={96} />
      <CameraParallax amount={0.2} />
      <group ref={group} position={[0, 0.35, 0]} scale={fit}>
        <Numeral19 scale={0.8} spinKey={spinKey} colorA={P.cream} colorB={P.pinkSoft} />
        <group ref={heartsRef} />
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8} floatingRange={[-0.1, 0.14]}>
          <Cake scale={0.62} position={[0, -1.55, 0.9]} />
        </Float>
        <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
          <Cherry scale={0.75} position={[-2.7, 1.1, 0.4]} />
        </Float>
        <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
          <Bow scale={0.62} color={P.pink} position={[2.6, 0.55, 0.6]} />
        </Float>
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.9} floatingRange={[-0.2, 0.2]}>
          <Balloon scale={0.62} color={P.blush} position={[-2.6, -1.2, -0.4]} />
        </Float>
        <Float speed={1.8} rotationIntensity={0.7} floatIntensity={1.2} floatingRange={[-0.25, 0.25]}>
          <Sparkle scale={0.36} position={[2.3, 1.55, -0.3]} />
        </Float>
      </group>
      <ContactShadows
        position={[0, -2.15, 0]}
        opacity={0.4}
        scale={16}
        blur={3}
        far={3.5}
        color="#5a1027"
        resolution={512}
      />
    </>
  )
}
