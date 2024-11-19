// src/services/localStorageService.js

// Storage keys as constants
export const STORAGE_KEYS = {
    GENERATED_WORKOUTS: 'generatedWorkouts',
    WORKOUT_STATE: 'workoutState',
    SELECTED_DAYS: 'selectedDays'
};

// Save data to localStorage
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Saved to localStorage (${key}):`, data);
    } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
    }
};

// Get data from localStorage
export const getFromLocalStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        console.log(`Retrieved from localStorage (${key}):`, item);
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

// Clear workout state
export const clearWorkoutState = () => {
    clearFromLocalStorage(STORAGE_KEYS.WORKOUT_STATE);
};
// Update workout state
export const updateWorkoutState = (workout, sets, startTime, isStarted) => {
    const workoutState = {
        workout,
        sets,
        startTime,
        isStarted
    };
    console.log('updateWorkoutState: ', workoutState);
    saveToLocalStorage(STORAGE_KEYS.WORKOUT_STATE, workoutState);
};

// Update sets in workout state
export const updateWorkoutSets = (sets) => {
    const workoutState = getFromLocalStorage(STORAGE_KEYS.WORKOUT_STATE);
    if (workoutState) {
        workoutState.sets = sets;
        saveToLocalStorage(STORAGE_KEYS.WORKOUT_STATE, workoutState);
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
    const workoutState = getFromLocalStorage(STORAGE_KEYS.WORKOUT_STATE);
    return workoutState && workoutState.isStarted;
};

// Clear all app data
export const clearAllData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        clearFromLocalStorage(key);
    });
};
