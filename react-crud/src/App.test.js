import { render, screen } from '@testing-library/react';
import React, { act } from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';


jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }))
}));



jest.mock('./services/ExerciseDataService', () => ({
  getAll: jest.fn(),
  getMuscleGroups: jest.fn(),
  getEquipment: jest.fn(),
  getLevels: jest.fn()
}));
describe('App Component',()=>{
  beforeEach(() => {
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

  test('renders GYM APP link', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act( async() => {
      expect(screen.getByText(/GYM APP/i)).toBeInTheDocument();
    });
  });

  test('renders Exercises link', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act( async()=>{
      const exercisesLink = screen.getByRole('link', { name: /exercises/i });
    expect(exercisesLink).toBeInTheDocument();
    expect(exercisesLink).toHaveAttribute('href', '/exercises');
    });
 });
 test('renders Add link', async() => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async()=>{
      expect(screen.getByText(/Add/i)).toBeInTheDocument();
    })
  });
 test('renders Current Workout link', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async()=>{
      expect(screen.getByText(/Current Workout/i)).toBeInTheDocument();
    })
  })
});