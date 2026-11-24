import { useState } from 'react'
import CanvasStage from '../components/CanvasStage'
import { ArchiveScene } from '../three/scenes'
import { Reveal, SplitWords } from '../components/Reveal'
import { archive } from '../content'

export default function Archive() {
  const [pointer, setPointer] = useState(0)

  return (
    <section
      id="archive"
      className="archive section"
      onMouseEnter={() => setPointer((n) => n + 1)}
      onMouseLeave={() => setPointer(0)}
    >
      <div className="archive-rules" aria-hidden="true" />

      <div className="shell">
        <header className="archive-head">
          <Reveal>
            <span className="label">{archive.label}</span>
          </Reveal>

          <h2 className="archive-title">
            <span className="archive-title__main display">
              <SplitWords text={archive.title} />
            </span>
            <span className="archive-title__accent display">
              <SplitWords text={archive.titleAccent} delay={0.1} />
            </span>
          </h2>

          <div className="archive-meta">
            <Reveal delay={0.1}>
              <p className="body-copy archive-standfirst">{archive.standfirst}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <span className="archive-note">{archive.note}</span>
            </Reveal>
          </div>
        </header>

        <div className="archive-grid">
          <div className="archive-plate">
            <div className="archive-plate__stage">
              <CanvasStage
                camera={{ position: [0, 0.2, 5.6], fov: 34 }}
                label="A glossy cherry, a pink bow and a heart arranged as an archival exhibit"
                fallback={null}
              >
                <ArchiveScene pointer={pointer} />
              </CanvasStage>
            </div>
            <div className="archive-plate__caption">
              <span>EXHIBIT A</span>
              <span>CHERRY, BOW, HEART — MIXED MEDIA</span>
              <span>LOANED BY THE UNIVERSE</span>
            </div>
          </div>

          <div className="archive-cards">
            {archive.entries.map((entry, i) => (
            <Reveal
              key={entry.no}
              as="article"
              className={`archive-card archive-card--${entry.span}`}
              delay={0.05 + i * 0.04}
            >
              <div className="archive-card__top">
                <span className="archive-card__no">{entry.no}</span>
                <span className="archive-card__tag">{entry.tag}</span>
              </div>
              <h3 className={`archive-card__title${i % 3 === 1 ? ' is-serif' : ''}`}>{entry.title}</h3>
              <p className="archive-card__body">{entry.body}</p>
              <span className="archive-card__mark" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            </Reveal>
            ))}

          <Reveal className="archive-quote" delay={0.1}>
            <blockquote>
              “Some of this is documented. <em>Most of it is simply known.</em>”
            </blockquote>
            <cite>— THE ARCHIVE, PROBABLY</cite>
          </Reveal>

            <Reveal className="archive-index" delay={0.14}>
              <span className="eyebrow">ARCHIVE INDEX</span>
              <ul>
                {archive.entries.map((entry) => (
                  <li key={entry.no}>
                    <span>{entry.no}</span>
                    <span>{entry.tag}</span>
                  </li>
                ))}
              </ul>
              <span className="archive-index__foot">FILES 007+ STILL SEALED</span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
