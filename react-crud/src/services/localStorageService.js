// src/services/localStorageService.js

// Storage keys as constants
export const STORAGE_KEYS = {
    GENERATED_WORKOUTS: 'generatedWorkouts',
    CURRENT_WORKOUT: 'currentWorkout',
    WORKOUT_STATE: 'workoutState',
    CURRENT_SETS: 'currentSets',
    SELECTED_DAYS: 'selectedDays'
};

// Save data to localStorage
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
    }
};

// Get data from localStorage
export const getFromLocalStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error getting from localStorage (${key}):`, error);
        return null;
    }
};

// Clear specific key from localStorage
export const clearFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error clearing from localStorage (${key}):`, error);
    }
};

// Clear all workout related data
export const clearWorkoutState = () => {
    clearFromLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT);
    clearFromLocalStorage(STORAGE_KEYS.CURRENT_SETS);
};

// Update workout state
export const updateWorkoutState = (workout, sets, startTime, isStarted) => {
    const workoutState = {
        workout,
        sets,
        startTime,
        isStarted
    };
    saveToLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT, workoutState);
};

// Update sets for current workout
export const updateWorkoutSets = (sets) => {
    const workoutState = getFromLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT);
    if (workoutState) {
        workoutState.sets = sets;
        saveToLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT, workoutState);
    }
};

// Save generated workouts
export const saveGeneratedWorkouts = (workouts) => {
    saveToLocalStorage(STORAGE_KEYS.GENERATED_WORKOUTS, workouts);
};

// Get generated workouts
export const getGeneratedWorkouts = () => {
    return getFromLocalStorage(STORAGE_KEYS.GENERATED_WORKOUTS) || [];
};

// Save selected days
export const saveSelectedDays = (days) => {
    saveToLocalStorage(STORAGE_KEYS.SELECTED_DAYS, days);
};

// Get selected days
export const getSelectedDays = () => {
    return getFromLocalStorage(STORAGE_KEYS.SELECTED_DAYS) || [];
};

// Check if there's an active workout
export const isWorkoutActive = () => {
    const workoutState = getFromLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT);
    return workoutState && workoutState.isStarted;
};

// Clear all app data
export const clearAllData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        clearFromLocalStorage(key);
    });
};
