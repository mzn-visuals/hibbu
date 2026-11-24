import { useCallback, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import ConfettiLayer from './components/ConfettiLayer'
import Hero from './sections/Hero'
import Universe from './sections/Universe'
import Chapter from './sections/Chapter'
import Fluffy from './sections/Fluffy'
import Archive from './sections/Archive'
import Reasons from './sections/Reasons'
import Letter from './sections/Letter'
import Finale from './sections/Finale'
import { staticMode } from './lib/device'

export default function App() {
  const [loaderDone, setLoaderDone] = useState(staticMode)
  const [ready, setReady] = useState(staticMode)

  const handleLoaderDone = useCallback(() => {
    setLoaderDone(true)
    window.scrollTo(0, 0)
    setTimeout(() => setReady(true), 80)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#universe">
        Skip to the birthday
      </a>
      <Cursor />
      <Nav />
      {!loaderDone && <Loader onDone={handleLoaderDone} />}

      <main>
        <Hero ready={ready} />
        <Universe />
        <Chapter />
        <Fluffy />
        <Archive />
        <Reasons />
        <Letter />
        <Finale />
      </main>

      <ConfettiLayer />
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  )
}
