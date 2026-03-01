// FarmerRegister.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import FarmerRegister from './FarmerRegister';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe('FarmerRegister Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all input fields and register button', () => {
    render(
      <BrowserRouter>
        <FarmerRegister />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Farm Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Location')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contact Number')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('submits form and calls API, then navigates', async () => {
    mockedAxios.post.mockResolvedValue({ data: { message: 'Success' } });

    render(
      <BrowserRouter>
        <FarmerRegister />
      </BrowserRouter>
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Farm Name'), { target: { value: 'Green Farm' } });
    fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Ratnapura' } });
    fireEvent.change(screen.getByPlaceholderText('Contact Number'), { target: { value: '1234567890' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      // Axios POST called with form data
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8081/farmers/register',
        {
          full_name: 'John Doe',
          email: 'john@example.com',
          password: '123456',
          farm_name: 'Green Farm',
          location: 'Ratnapura',
          contact_number: '1234567890'
        }
      );

      // Navigate called
      expect(mockedNavigate).toHaveBeenCalledWith('/farmer-login');
    });
  });

  test('shows alert on API error', async () => {
    window.alert = jest.fn();
    mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Email already exists' } } });

    render(
      <BrowserRouter>
        <FarmerRegister />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Email already exists');
    });
  });
});
