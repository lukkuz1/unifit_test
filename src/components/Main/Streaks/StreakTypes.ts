import { Streak } from '../../../components/Main/Streaks/Streak';

export const today = new Date();

export const streakTypes: Streak[] = [
  {
    type: "easy",
    duration: 3,
    completedStreak: false,
    days: Array.from({ length: 3 }, (_, index) => ({
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + index)
        .toISOString()
        .split('T')[0],
      completed: false,
    })),
  },
  {
    type: "medium",
    duration: 7,
    completedStreak: false,
    days: Array.from({ length: 7 }, (_, index) => ({
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + index)
        .toISOString()
        .split('T')[0],
      completed: false,
    })),
  },
  {
    type: "hard",
    duration: 30,
    completedStreak: false,
    days: Array.from({ length: 30 }, (_, index) => ({
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + index)
        .toISOString()
        .split('T')[0],
      completed: false,
    })),
  },
];
