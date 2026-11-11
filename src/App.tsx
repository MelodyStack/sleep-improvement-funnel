import { useEffect, useMemo, useState } from 'react'
import type { Answers, Section } from './types'
import { FAQS, MOTIVATIONS, PLAN_STAGES, REVIEWS, WEEK_PLAN } from './content'
import './index.css'

type StepId =
  | 'motivation'
  | 'boost'
  | 'social'
  | 'value'
  | 'age'
  | 'sleepQuality'
  | 'issues'
  | 'wakeFeeling'
  | 'stress'
  | 'scienceSleep'
  | 'sleepHours'
  | 'bedtime'
  | 'sleepGoal'
  | 'rewardPref'
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
  'boost',
  'social',
  'value',
  'age',
  'sleepQuality',
  'issues',
  'wakeFeeling',
  'stress',
  'scienceSleep',
  'sleepHours',
  'bedtime',
  'sleepGoal',
  'rewardPref',
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
  if (['sleepHours', 'bedtime', 'sleepGoal', 'rewardPref', 'commitment'].includes(step)) return 'sleep'
  if (['loader', 'results', 'journey', 'twelveWeek', 'transformation', 'email', 'paywall', 'checkout'].includes(step))
    return 'plan'
  return null
}

function progressFor(step: StepId): { about: number; sleep: number; plan: number } {
  const aboutSteps: StepId[] = ['age', 'sleepQuality', 'issues', 'wakeFeeling', 'stress', 'scienceSleep']
  const sleepSteps: StepId[] = ['sleepHours', 'bedtime', 'sleepGoal', 'rewardPref', 'commitment']
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
  const order = [...aboutSteps, ...sleepSteps, ...planSteps]
  const idx = order.indexOf(step)
  if (idx < 0) return { about: 0, sleep: 0, plan: 0 }

  const aboutDone = idx >= aboutSteps.length
  const sleepDone = idx >= aboutSteps.length + sleepSteps.length
  const aboutIdx = aboutSteps.indexOf(step)
  const sleepIdx = sleepSteps.indexOf(step)
  const planIdx = planSteps.indexOf(step)

  return {
    about: aboutDone ? 100 : Math.round(((aboutIdx + 1) / aboutSteps.length) * 100),
    sleep: sleepDone ? 100 : sleepIdx >= 0 ? Math.round(((sleepIdx + 1) / sleepSteps.length) * 100) : 0,
    plan: planIdx >= 0 ? Math.round(((planIdx + 1) / planSteps.length) * 100) : 0,
  }
}

function sleepScore(a: Answers): number {
  let score = 70
  if (a.sleepQuality === 'barely') score -= 20
  if (a.sleepQuality === 'wake') score -= 14
  if (a.sleepQuality === 'struggle') score -= 10
  if (a.issues.length >= 3) score -= 8
  if (a.stress === 'high') score -= 6
  if (a.wakeFeeling === 'exhausted') score -= 6
  if (a.sleepHours === 'under5' || a.sleepHours === '5to6') score -= 8
  if (a.commitment === 'yes') score += 4
  return Math.max(24, Math.min(88, score))
}

function rewardPotential(a: Answers): string {
  if (a.commitment === 'yes' && a.sleepGoal === '8') return '$40 to $80'
  if (a.commitment === 'yes') return '$30 to $60'
  if (a.commitment === 'think') return '$20 to $45'
  return '$15 to $35'
}

export default function App() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({ issues: [], plan: '12' })
  const [micro, setMicro] = useState('')
  const [reviewIdx, setReviewIdx] = useState(0)
  const [stage, setStage] = useState(0)
  const [seconds, setSeconds] = useState(9 * 60 + 48)
  const [loaderChecks, setLoaderChecks] = useState(0)

  const step = STEPS[index]
  const section = sectionFor(step)
  const bars = progressFor(step)
  const score = useMemo(() => sleepScore(answers), [answers])
  const motivation = answers.motivation ? MOTIVATIONS[answers.motivation] : null

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
    setLoaderChecks(0)
    const a = window.setTimeout(() => setLoaderChecks(1), 900)
    const b = window.setTimeout(() => setLoaderChecks(2), 1800)
    const c = window.setTimeout(() => setLoaderChecks(3), 2700)
    const d = window.setTimeout(() => go(1), 3400)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
      window.clearTimeout(c)
      window.clearTimeout(d)
    }
  }, [step])

  function go(delta: number) {
    setMicro('')
    setIndex((i) => Math.max(0, Math.min(STEPS.length - 1, i + delta)))
  }

  function selectAndAdvance(patch: Partial<Answers>, note?: string, delay = 700) {
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
  const review = REVIEWS[reviewIdx]

  return (
    <div className="app-shell">
      <div className="phone">
        {section && (
          <div className="step progress-wrap">
            <div className="progress">
              <button className="back-btn" type="button" aria-label="Go back" onClick={() => go(-1)}>
                ‹
              </button>
              {(
                [
                  ['about', 'About you', bars.about],
                  ['sleep', 'Your sleep', bars.sleep],
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
              Sleep better <span>· Earn rewards</span>
            </div>
            <h1 style={{ marginTop: 18 }}>What will motivate you to sleep better?</h1>
            <div className="options">
              {(
                [
                  ['plan', MOTIVATIONS.plan.label, MOTIVATIONS.plan.icon],
                  ['rewards', MOTIVATIONS.rewards.label, MOTIVATIONS.rewards.icon],
                  ['coaching', MOTIVATIONS.coaching.label, MOTIVATIONS.coaching.icon],
                  ['social', MOTIVATIONS.social.label, MOTIVATIONS.social.icon],
                  ['all', MOTIVATIONS.all.label, MOTIVATIONS.all.icon],
                ] as const
              ).map(([id, label, icon]) => (
                <button
                  key={id}
                  className={`option ${answers.motivation === id ? 'selected' : ''}`}
                  type="button"
                  onClick={() => selectAndAdvance({ motivation: id }, MOTIVATIONS[id].micro)}
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

        {step === 'boost' && (
          <div className="step">
            <div className="brand-pill soft">✓ {(motivation ?? MOTIVATIONS.all).label}</div>
            <div className="stat-block boost">
              <div className="big">2×</div>
              <h1>{(motivation ?? MOTIVATIONS.all).boostTitle}</h1>
              <p>{(motivation ?? MOTIVATIONS.all).boostBody}</p>
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'social' && (
          <div className="step">
            <div className="brand-pill soft">✓ {motivation?.label ?? 'Your pick'}</div>
            <h1 style={{ marginTop: 16 }}>Sleep better & earn rewards</h1>
            <p className="lede">Trusted by members who get paid for hitting their sleep goals.</p>
            <div className="review-card">
              <div className="who">
                <div className="avatar">{review.initials}</div>
                <div>
                  <strong>{review.name}</strong>
                  <div className="stars-row">★★★★★</div>
                </div>
              </div>
              <p>“{review.quote}”</p>
            </div>
            <div className="dots">
              {REVIEWS.map((_, i) => (
                <span key={i} className={i === reviewIdx ? 'on' : ''} />
              ))}
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                Let's do this
              </button>
            </div>
          </div>
        )}

        {step === 'value' && (
          <div className="step">
            <h1>Hit your sleep goal. Earn gift cards.</h1>
            <p className="lede">
              We will build a personal sleep plan that helps you rest better and earn rewards when you hit your nightly
              goal.
            </p>
            <div className="hero-card">
              <div className="hero-visual reward-visual">
                <div className="stars" />
                <div className="moon" />
                <div className="reward-stack">
                  <div className="goal-chip">7.5 hrs · Goal reached</div>
                  <div className="reward-pill">
                    <span>🎁</span>
                    <div>
                      <strong>+$5.00</strong>
                      <small>Amazon gift card</small>
                    </div>
                  </div>
                </div>
                <strong>SleepClub plan</strong>
                <p>Nightly goals · points · gift cards</p>
              </div>
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                Build my plan
              </button>
              <p className="hint">Takes about 2 minutes · Free to start</p>
            </div>
          </div>
        )}

        {step === 'age' && (
          <div className="step">
            <div className="brand-pill">
              Sleep better <span>· Earn rewards</span>
            </div>
            <h1 style={{ marginTop: 16 }}>What's your age range?</h1>
            <p className="lede">One quick question so we can match your plan and reward pace.</p>
            <div className="grid-2">
              {[
                ['30-39', '30-39', '/images/age-30-39.jpg'],
                ['40-49', '40-49', '/images/age-40-49.jpg'],
                ['50-59', '50-59', '/images/age-50-59.jpg'],
                ['60+', '60+', '/images/age-60-plus.jpg'],
              ].map(([id, label, src]) => (
                <button
                  key={id}
                  type="button"
                  className={`age-card ${answers.ageRange === id ? 'selected' : ''}`}
                  onClick={() =>
                    selectAndAdvance(
                      { ageRange: id },
                      id === '30-39'
                        ? 'Good age to lock in a sleep habit that pays.'
                        : 'Your plan and recovery pace will match your age group.',
                    )
                  }
                >
                  <div className="photo">
                    <img src={src} alt={`${label} age group`} />
                    <span>{label}</span>
                  </div>
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
                  onClick={() => selectAndAdvance({ sleepQuality: id }, 'We will plan rewards around that.')}
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
                ['tired', 'Always tired during the day', '😴'],
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
            <p className="eyebrow">Based on your answers</p>
            <h1 style={{ marginTop: 8 }}>Rewards help people sleep longer. Better sleep makes days easier.</h1>
            <div className="loop">
              <span>Short sleep</span>
              <span>↑ Hunger</span>
              <span>↑ Stress</span>
              <span>Harder nights</span>
              <span>Missed goals</span>
            </div>
            <div className="insight">
              <p>
                Sleep incentive studies show people sleep longer when good nights are paid. Short sleep also raises
                hunger and can make weight harder to manage. SleepClub pairs a clear nightly goal with gift cards so
                you stick with better rest long enough for energy, mood, and appetite to improve.
              </p>
            </div>
            <div className="footer-cta">
              <button className="btn btn-primary" type="button" onClick={() => go(1)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'sleepHours' && (
          <div className="step">
            <h1>How many hours do you usually sleep?</h1>
            <div className="options">
              {[
                ['under5', 'Under 5 hours', '😮'],
                ['5to6', '5 to 6 hours', '😕'],
                ['6to7', '6 to 7 hours', '😐'],
                ['7plus', '7+ hours', '😌'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.sleepHours === id ? 'selected' : ''}`}
                  onClick={() =>
                    selectAndAdvance(
                      { sleepHours: id },
                      id === '7plus' ? 'We will help you protect that streak and earn for it.' : 'We will set a goal you can hit and get paid for.',
                    )
                  }
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.sleepHours === id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            {micro && <p className="micro">{micro}</p>}
          </div>
        )}

        {step === 'bedtime' && (
          <div className="step">
            <h1>When do you usually try to sleep?</h1>
            <div className="options">
              {[
                ['before10', 'Before 10 p.m.', '🕘'],
                ['10to11', '10 to 11 p.m.', '🕙'],
                ['11to12', '11 p.m. to midnight', '🕚'],
                ['after12', 'After midnight', '🌙'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.bedtime === id ? 'selected' : ''}`}
                  onClick={() => selectAndAdvance({ bedtime: id }, 'Your reward window will match this schedule.')}
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.bedtime === id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            {micro && <p className="micro">{micro}</p>}
          </div>
        )}

        {step === 'sleepGoal' && (
          <div className="step">
            <h1>Your sleep goal to earn rewards?</h1>
            <p className="lede">Pick a target you can hit most nights. Consistency pays more than perfection.</p>
            <div className="options">
              {[
                ['6.5', '6.5 hours', '🎯'],
                ['7', '7 hours', '🎯'],
                ['7.5', '7.5 hours', '🎯'],
                ['8', '8 hours', '🎯'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.sleepGoal === id ? 'selected' : ''}`}
                  onClick={() => selectAndAdvance({ sleepGoal: id }, 'Hit this goal to earn points toward gift cards.')}
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

        {step === 'rewardPref' && (
          <div className="step">
            <h1>Which rewards motivate you most?</h1>
            <div className="options">
              {[
                ['amazon', 'Amazon gift cards', '📦'],
                ['coffee', 'Coffee / food cards', '☕'],
                ['retail', 'Retail gift cards', '🛍️'],
                ['any', 'Any gift card is fine', '🎁'],
              ].map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={`option ${answers.rewardPref === id ? 'selected' : ''}`}
                  onClick={() => selectAndAdvance({ rewardPref: id }, 'We will prioritize those redemptions.')}
                >
                  <span className="icon">{icon}</span>
                  <span className="copy">
                    <strong>{label}</strong>
                  </span>
                  <span className="radio">{answers.rewardPref === id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            {micro && <p className="micro">{micro}</p>}
          </div>
        )}

        {step === 'commitment' && (
          <div className="step">
            <h1>Can you track your sleep most nights for 12 weeks?</h1>
            <p className="lede">Tracking is how you earn. A few taps to log a good night is enough.</p>
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
                      id === 'yes' ? 'Showing up most nights is what earns rewards.' : 'We will keep logging simple.',
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
            <div className="loader-hero">
              <img
                src="/images/loader-hero.jpg"
                alt="Peaceful sleep with gift card rewards"
              />
              <div className="loader-hero-fade" />
            </div>
            <h1>Building your plan</h1>
            <p className="lede">Matching your sleep goals with gift card rewards...</p>
            <div className="loader-bar">
              <i />
            </div>
            <div className="check-list">
              {(
                [
                  [1, 'Sleep pattern', '/images/icon-sleep.jpg', 'Analyzing your nights'],
                  [2, 'Goal & reward path', '/images/icon-rewards.jpg', 'Linking goals to gift cards'],
                  [3, '12-week progression', '/images/icon-plan.jpg', 'Scheduling your plan'],
                ] as const
              ).map(([need, label, src, detail]) => {
                const done = loaderChecks >= need
                const active = loaderChecks === need - 1 || (need === 1 && loaderChecks === 0)
                return (
                  <div key={label} className={`check-row ${done ? 'done' : ''} ${active && !done ? 'active' : ''}`}>
                    <img className="check-icon" src={src} alt="" />
                    <div className="check-copy">
                      <strong>{label}</strong>
                      <small>{detail}</small>
                    </div>
                    <span className={`ok ${done ? 'checked' : ''}`}>{done ? '✓' : '…'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="step">
            <h1>Your sleep score</h1>
            <p className="lede">Based on your answers. A starting point, not a diagnosis.</p>
            <div className="score-ring" style={{ ['--score' as string]: `${score}%` }}>
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
                <small>Earn range</small>
                <strong>{rewardPotential(answers)}</strong>
              </div>
            </div>
            <div className="insight">
              <p>
                Members with a similar profile often aim for {answers.sleepGoal ?? '7.5'} hours and redeem about{' '}
                {rewardPotential(answers)} in gift cards over 12 weeks when they hit most nightly goals. Results vary.
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
            <h1>Your 4 reward stages</h1>
            <div className="stages">
              {PLAN_STAGES.map((s, i) => (
                <button key={s.id} type="button" className={stage === i ? 'on' : ''} onClick={() => setStage(i)}>
                  Stage {s.id}
                </button>
              ))}
            </div>
            <div className="plan-card" key={PLAN_STAGES[stage].id}>
              <div className="visual">
                <img src={PLAN_STAGES[stage].image} alt={PLAN_STAGES[stage].title} />
                <span>{PLAN_STAGES[stage].title}</span>
              </div>
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
            <h1>Your 12-week get-paid-to-sleep plan</h1>
            <p className="lede">
              Nightly goals, simple tracking, and gift cards when you hit them. Research on sleep incentives shows
              rewards help people sleep longer. You follow it as a weekly habit.
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
              Educational rewards program only, not medical treatment. Seek care for severe insomnia, apnea symptoms, or
              sudden health changes.
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
            <p className="lede">Example targets for people who hit most sleep goals for about 12 weeks. Not a guarantee.</p>
            <div className="compare">
              <div className="compare-top">
                <div className="now">
                  <img src="/images/compare-now.jpg" alt="Rough nights now" />
                  <small>NOW</small>
                  <strong>Rough nights</strong>
                </div>
                <div className="goal">
                  <img src="/images/compare-goal.jpg" alt="Paid good nights goal" />
                  <small>GOAL</small>
                  <strong>Paid good nights</strong>
                </div>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td>Sleep goal</td>
                    <td>Hit most nights</td>
                  </tr>
                  <tr>
                    <td>Gift cards</td>
                    <td>Earn & redeem</td>
                  </tr>
                  <tr>
                    <td>Fall asleep</td>
                    <td>Faster, less scrolling</td>
                  </tr>
                  <tr>
                    <td>Morning energy</td>
                    <td>Clearer, steadier</td>
                  </tr>
                  <tr>
                    <td>Late-night cravings</td>
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
            <p className="eyebrow success">Your plan is ready</p>
            <h1>Enter your email to see your SleepClub plan</h1>
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
              <button className="btn btn-accent timer-cta" type="button" onClick={() => go(1)}>
                GET MY PLAN
              </button>
            </div>
            <h1>Get paid to sleep better</h1>
            <p className="lede">Nightly goals · gift cards · 12-week plan that keeps you consistent</p>
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
                  <span className="save">{tag}</span>
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
              <div className="big">2×</div>
              <p>
                Sleep incentive research shows people sleep longer when good nights are rewarded. A clear goal plus gift
                cards helps you stick with better rest for 12 weeks.
              </p>
            </div>
            <h2 style={{ marginTop: 22 }}>Everything in your plan</h2>
            <div className="week-grid">
              {[
                ['Nightly sleep goals', 'A target you can hit and get paid for'],
                ['Gift card rewards', 'Points for good nights, redeem for brands you like'],
                ['12-week progression', 'Clear weekly targets that build the habit'],
                ['Sleep + weight basics', 'Why better nights make hunger and stress easier'],
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
              <div className="row-between">
                <span>{answers.plan === '1' ? '1-Week' : answers.plan === '4' ? '4-Week' : '12-Week'} Plan</span>
                <strong>{answers.plan === '1' ? '$9.99' : answers.plan === '4' ? '$29.99' : '$59.99'}</strong>
              </div>
              <div className="row-between discount">
                <span>Intro discount</span>
                <span>{answers.plan === '1' ? '−$5.00' : answers.plan === '4' ? '−$12.00' : '−$30.00'}</span>
              </div>
              <div className="row-between total">
                <span>Total today</span>
                <span>{answers.plan === '1' ? '$4.99' : answers.plan === '4' ? '$17.99' : '$29.99'}</span>
              </div>
              <p className="fine" style={{ marginTop: 10 }}>
                Applied promo: SLEEPPAY12 · Demo checkout only (no real charge)
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
