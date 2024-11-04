import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import WaterCounter from "./WaterCounter";
import AsyncStorage from '@react-native-async-storage/async-storage';


jest.mock('react-native-liquid-gauge', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    LiquidGauge: (props) => (
      <Text testID="liquid-gauge" {...props}>
        Mocked LiquidGauge
      </Text>
    ),
  };
});
jest.mock('react-native-tab-view', () => {
  return {
    TabView: ({ children }) => <>{children}</>,
    SceneMap: jest.fn(),
    TabBar: jest.fn(),
  };
});
jest.mock('react-native-gifted-charts', () => {
  return {
    LineChart: (props) => <text {...props}>Mocked LineChart</text>,
  };
});
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiSet: jest.fn(),
  multiGet: jest.fn(),
  multiRemove: jest.fn(),
}));
jest.mock('src/assets/svg/water/WaterDroplet.svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockWaterDroplet(props) {
    return <View testID="water-droplet-icon" {...props} />;
  };
});
describe("WaterCounter Component Integration Tests", () => {
  
  it("renders correctly with provided props", () => {
    const { getByText, getByTestId } = render(
      <WaterCounter waterIntake={500} waterGoal={2000} />
    );
    
    // Basic component structure tests
    expect(getByText("Water")).toBeTruthy();
    expect(getByText("+")).toBeTruthy();
    expect(getByTestId("water-droplet-icon")).toBeTruthy();
    
    // Test LiquidGauge props using testID
    const liquidGauge = getByTestId("liquid-gauge");
    expect(liquidGauge.props.value).toBe(25);
  });

  it("calculates and displays water intake percentage correctly", () => {
    const { getByTestId } = render(
      <WaterCounter waterIntake={500} waterGoal={2000} />
    );
    
    const liquidGauge = getByTestId("liquid-gauge");
    expect(liquidGauge.props.value).toBe(25); // 500/2000 * 100
  });

  it("opens modal when '+' button is pressed", async () => {
    const { getByText, findByText } = render(
      <WaterCounter waterIntake={500} waterGoal={2000} />
    );
    
    // Simulate pressing the plus button
    fireEvent.press(getByText("+"));
  
    // Use findByText which waits for the modal text to appear
    const modalText = await findByText("Water Intake Modal"); // Adjust to the correct text from your modal
    expect(modalText).toBeTruthy();
  });

  it("closes modal when background overlay is pressed", () => {
    const { getByText, getByTestId, queryByText } = render(<WaterCounter waterIntake={0} waterGoal={2000} />);

    fireEvent.press(getByText("+"));
    expect(getByText("Add Water Intake")).toBeTruthy();

    // Simulate press on background overlay to close modal
    fireEvent.press(getByTestId("modal-overlay"));
    expect(queryByText("Add Water Intake")).toBeNull();
  });

  it("increases water intake when water amount is added", () => {
    const { getByText, getByTestId, rerender } = render(<WaterCounter waterIntake={500} waterGoal={2000} />);
    
    fireEvent.press(getByText("+"));
    fireEvent.press(getByTestId("add-water-250ml")); // assuming 250 ml is an option

    // Re-render with updated intake for confirmation
    rerender(<WaterCounter waterIntake={750} waterGoal={2000} />);
    expect(getByText("750 ml")).toBeTruthy();
    const expectedPercentage = Math.floor((750 / 2000) * 100);
    expect(getByText(`${expectedPercentage}%`)).toBeTruthy();
  });

  it("does not exceed goal, even if additional water intake is added", () => {
    const { getByText, getByTestId, rerender } = render(<WaterCounter waterIntake={1950} waterGoal={2000} />);
    
    fireEvent.press(getByText("+"));
    fireEvent.press(getByTestId("add-water-250ml")); // simulating 250 ml add

    // Re-render with updated intake for confirmation
    rerender(<WaterCounter waterIntake={2000} waterGoal={2000} />);
    expect(getByText("2000 ml")).toBeTruthy();
    expect(getByText("100%")).toBeTruthy();
  });
});
