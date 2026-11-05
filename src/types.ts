export type Answers = {
  motivation?: string;
  ageRange?: string;
  sleepQuality?: string;
  issues: string[];
  wakeFeeling?: string;
  stress?: string;
  activity?: string;
  walkHabit?: string;
  sleepGoal?: string;
  commitment?: string;
  heightFt?: string;
  heightIn?: string;
  weight?: string;
  email?: string;
  plan?: '1' | '4' | '12';
};

export type Section = 'about' | 'body' | 'plan' | null;
