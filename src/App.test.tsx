import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('酒店管理系统测试', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Web酒店管理系统/i);
  expect(linkElement).toBeInTheDocument();
});

