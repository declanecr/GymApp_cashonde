/**
 * App.test.js
 * 
 * This file contains unit tests for the App component of the Gym App.
 * It tests the rendering of various navigation links and components.
 */

import { render, screen } from '@testing-library/react';
import React, { act } from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock axios to prevent actual API calls during testing
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }))
}));

// Mock ExerciseDataService to control its behavior in tests
jest.mock('./services/ExerciseDataService', () => ({
  getAll: jest.fn(),
  getMuscleGroups: jest.fn(),
  getEquipment: jest.fn(),
  getLevels: jest.fn()
}));

describe('App Component', () => {
  // Set up mock data for each test
  beforeEach(() => {
    // Mock API responses
    require('./services/ExerciseDataService').getAll.mockResolvedValue({
      data: [{ id: 1, name: 'Exercise 1' }]
    });
    require('./services/ExerciseDataService').getMuscleGroups.mockResolvedValue({
      data: ['Chest', 'Back', 'Legs']
    });
    require('./services/ExerciseDataService').getEquipment.mockResolvedValue({
      data: ['Barbell', 'Dumbbell', 'Machine']
    });
    require('./services/ExerciseDataService').getLevels.mockResolvedValue({
      data: ['Beginner', 'Intermediate', 'Advanced']
    });
  });

  /**
   * Test: Renders GYM APP link
   * Purpose: Ensure the main app title link is rendered
   * Input: Rendered App component
   * Output: Assertion result
   */
  test('renders GYM APP link', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async () => {
      // Check if the GYM APP link is present in the document
      expect(screen.getByRole('link', { name: /GYM APP/i })).toBeInTheDocument();
    });
  });

  /**
   * Test: Renders Exercises link
   * Purpose: Ensure the Exercises navigation link is rendered correctly
   * Input: Rendered App component
   * Output: Assertion results for link presence and href attribute
   */
  test('renders Exercises link', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async () => {
      const exercisesLink = screen.getByRole('link', { name: /exercises/i });
      // Check if the Exercises link is in the document and has the correct href
      expect(exercisesLink).toBeInTheDocument();
      expect(exercisesLink).toHaveAttribute('href', '/exercises');
    });
  });

  /**
   * Test: Renders Add link
   * Purpose: Ensure the Add navigation link is rendered
   * Input: Rendered App component
   * Output: Assertion result
   */
  test('renders Add link', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async () => {
      // Check if the ADD link is present in the document
      expect(screen.getByRole('link', { name: /ADD/i })).toBeInTheDocument();
    })
  });

  /**
   * Test: Renders Current Workout link
   * Purpose: Ensure the Current Workout navigation link is rendered
   * Input: Rendered App component
   * Output: Assertion result
   */
  test('renders Current Workout link', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async () => {
      // Check if the Current Workout link is present in the document
      expect(screen.getByText(/Current Workout/i)).toBeInTheDocument();
    })
  })
});