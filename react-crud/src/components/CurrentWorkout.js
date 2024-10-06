import React, { useEffect, useState } from "react";

const CurrentWorkout = () => {
  const [currentWorkout, setCurrentWorkout] = useState([]);

  useEffect(() => {
    retrieveCurrentWorkout();
  }, []);

  const retrieveCurrentWorkout = () => {
    const storedWorkout = localStorage.getItem("currentWorkout");
    if (storedWorkout) {
      setCurrentWorkout(JSON.parse(storedWorkout));
    }
  };

  const removeExercise = (index) => {
    const updatedWorkout = currentWorkout.filter((_, i) => i !== index);
    setCurrentWorkout(updatedWorkout);
    localStorage.setItem("currentWorkout", JSON.stringify(updatedWorkout));
  };

  return (
    <div>
      <h2>Current Workout</h2>
      {currentWorkout.length === 0 ? (
        <p>No exercises added to the workout yet.</p>
      ) : (
        <ul>
          {currentWorkout.map((exercise, index) => (
            <li key={index}>
              {exercise.name} - {exercise.main_muscle}
              <button onClick={() => removeExercise(index)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CurrentWorkout;