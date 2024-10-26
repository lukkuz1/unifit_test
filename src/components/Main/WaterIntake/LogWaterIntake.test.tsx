import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LogWaterIntake from './LogWaterIntake';

describe('LogWaterIntake', () => {
  it('handles input and button presses', () => {
    const onChangeMock = jest.fn();
    const { getByText, getByPlaceholderText } = render(<LogWaterIntake onChange={onChangeMock} currentIntake={500} />);

    const input = getByPlaceholderText('Enter water amount');
    
    fireEvent.changeText(input, '200');
    fireEvent.press(getByText('Add'));

    expect(onChangeMock).toHaveBeenCalledWith(200, 'add');

    fireEvent.changeText(input, '300');
    fireEvent.press(getByText('Remove'));

    expect(onChangeMock).toHaveBeenCalledWith(300, 'remove');
  });
});
