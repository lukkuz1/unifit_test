import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HotZoneMap from './HotZoneMap';

jest.mock('react-native-maps', () => {
  const MockMapView = (props) => <div data-testid="map" {...props} />;
  const MockMarker = (props) => <div data-testid="marker" {...props} />;
  const MockCircle = (props) => <div data-testid="circle" {...props} />;
  return {
    PROVIDER_GOOGLE: 'Google',
    Marker: MockMarker,
    Circle: MockCircle,
    MapView: MockMapView,
  };
});

describe('HotZoneMap Component', () => {
  const location = {
    coords: {
      latitude: 54.899543,
      longitude: 23.967050,
    },
  };

  const hotZones = [
    {
      name: 'Zone A',
      location: { latitude: 54.899543, longitude: 23.967050 },
      radius: 500,
      center_radius: 100,
      center_message: 'Welcome to Zone A!',
      description: 'This is Zone A',
    },
    {
      name: 'Zone B',
      location: { latitude: 54.909543, longitude: 23.977050 },
      radius: 500,
      center_radius: 100,
      center_message: 'Welcome to Zone B!',
      description: 'This is Zone B',
    },
  ];

  const mockFunctions = {
    onHotZoneCentered: jest.fn(),
    onHotZonePress: jest.fn(),
    onMapInteraction: jest.fn(),
    onUserCentered: jest.fn(),
  };

  it('renders correctly and shows the map', () => {
    const { getByTestId } = render(
      <HotZoneMap
        shouldCenterOnHotZone={false}
        location={location}
        hotZones={hotZones}
        selectedHotZone={null}
        hasLocationPermission={true}
        locationPermissionDenied={false}
        shouldCenterOnUser={false}
        {...mockFunctions}
      />
    );

    expect(getByTestId('map')).toBeTruthy();
  });

  it('displays the user location marker', () => {
    const { getByTestId } = render(
      <HotZoneMap
        shouldCenterOnHotZone={false}
        location={location}
        hotZones={hotZones}
        selectedHotZone={null}
        hasLocationPermission={true}
        locationPermissionDenied={false}
        shouldCenterOnUser={false}
        {...mockFunctions}
      />
    );

    expect(getByTestId('marker')).toBeTruthy();
  });

  it('displays hot zone markers and circles', () => {
    const { getAllByTestId } = render(
      <HotZoneMap
        shouldCenterOnHotZone={false}
        location={location}
        hotZones={hotZones}
        selectedHotZone={null}
        hasLocationPermission={true}
        locationPermissionDenied={false}
        shouldCenterOnUser={false}
        {...mockFunctions}
      />
    );

    expect(getAllByTestId('marker').length).toBe(hotZones.length);
    expect(getAllByTestId('circle').length).toBe(hotZones.length * 2);
  });

  it('opens modal with hot zone details when a hot zone marker is pressed', () => {
    const { getAllByTestId, getByText } = render(
      <HotZoneMap
        shouldCenterOnHotZone={false}
        location={location}
        hotZones={hotZones}
        selectedHotZone={null}
        hasLocationPermission={true}
        locationPermissionDenied={false}
        shouldCenterOnUser={false}
        {...mockFunctions}
      />
    );

    const hotZoneMarker = getAllByTestId('marker')[0];
    fireEvent.press(hotZoneMarker);

    expect(getByText('You reached the Zone A hot zone!')).toBeTruthy();
    expect(getByText('This is Zone A')).toBeTruthy();
  });

  it('displays a message if the user is in a hot zone', () => {
    const updatedLocation = {
      coords: {
        latitude: 54.899543,
        longitude: 23.967050,
      },
    };

    const { getByText } = render(
      <HotZoneMap
        shouldCenterOnHotZone={false}
        location={updatedLocation}
        hotZones={hotZones}
        selectedHotZone={null}
        hasLocationPermission={true}
        locationPermissionDenied={false}
        shouldCenterOnUser={false}
        {...mockFunctions}
      />
    );

    expect(getByText("You are in the 'Zone A' hot zone!")).toBeTruthy();
  });

  it('does not call onHotZoneCentered when no hot zone is selected', () => {
    render(
      <HotZoneMap
        shouldCenterOnHotZone={false}
        location={location}
        hotZones={hotZones}
        selectedHotZone={null}
        hasLocationPermission={true}
        locationPermissionDenied={false}
        shouldCenterOnUser={false}
        {...mockFunctions}
      />
    );

    expect(mockFunctions.onHotZoneCentered).not.toHaveBeenCalled();
  });
});
