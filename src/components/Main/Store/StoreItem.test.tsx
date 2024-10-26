import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StoreItem from './StoreItem';

describe('StoreItem', () => {
  const store = {
    logo_url: 'http://example.com/logo.png',
    store_name: 'Test Store',
  };

  const onPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<StoreItem store={store} onPress={onPress} />);
    expect(getByText('Test Store')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(<StoreItem store={store} onPress={onPress} />);
    fireEvent.press(getByText('Test Store'));
    expect(onPress).toHaveBeenCalledWith(store);
  });
});
