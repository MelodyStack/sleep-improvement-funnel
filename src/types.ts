export type Answers = {
  motivation?: string
  ageRange?: string
  sleepQuality?: string
  issues: string[]
  wakeFeeling?: string
  stress?: string
  sleepHours?: string
  bedtime?: string
  sleepGoal?: string
  rewardPref?: string
  commitment?: string
  email?: string
  plan?: '1' | '4' | '12'
}

export type Section = 'about' | 'sleep' | 'plan' | null
