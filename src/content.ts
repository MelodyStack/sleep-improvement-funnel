export const MOTIVATIONS: Record<
  string,
  { label: string; icon: string; micro: string; boostTitle: string; boostBody: string }
> = {
  plan: {
    label: 'A clear sleep plan',
    icon: '📋',
    micro: 'A clear plan keeps you consistent.',
    boostTitle: 'A clear sleep plan can raise your success rate by 2x',
    boostBody:
      'People who follow a simple nightly plan hit their sleep goals more often than those who rely on willpower alone. Your plan sets bedtime targets, wind-down cues, and weekly check-ins so progress is measurable.',
  },
  rewards: {
    label: 'Earning gift cards',
    icon: '🎁',
    micro: 'Every good night can pay off.',
    boostTitle: 'Earning rewards can raise your sleep success by 2x',
    boostBody:
      'Research on sleep incentives shows people sleep longer when good nights are rewarded. On SleepClub, hitting your sleep goal unlocks gift cards, so better rest comes with a real payout.',
  },
  coaching: {
    label: 'Personalized coaching',
    icon: '🧭',
    micro: 'Guidance that fits your nights.',
    boostTitle: 'Personalized coaching can raise your success rate by 2x',
    boostBody:
      'Generic tips fade fast. Coaching that matches your bedtime, stress level, and sleep goal keeps you adjusting week by week, which is how habits actually stick.',
  },
  social: {
    label: 'Social support',
    icon: '🤝',
    micro: 'Support makes habits stick.',
    boostTitle: 'Social support can raise your sleep success by 2x',
    boostBody:
      'Members who check in with others stay accountable. Shared goals and encouragement help you protect bedtime when life gets loud.',
  },
  all: {
    label: 'All of the above',
    icon: '✨',
    micro: 'You are covering every angle.',
    boostTitle: 'Plan, rewards, coaching, and support can raise success by 2x',
    boostBody:
      'The strongest results come when structure, incentives, guidance, and community work together. SleepClub combines all four so you sleep better and earn for hitting your goals.',
  },
}

export const REVIEWS = [
  {
    name: 'Rachel M.',
    initials: 'RM',
    quote:
      'I hit my 7.5 hour goal four nights in a row and got a Starbucks gift card. Knowing a reward was waiting made bedtime feel worth protecting.',
  },
  {
    name: 'Denise K.',
    initials: 'DK',
    quote:
      'The daily sleep challenge kept me honest. Fewer 2 a.m. phone checks, and the gift cards made sticking with it feel fun.',
  },
  {
    name: 'Andrea P.',
    initials: 'AP',
    quote:
      'I wanted better sleep more than anything. Earning points for nights I actually rested changed how serious I got about bedtime.',
  },
  {
    name: 'Laura D.',
    initials: 'LD',
    quote:
      'Clear sleep goals, real rewards, and a plan I could follow. I finally stop scrolling and get to bed on time.',
  },
  {
    name: 'Vanessa V.',
    initials: 'VV',
    quote:
      'Gift cards are easy to use and there are plenty of chances to earn. Better sleep plus a little payout keeps me coming back.',
  },
  {
    name: 'Monica A.',
    initials: 'MA',
    quote:
      'Just redeemed $10 with SleepClub. Clear nightly goals, real rewards, and I finally stick with it.',
  },
]

export const PLAN_STAGES = [
  {
    id: 1,
    title: 'Set your sleep goal',
    body: 'Pick a realistic bedtime and sleep target. Track nights you hit it. Each win builds points toward gift cards.',
    image: '/images/stage-1.jpg',
  },
  {
    id: 2,
    title: 'Build your wind-down',
    body: 'Follow a short evening routine so falling asleep gets easier. Consistency is what earns rewards.',
    image: '/images/stage-2.jpg',
  },
  {
    id: 3,
    title: 'Earn for good nights',
    body: 'Hit your goal, bank points, redeem gift cards. Rewards keep you showing up when motivation dips.',
    image: '/images/stage-3.jpg',
  },
  {
    id: 4,
    title: 'Lock in the habit',
    body: 'By weeks 9 to 12, better sleep feels normal. You keep earning while energy, mood, and appetite stabilize.',
    image: '/images/stage-4.jpg',
  },
]

export const WEEK_PLAN = [
  {
    label: 'Weeks 1 to 3',
    text: 'Set bedtime and a sleep-hour goal. Track 4+ good nights a week. Start earning small rewards early.',
  },
  {
    label: 'Weeks 4 to 6',
    text: 'Tighten wind-down timing. Aim for fewer wake-ups. Unlock bigger weekly gift card challenges.',
  },
  {
    label: 'Weeks 7 to 9',
    text: 'Hold a steady schedule most nights. Stack streak bonuses when you stay on target.',
  },
  {
    label: 'Weeks 10 to 12',
    text: 'Protect your best sleep window. Cash in points and keep the habit that pays you back.',
  },
]

export const FAQS = [
  {
    q: 'How do I earn gift cards?',
    a: 'Set a nightly sleep goal in the app. When you hit it, you earn points. Points redeem for gift cards from brands you choose. Daily and weekly challenges add more chances to earn.',
  },
  {
    q: 'How does getting paid help me sleep better?',
    a: 'Studies on sleep incentives show people sleep longer when good nights are rewarded. A clear goal plus a real payout makes bedtime easier to protect than willpower alone.',
  },
  {
    q: 'How does better sleep help with weight?',
    a: 'Short sleep raises hunger and calorie intake, and can make fat loss harder when dieting. Better sleep helps appetite and stress settle, so your days feel easier to manage.',
  },
  {
    q: 'How much time does this take?',
    a: 'A few minutes to set your goal and log your night. The plan guides bedtime, wind-down, and weekly targets. No gym required.',
  },
  {
    q: 'Is this medical advice?',
    a: 'No. SleepClub is a habit and rewards program. It is not a diagnosis or treatment for insomnia, sleep apnea, or other medical conditions. Talk with a clinician for severe or ongoing sleep problems.',
  },
  {
    q: 'Can I cancel?',
    a: 'Yes. Cancel anytime from your account settings. Plans include a 30-day money-back guarantee for eligible members who followed the program.',
  },
]
