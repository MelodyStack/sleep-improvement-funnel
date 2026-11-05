import { useEffect, useMemo, useState } from 'react'
import type { Answers, Section } from './types'
import { FAQS, PLAN_STAGES, REVIEWS, WEEK_PLAN } from './content'
import './index.css'

type StepId =
  | 'motivation'
  | 'social'
  | 'value'
  | 'age'
  | 'sleepQuality'
  | 'issues'
  | 'wakeFeeling'
  | 'stress'
  | 'scienceSleep'
  | 'activity'
  | 'walkHabit'
  | 'sleepGoal'
  | 'commitment'
  | 'loader'
  | 'results'
  | 'journey'
  | 'twelveWeek'
  | 'transformation'
  | 'email'
  | 'paywall'
  | 'checkout'

const STEPS: StepId[] = [
  'motivation',
  'social',
  'value',
  'age',
  'sleepQuality',
  'issues',
  'wakeFeeling',
  'stress',
  'scienceSleep',
  'activity',
  'walkHabit',
  'sleepGoal',
  'commitment',
  'loader',
  'results',
  'journey',
  'twelveWeek',
  'transformation',
  'email',
  'paywall',
  'checkout',
]

function sectionFor(step: StepId): Section {
  if (['age', 'sleepQuality', 'issues', 'wakeFeeling', 'stress', 'scienceSleep'].includes(step)) return 'about'
  if (['activity', 'walkHabit', 'sleepGoal', 'commitment'].includes(step)) return 'body'
  if (['loader', 'results', 'journey', 'twelveWeek', 'transformation', 'email', 'paywall', 'checkout'].includes(step))
    return 'plan'
  return null
}

function progressFor(step: StepId): { about: number; body: number; plan: number } {
  const aboutSteps: StepId[] = ['age', 'sleepQuality', 'issues', 'wakeFeeling', 'stress', 'scienceSleep']
  const bodySteps: StepId[] = ['activity', 'walkHabit', 'sleepGoal', 'commitment']
  const planSteps: StepId[] = [
    'loader',
    'results',
    'journey',
    'twelveWeek',
    'transformation',
    'email',
    'paywall',
    'checkout',
  ]
  const order = [...aboutSteps, ...bodySteps, ...planSteps]
  const idx = order.indexOf(step)
  if (idx < 0) return { about: 0, body: 0, plan: 0 }

  const aboutDone = idx >= aboutSteps.length
  const bodyDone = idx >= aboutSteps.length + bodySteps.length
  const aboutIdx = aboutSteps.indexOf(step)
  const bodyIdx = bodySteps.indexOf(step)
  const planIdx = planSteps.indexOf(step)

  return {
    about: aboutDone ? 100 : Math.round(((aboutIdx + 1) / aboutSteps.length) * 100),
    body: bodyDone ? 100 : bodyIdx >= 0 ? Math.round(((bodyIdx + 1) / bodySteps.length) * 100) : 0,
    plan: planIdx >= 0 ? Math.round(((planIdx + 1) / planSteps.length) * 100) : 0,
  }
}

function sleepScore(a: Answers): number {
  let score = 72
  if (a.sleepQuality === 'barely') score -= 18
  if (a.sleepQuality === 'wake') score -= 12
  if (a.sleepQuality === 'struggle') score -= 10
  if (a.issues.length >= 3) score -= 8
  if (a.stress === 'high') score -= 6
  if (a.wakeFeeling === 'exhausted') score -= 6
  if (a.walkHabit === 'daily') score += 6
  return Math.max(28, Math.min(86, score))
}

export default function App() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({ issues: [], plan: '12' })
  const [micro, setMicro] = useState('')
  const [reviewIdx, setReviewIdx] = useState(0)
  const [stage, setStage] = useState(0)
  const [seconds, setSeconds] = useState(9 * 60 + 48)

  const step = STEPS[index]
  const section = sectionFor(step)
  const bars = progressFor(step)
  const score = useMemo(() => sleepScore(answers), [answers])

  useEffect(() => {
    if (step !== 'paywall') return
    const t = window.setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => window.clearInterval(t)
  }, [step])

  useEffect(() => {
    if (step !== 'social') return
    const t = window.setInterval(() => setReviewIdx((i) => (i + 1) % REVIEWS.length), 4200)
    return () => window.clearInterval(t)
  }, [step])

  useEffect(() => {
    if (step !== 'loader') return
    const t = window.setTimeout(() => go(1), 2600)
    return () => window.clearTimeout(t)
  }, [step])

  function go(delta: number) {
    setMicro('')
    setIndex((i) => Math.max(0, Math.min(STEPS.length - 1, i + delta)))
  }

  function selectAndAdvance(patch: Partial<Answers>, note?: string, delay = 650) {
    setAnswers((a) => ({ ...a, ...patch }))
    if (note) setMicro(note)
    window.setTimeout(() => go(1), delay)
  }

  function toggleIssue(id: string) {
    setAnswers((a) => {
      const has = a.issues.includes(id)
      return { ...a, issues: has ? a.issues.filter((x) => x !== id) : [...a.issues, id] }
    })
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="app-shell">
      <div className="phone">
        {section && (
          <div className="step" style={{ paddingBottom: 0, flex: '0 0 auto' }}>
            <div className="progress">
              <button className="back-btn" type="button" aria-label="Go back" onClick={() => go(-1)}>
                ‹
              </button>
              {(
                [
                  ['about', 'About you', bars.about],
                  ['body', 'Your sleep', bars.body],
                  ['plan', 'Your plan', bars.plan],
                ] as const
              ).map(([key, label, value]) => (
                <div
                  key={key}
                  className={`progress-seg ${section === key ? 'active' : value >= 100 ? 'done' : ''}`}
                >
                  <label>{label}</label>
                  <div className="bar">
                    <i style={{ width: `${section === key || value > 0 ? value : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'motivation' && (
          <div className="step">
            <div className="brand-pill">
              NightWalk <span>· Better sleep</span>
            </div>
            <h1 style={{ marginTop: 18 }}>What would help your sleep the most right now?</h1>
            <div className="options">
              {[
                ['calm', 'Quieter mind at bedtime', '🧠'],
                ['stay', 'Staying asleep through the night', '🌙'],
                ['energy', 'Waking up rested', '☀️'],
                ['all', 'All of the above', '✨'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  className={`option ${answers.motivation === id ? 'selected' : ''}`}
                  type="button"
                  onClick={() =>
                    selectAndAdvance(
                      { motivation: id },
                      id === 'all' ? 'We can work on all of that.' : 'Noted.',
                    )
                  }
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.motivation === id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            {micro && <p className="micro">{micro}</p>}
          </div>
        )}

        {step === 'social' && (
          <div className="step">
            <div className="brand-pill">✓ {answers.motivation === 'all' ? 'All of the above' : 'Your pick'}</div>
            <h1 style={{ marginTop: 16 }}>Better sleep through walking</h1>
            <p className="lede">Used by people who fixed their nights with a simple evening walk.</p>
            <div className="review-card">
              <div className="who">
                <div className="avatar">{REVIEWS[reviewIdx].initials}</div>
                <div>
                  <strong>{REVIEWS[reviewIdx].name}</strong>
                  <div className="stars-row">★★★★★</div>
                </div>
              </div>
              <p>“{REVIEWS[reviewIdx].quote}”</p>
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'value' && (
          <div className="step">
            <h1>Evening walks for deeper sleep</h1>
            <p className="lede">
              You get a 12-week walking plan timed for late day. It helps you wind down, feel ready for bed, and stay
              asleep more often.
            </p>
            <div className="hero-card">
              <div className="hero-visual">
                <div className="stars" />
                <div className="moon" />
                <strong>NightWalk plan</strong>
                <p>20 to 30 min · easy pace · evening window</p>
              </div>
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                Build my sleep plan
              </button>
              <p className="hint">Takes about 2 minutes · Free to start</p>
            </div>
          </div>
        )}

        {step === 'age' && (
          <div className="step">
            <h1>What’s your age range?</h1>
            <p className="lede">Sleep needs change with age. We match pace and timing to your group.</p>
            <div className="grid-2">
              {[
                ['30-39', '30-39'],
                ['40-49', '40-49'],
                ['50-59', '50-59'],
                ['60+', '60+'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`age-card ${answers.ageRange === id ? 'selected' : ''}`}
                  onClick={() =>
                    selectAndAdvance(
                      { ageRange: id },
                      id === '30-39' ? 'Good age to lock in sleep habits.' : 'Pace and recovery will match your age group.',
                    )
                  }
                >
                  <div className="photo">{label}</div>
                </button>
              ))}
            </div>
            {micro && <p className="micro">{micro}</p>}
          </div>
        )}

        {step === 'sleepQuality' && (
          <div className="step">
            <h1>How are your nights lately?</h1>
            <div className="options">
              {[
                ['barely', 'I barely sleep', '😫'],
                ['wake', 'I wake up a lot', '😕'],
                ['struggle', 'I struggle to fall asleep', '😑'],
                ['ok', 'Mostly okay, want better', '🙂'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.sleepQuality === id ? 'selected' : ''}`}
                  onClick={() => selectAndAdvance({ sleepQuality: id }, 'We will plan around that.')}
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.sleepQuality === id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'issues' && (
          <div className="step">
            <h1>What shows up most for you?</h1>
            <p className="lede">Select all that apply.</p>
            <div className="options">
              {[
                ['racing', 'Racing thoughts at night', '🧠'],
                ['wake3', '3 a.m. wake-ups', '🕐'],
                ['stress', 'Daytime stress that follows me to bed', '😤'],
                ['screens', 'Phone / screens before bed', '📱'],
                ['cravings', 'Late-night cravings', '🍫'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.issues.includes(id) ? 'selected' : ''}`}
                  onClick={() => toggleIssue(id)}
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.issues.includes(id) ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" disabled={!answers.issues.length} onClick={() => go(1)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'wakeFeeling' && (
          <div className="step">
            <h1>How do you usually feel when you wake up?</h1>
            <div className="options">
              {[
                ['exhausted', 'Exhausted', '😩'],
                ['foggy', 'Foggy for hours', '🌫️'],
                ['okay', 'Okay, not great', '😐'],
                ['ready', 'Ready to go', '⚡'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.wakeFeeling === id ? 'selected' : ''}`}
                  onClick={() => selectAndAdvance({ wakeFeeling: id })}
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.wakeFeeling === id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'stress' && (
          <div className="step">
            <h1>How high is your daily stress?</h1>
            <div className="options">
              {[
                ['high', 'High, always on', '🔥'],
                ['medium', 'Medium, comes and goes', '🌊'],
                ['low', 'Low, mostly manageable', '🌿'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.stress === id ? 'selected' : ''}`}
                  onClick={() => selectAndAdvance({ stress: id }, 'Stress and sleep feed each other.')}
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.stress === id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            {micro && <p className="micro">{micro}</p>}
          </div>
        )}

        {step === 'scienceSleep' && (
          <div className="step">
            <p className="hint" style={{ textAlign: 'left', margin: 0 }}>
              BASED ON YOUR ANSWERS
            </p>
            <h1 style={{ marginTop: 8 }}>Poor sleep makes weight harder and stress louder</h1>
            <div className="loop">
              <span>Short sleep</span>
              <span>↑ Hunger</span>
              <span>↑ Cortisol</span>
              <span>Cravings</span>
              <span>Worse nights</span>
            </div>
            <div className="insight">
              <p>
                Research shows sleep restriction increases hunger and calorie intake, and can shift weight loss away from
                fat when you are dieting. Walking helps by making you sleepier later, supporting your body clock, and
                calming stress. Nights get quieter. Days get easier.
              </p>
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'activity' && (
          <div className="step">
            <h1>How active are you right now?</h1>
            <div className="options">
              {[
                ['sitting', 'Mostly sitting', '💻'],
                ['light', 'Light activity', '🚶'],
                ['active', 'Very active', '👟'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.activity === id ? 'selected' : ''}`}
                  onClick={() => selectAndAdvance({ activity: id })}
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.activity === id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'walkHabit' && (
          <div className="step">
            <h1>Do you walk regularly?</h1>
            <div className="options">
              {[
                ['no', 'Not really', '🌱'],
                ['stopped', 'I used to, but stopped', '😬'],
                ['sometimes', 'Sometimes', '🚶'],
                ['daily', 'Yes, almost daily', '👟'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.walkHabit === id ? 'selected' : ''}`}
                  onClick={() =>
                    selectAndAdvance(
                      { walkHabit: id },
                      id === 'daily' ? 'We will time those walks for sleep.' : 'We will start easy and build up.',
                    )
                  }
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.walkHabit === id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            {micro && <p className="micro">{micro}</p>}
          </div>
        )}

        {step === 'sleepGoal' && (
          <div className="step">
            <h1>Your main sleep goal?</h1>
            <div className="options">
              {[
                ['fall', 'Fall asleep faster', '🛏️'],
                ['stay', 'Stay asleep longer', '🌙'],
                ['wake', 'Wake up refreshed', '☀️'],
                ['all', 'All three', '✨'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.sleepGoal === id ? 'selected' : ''}`}
                  onClick={() => selectAndAdvance({ sleepGoal: id }, 'The 12-week plan focuses on that.')}
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.sleepGoal === id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            {micro && <p className="micro">{micro}</p>}
          </div>
        )}

        {step === 'commitment' && (
          <div className="step">
            <h1>Can you walk 20 to 30 minutes most evenings?</h1>
            <p className="lede">This is the core habit. Easy talking pace. No running required.</p>
            <div className="options">
              {[
                ['yes', 'Yes, I can do that', '💪'],
                ['think', 'I think so', '🙌'],
                ['unsure', 'Not sure yet', '🤔'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.commitment === id ? 'selected' : ''}`}
                  onClick={() =>
                    selectAndAdvance(
                      { commitment: id },
                      id === 'yes' ? 'Showing up most nights is what helps.' : 'We will keep the start simple.',
                    )
                  }
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.commitment === id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            {micro && <p className="micro">{micro}</p>}
          </div>
        )}

        {step === 'loader' && (
          <div className="loader-wrap">
            <h1>Building your plan</h1>
            <p className="lede">Setting up your 12-week NightWalk sleep plan...</p>
            <div className="loader-bar">
              <i />
            </div>
            <div className="check-list">
              <div>
                <span>Sleep pattern</span>
                <span className="ok">✓</span>
              </div>
              <div>
                <span>Stress & evening timing</span>
                <span className="ok">✓</span>
              </div>
              <div>
                <span>Walking progression</span>
                <span className="ok">✓</span>
              </div>
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="step">
            <h1>Your sleep score</h1>
            <p className="lede">Based on your answers. This is a starting point, not a diagnosis.</p>
            <div className="score-ring">
              <div>
                <strong>{score}</strong>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>/ 100</div>
              </div>
            </div>
            <div className="metric-grid">
              <div className="metric">
                <small>Nights</small>
                <strong>{answers.sleepQuality === 'ok' ? 'Fair' : 'Strained'}</strong>
              </div>
              <div className="metric">
                <small>Stress</small>
                <strong>{answers.stress === 'high' ? 'High' : answers.stress === 'low' ? 'Low' : 'Medium'}</strong>
              </div>
              <div className="metric">
                <small>Walk base</small>
                <strong>{answers.walkHabit === 'daily' ? 'Strong' : 'Building'}</strong>
              </div>
            </div>
            <div className="insight">
              <p>
                An evening walking plan over 12 weeks uses light movement, better timing, and a clear bedtime routine.
                That helps most when stress or broken sleep is part of your pattern.
              </p>
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                See the 12-week plan
              </button>
            </div>
          </div>
        )}

        {step === 'journey' && (
          <div className="step">
            <h1>Your 4 sleep stages</h1>
            <div className="stages">
              {PLAN_STAGES.map((s, i) => (
                <button key={s.id} type="button" className={stage === i ? 'on' : ''} onClick={() => setStage(i)}>
                  Stage {s.id}
                </button>
              ))}
            </div>
            <div className="plan-card">
              <div className="visual">{PLAN_STAGES[stage].title}</div>
              <div className="body">
                <p>{PLAN_STAGES[stage].body}</p>
              </div>
            </div>
            <div className="footer-cta">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  if (stage < PLAN_STAGES.length - 1) setStage(stage + 1)
                  else go(1)
                }}
              >
                {stage < PLAN_STAGES.length - 1 ? 'Next stage' : 'Get started'}
              </button>
            </div>
          </div>
        )}

        {step === 'twelveWeek' && (
          <div className="step">
            <h1>Your 12-week better-sleep walking plan</h1>
            <p className="lede">
              Evening-first walks that get a bit longer over time. Research links this kind of routine with longer
              sleep and fewer overnight wake-ups. You follow it as a simple weekly habit.
            </p>
            <div className="week-grid">
              {WEEK_PLAN.map((w) => (
                <div className="week" key={w.label}>
                  <strong>{w.label}</strong>
                  <span>{w.text}</span>
                </div>
              ))}
            </div>
            <div className="warn">
              Educational program only, not medical treatment. Seek care for severe insomnia, apnea symptoms, or sudden
              health changes.
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                Preview my results
              </button>
            </div>
          </div>
        )}

        {step === 'transformation' && (
          <div className="step">
            <h1>What members typically aim for</h1>
            <p className="lede">Example targets for people who walk most weeks for about 12 weeks. Not a guarantee.</p>
            <div className="compare">
              <div className="compare-top">
                <div className="now">
                  <small>NOW</small>
                  <strong>Rough nights</strong>
                </div>
                <div className="goal">
                  <small>GOAL</small>
                  <strong>Deeper rest</strong>
                </div>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td>Fall asleep</td>
                    <td>Faster, less scrolling</td>
                  </tr>
                  <tr>
                    <td>Overnight wake-ups</td>
                    <td>Fewer / shorter</td>
                  </tr>
                  <tr>
                    <td>Morning energy</td>
                    <td>Clearer, steadier</td>
                  </tr>
                  <tr>
                    <td>Evening stress</td>
                    <td>Downshifted</td>
                  </tr>
                  <tr>
                    <td>Cravings</td>
                    <td>Easier to manage</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'email' && (
          <div className="step">
            <div className="success-badge">✓</div>
            <p className="hint" style={{ color: 'var(--success)', fontWeight: 700 }}>
              YOUR PLAN IS READY
            </p>
            <h1>Enter your email to see your NightWalk plan</h1>
            <div className="email-box">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={answers.email ?? ''}
                onChange={(e) => setAnswers((a) => ({ ...a, email: e.target.value }))}
              />
            </div>
            <div className="footer-cta">
              <button
                className="btn btn-primary"
                type="button"
                disabled={!answers.email || !answers.email.includes('@')}
                onClick={() => go(1)}
              >
                See my results
              </button>
              <p className="hint">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        )}

        {step === 'paywall' && (
          <div className="step">
            <div className="timer">
              <div>
                <div className="clock">
                  {mm}:{ss}
                </div>
                <small style={{ color: 'var(--muted)' }}>Limited intro pricing</small>
              </div>
              <button className="btn btn-accent" style={{ width: 'auto', padding: '10px 14px' }} type="button" onClick={() => go(1)}>
                GET MY PLAN
              </button>
            </div>
            <h1>Better sleep in 12 weeks</h1>
            <p className="lede">NightWalk evening walks · clear weekly targets · steady build</p>
            <div className="pricing">
              {(
                [
                  ['1', '1-Week', '$9.99', '$4.99', '50% OFF', '$0.71/day'],
                  ['4', '4-Week', '$29.99', '$17.99', '40% OFF', '$0.64/day'],
                  ['12', '12-Week', '$59.99', '$29.99', '50% OFF', '$0.36/day', true],
                ] as const
              ).map(([id, label, old, price, tag, day, popular]) => (
                <button
                  key={id}
                  type="button"
                  className={`plan-option ${answers.plan === id ? 'selected' : ''}`}
                  onClick={() => setAnswers((a) => ({ ...a, plan: id }))}
                >
                  {popular && <span className="badge">Most popular</span>}
                  <strong>{label}</strong>
                  <div className="price">
                    <span className="old">{old}</span>
                    {price}
                  </div>
                  <span style={{ color: 'var(--success)', fontSize: 12, fontWeight: 700 }}>{tag}</span>
                  <span className="day">{day}</span>
                </button>
              ))}
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                GET MY PLAN
              </button>
              <p className="fine">
                Intro discount applies to your first term. Subscriptions renew at standard plan pricing unless canceled
                at least 1 day before renewal. Cancel in Profile → Subscription.
              </p>
            </div>
            <div className="stat-block" style={{ marginTop: 18 }}>
              <div className="big">2.7×</div>
              <p>
                Physical activity research links regular movement with better sleep quality. Walking 3 to 5 times a week
                for 12 or more weeks is a common, realistic dose in those studies.
              </p>
            </div>
            <h2 style={{ marginTop: 22 }}>Everything in your plan</h2>
            <div className="week-grid">
              {[
                ['Evening easy-pace walks', 'Tired enough for sleep, without hard workouts'],
                ['Wind-down timing', 'When to walk so bedtime feels quieter'],
                ['12-week progression', 'Clear weekly targets you can keep'],
                ['Sleep and stress basics', 'Why nights improve when you move during the day'],
              ].map(([t, d]) => (
                <div className="week" key={t}>
                  <strong>{t}</strong>
                  <span>{d}</span>
                </div>
              ))}
            </div>
            <h2 style={{ marginTop: 22 }}>Common questions</h2>
            <div className="faq">
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                GET MY PLAN
              </button>
              <p className="hint">30-day money-back guarantee · Cancel anytime</p>
            </div>
          </div>
        )}

        {step === 'checkout' && (
          <div className="step">
            <button className="back-btn" type="button" aria-label="Go back" onClick={() => go(-1)} style={{ marginBottom: 12 }}>
              ‹
            </button>
            <h1>Complete your checkout</h1>
            <div className="review-card" style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>{answers.plan === '1' ? '1-Week' : answers.plan === '4' ? '4-Week' : '12-Week'} Plan</span>
                <strong>{answers.plan === '1' ? '$9.99' : answers.plan === '4' ? '$29.99' : '$59.99'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)', marginBottom: 8 }}>
                <span>Intro discount</span>
                <span>{answers.plan === '1' ? '−$5.00' : answers.plan === '4' ? '−$12.00' : '−$30.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                <span>Total today</span>
                <span>{answers.plan === '1' ? '$4.99' : answers.plan === '4' ? '$17.99' : '$29.99'}</span>
              </div>
              <p className="fine" style={{ marginTop: 10 }}>
                Applied promo: SLEEPWALK12 · Demo checkout only (no real charge)
              </p>
            </div>
            <div className="email-box">
              <label>Card number</label>
              <input placeholder="4242 4242 4242 4242" disabled />
            </div>
            <div className="footer-cta">
              <button
                className="btn btn-accent"
                type="button"
                onClick={() => alert('Demo only. Stripe is not connected yet.')}
              >
                CONTINUE
              </button>
              <p className="hint">Secure checkout · 30-day money-back · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
