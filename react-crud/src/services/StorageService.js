
// User storage functions
const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
}

const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// User ID storage functions
const setUserId = (userId) => {
  localStorage.setItem('userId', userId);
}

const getUserId = () => {
  return localStorage.getItem('userId');
}

// Current exercise storage functions
const setCurrentExercise = (exercise) => {
  console.log('Setting current exercise:', exercise);
  localStorage.setItem('currentExercise', JSON.stringify(exercise));
}

const getCurrentExercise = () => {
  const exercise = localStorage.getItem('currentExercise');
  console.log('Getting current exercise:', exercise);
  return exercise ? JSON.parse(exercise) : null;
}

// Current workout storage functions
const setCurrentWorkout = (workout) => {
  localStorage.setItem('currentWorkout', JSON.stringify(workout));
}

const getCurrentWorkout = () => {
  const workout = localStorage.getItem('currentWorkout');
  return workout ? JSON.parse(workout) : null;
}

// Add exercise to workout
const addToWorkout = (exercise) => {
    const currentWorkout = getCurrentWorkout() || [];
    const updatedWorkout = [...currentWorkout, exercise];
    setCurrentWorkout(updatedWorkout);
    return updatedWorkout;
  };
  
  // Remove exercise from workout
  const removeFromWorkout = (exerciseToRemove) => {
    const currentWorkout = getCurrentWorkout() || [];
    const updatedWorkout = currentWorkout.filter(
      exercise => exercise.id !== exerciseToRemove.id
    );
    setCurrentWorkout(updatedWorkout);
    return updatedWorkout;
  };
  
  // Delete entire workout
  const deleteWorkout = () => {
    localStorage.removeItem('currentWorkout');
  };
  
  // Update the StorageService object
  const StorageService = {
      setUser,
      getUser,
      setUserId,
      getUserId,
      setCurrentExercise,
      getCurrentExercise,
      setCurrentWorkout,
      getCurrentWorkout,
      addToWorkout,
      removeFromWorkout,
      deleteWorkout
  };
  
  export default StorageService;