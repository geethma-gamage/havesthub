import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Home component', () => {
  render(<App />); // DO NOT wrap in BrowserRouter

  // Replace 'Home' with a text that actually exists in your Home component
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});
