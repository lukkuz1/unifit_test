export interface Streak {
  type: 'easy' | 'medium' | 'hard';
  duration: number;
  completedStreak: boolean;
  days: { date: string; completed: boolean; }[];
}

export function isStreakCompleted(streak: Streak, currentStreak: number): boolean {
  return currentStreak >= streak.duration;
}

export function selectStreak(streaks: Streak[], currentStreak: number): Streak | null {
  let selectedStreak: Streak | null = null;

  for (const streak of streaks) {
    if (isStreakCompleted(streak, currentStreak)) {
      selectedStreak = streak;
    } else {
      break;
    }
  }

  return selectedStreak;
}