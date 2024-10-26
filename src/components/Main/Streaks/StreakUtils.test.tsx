import { shuffleIcons } from "./StreakUtils";

describe('streakActions', () => {
  it('shuffles icons correctly', () => {
    const icons = [
      <div key="icon1">Icon 1</div>,
      <div key="icon2">Icon 2</div>,
      <div key="icon3">Icon 3</div>,
    ];
    const shuffledIcons = shuffleIcons([...icons]);
    expect(shuffledIcons.sort((a, b) => a.key.localeCompare(b.key))).toEqual(icons.sort((a, b) => a.key.localeCompare(b.key)));
    expect(shuffledIcons).not.toEqual(icons);
  });
});
