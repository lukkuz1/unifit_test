import { streakTypes } from "./StreakTypes"
import { Streak } from '../../../components/Main/Streaks/Streak';

describe('streakTypes', () => {
  it('contains three streak types', () => {
    expect(streakTypes).toHaveLength(3);
  });

  it('has correct structure for each streak', () => {
    streakTypes.forEach((streak: Streak) => {
      expect(streak).toHaveProperty('type');
      expect(streak).toHaveProperty('duration');
      expect(streak).toHaveProperty('completedStreak');
      expect(streak).toHaveProperty('days');
      expect(Array.isArray(streak.days)).toBe(true);
    });
  });

  it('has correct durations for each streak type', () => {
    expect(streakTypes[0].duration).toBe(3);
    expect(streakTypes[1].duration).toBe(7);
    expect(streakTypes[2].duration).toBe(30);
  });

  it('initializes days correctly for each streak type', () => {
    expect(streakTypes[0].days).toHaveLength(3);
    expect(streakTypes[1].days).toHaveLength(7);
    expect(streakTypes[2].days).toHaveLength(30);
  });
});
