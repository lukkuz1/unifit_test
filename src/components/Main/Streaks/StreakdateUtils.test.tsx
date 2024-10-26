import { calculateDate } from "./StreakdateUtils"

describe('calculateDate', () => {
  it('calculates the correct date for positive index', () => {
    const today = new Date();
    expect(calculateDate(0)).toBe(`${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}th`);
    expect(calculateDate(1)).toBe(`${today.toLocaleString('default', { month: 'long' })} ${today.getDate() + 1}th`);
  });

  it('calculates the correct date for negative index', () => {
    const today = new Date();
    const day = today.getDate();
    expect(calculateDate(-1)).toBe(`${today.toLocaleString('default', { month: 'long' })} ${day - 1}th`);
    expect(calculateDate(-2)).toBe(`${today.toLocaleString('default', { month: 'long' })} ${day - 2}th`);
  });

  it('adds correct suffix for specific days', () => {
    expect(calculateDate(1)).toContain('st');
    expect(calculateDate(2)).toContain('nd');
    expect(calculateDate(3)).toContain('rd');
    expect(calculateDate(4)).toContain('th');
    expect(calculateDate(21)).toContain('st');
    expect(calculateDate(22)).toContain('nd');
    expect(calculateDate(23)).toContain('rd');
    expect(calculateDate(31)).toContain('st');
  });
});
