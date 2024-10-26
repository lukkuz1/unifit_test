import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HotZoneDropdown from './HotZoneDropdown';

describe('HotZoneDropdown Component', () => {
  const hotZones = [
    { name: 'Zone A', location: { latitude: 0, longitude: 0 }, radius: 100, description: 'Description A' },
    { name: 'Zone B', location: { latitude: 1, longitude: 1 }, radius: 200, description: 'Description B' },
  ];

  it('renders correctly with provided hot zones', () => {
    const { getByText } = render(
      <HotZoneDropdown
        hotZones={hotZones}
        selectedHotZoneName=""
        onHotZoneSelectionChange={() => {}}
      />
    );

    expect(getByText('Available hot zones')).toBeTruthy();
    expect(getByText('Zone A')).toBeTruthy();
    expect(getByText('Zone B')).toBeTruthy();
  });

  it('calls onHotZoneSelectionChange with correct value when a hot zone is selected', () => {
    const mockOnHotZoneSelectionChange = jest.fn();
    const { getByText, getByTestId } = render(
      <HotZoneDropdown
        hotZones={hotZones}
        selectedHotZoneName=""
        onHotZoneSelectionChange={mockOnHotZoneSelectionChange}
      />
    );

    fireEvent(getByTestId('picker'), 'ValueChange', { itemValue: 'Zone A' });

    expect(mockOnHotZoneSelectionChange).toHaveBeenCalledWith(hotZones[0]);
  });

  it('does not call onHotZoneSelectionChange when the placeholder is selected', () => {
    const mockOnHotZoneSelectionChange = jest.fn();
    const { getByText } = render(
      <HotZoneDropdown
        hotZones={hotZones}
        selectedHotZoneName=""
        onHotZoneSelectionChange={mockOnHotZoneSelectionChange}
      />
    );

    fireEvent(getByText('Available hot zones'), 'ValueChange', { itemValue: '' });

    expect(mockOnHotZoneSelectionChange).not.toHaveBeenCalled();
  });
});
