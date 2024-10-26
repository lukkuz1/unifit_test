import { isStreakCompleted, selectStreak, Streak } from "./Streak"

describe('Streak Functions', () => {
  const streaks: Streak[] = [
    { type: 'easy', duration: 3, completedStreak: true, days: [] },
    { type: 'medium', duration: 5, completedStreak: true, days: [] },
    { type: 'hard', duration: 7, completedStreak: false, days: [] },
  ];

  it('returns true for completed streak', () => {
    expect(isStreakCompleted(streaks[0], 3)).toBe(true);
    expect(isStreakCompleted(streaks[1], 5)).toBe(true);
  });

  it('returns false for incomplete streak', () => {
    expect(isStreakCompleted(streaks[2], 6)).toBe(false);
  });

  it('selects the correct streak based on current streak', () => {
    expect(selectStreak(streaks, 5)).toEqual(streaks[1]);
    expect(selectStreak(streaks, 3)).toEqual(streaks[0]);
    expect(selectStreak(streaks, 2)).toBe(null);
  });
});
