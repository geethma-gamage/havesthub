// ProductItems.test.js (Cancel test removed)
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ProductItems from './ProductItems';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('ProductItems Component Tests', () => {
  const mockFarmer = {
    full_name: 'John Doe',
    contact_number: '123-456-7890',
    farm_name: 'Green Farm'
  };

  const mockProducts = [
    {
      id: 1,
      name: 'Apple',
      quantity: 100,
      price_per_kg: 5.99,
      location: 'Ratnapura',
      farmer_name: 'John Doe',
      farmer_contact: '123-456-7890',
      farm_name: 'Green Farm',
      is_active: true
    },
    {
      id: 2,
      name: 'Mango',
      quantity: 50,
      price_per_kg: 8.50,
      location: 'Ratnapura',
      farmer_name: 'John Doe',
      farmer_contact: '123-456-7890',
      farm_name: 'Green Farm',
      is_active: false
    }
  ];

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Mock localStorage
    delete window.localStorage;
    window.localStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockFarmer)),
    };

    // Mock axios GET
    mockedAxios.get.mockResolvedValue({ data: mockProducts });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Update Functionality', () => {
    test('renders update buttons for products', async () => {
      render(<ProductItems />);
      await waitFor(() => expect(screen.getByText('Apple')).toBeInTheDocument());
      expect(screen.getAllByRole('button', { name: /update/i })).toHaveLength(2);
    });

    test('populates form fields when update button clicked', async () => {
      render(<ProductItems />);
      await waitFor(() => screen.getByText('Apple'));
      const updateButtons = screen.getAllByRole('button', { name: /update/i });
      fireEvent.click(updateButtons[0]);
      await waitFor(() => {
        expect(screen.getByDisplayValue('Apple')).toBeInTheDocument();
        expect(screen.getByDisplayValue('100')).toBeInTheDocument();
      });
    });

    test('submits update form (mocked API)', async () => {
      mockedAxios.put.mockResolvedValue({ data: { success: true } });
      render(<ProductItems />);
      await waitFor(() => screen.getByText('Apple'));
      fireEvent.click(screen.getAllByRole('button', { name: /update/i })[0]);
      const nameInput = screen.getByPlaceholderText('🍎 Product Name');
      fireEvent.change(nameInput, { target: { value: 'Updated Apple' } });
      fireEvent.click(screen.getByText('💾 Save Update'));
      await waitFor(() => {
        expect(mockedAxios.put).toHaveBeenCalledWith(
          'http://localhost:8081/products/update/1',
          expect.any(Object)
        );
      });
    });
  });

  describe('Toggle/Mock Delete Functionality', () => {
    test('toggles active product to inactive (mocked)', async () => {
      mockedAxios.put.mockResolvedValue({ data: { success: true } });
      render(<ProductItems />);
      await waitFor(() => screen.getByText('Apple'));
      fireEvent.click(screen.getAllByText('❌ Disable')[0]);
      await waitFor(() => {
        expect(mockedAxios.put).toHaveBeenCalledWith(
          'http://localhost:8081/products/toggle/1',
          { is_active: 0 }
        );
      });
    });

    test('toggles inactive product to active (mocked)', async () => {
      mockedAxios.put.mockResolvedValue({ data: { success: true } });
      render(<ProductItems />);
      await waitFor(() => screen.getByText('Apple'));
      fireEvent.click(screen.getAllByText('✅ Enable')[0]);
      await waitFor(() => {
        expect(mockedAxios.put).toHaveBeenCalledWith(
          'http://localhost:8081/products/toggle/2',
          { is_active: 1 }
        );
      });
    });
  });
});
