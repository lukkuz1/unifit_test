import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StoreModal from './StoreModal';

describe('StoreModal', () => {
  const store = {
    store_name: 'Test Store',
    store_description: 'This is a test store.',
    prizes: [{ id: 'prize123', prize_name: 'Test Prize' }],
  };

  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const { getByText } = render(<StoreModal store={store} isVisible={true} onClose={onClose} />);
    expect(getByText('Test Store')).toBeTruthy();
    expect(getByText('This is a test store.')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByText } = render(<StoreModal store={store} isVisible={true} onClose={onClose} />);
    fireEvent.press(getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders prizes correctly', () => {
    const { getByText } = render(<StoreModal store={store} isVisible={true} onClose={onClose} />);
    expect(getByText('Test Prize')).toBeTruthy();
  });
});
