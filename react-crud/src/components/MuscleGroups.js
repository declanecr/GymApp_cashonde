import React, { useEffect, useState } from 'react';
import ExerciseDataService from "../services/ExerciseDataService";

const MuscleGroups = () => {
  const [muscleGroups, setMuscleGroups] = useState([]);

  useEffect(() => {
    ExerciseDataService.getMuscleGroups()
      .then(response => {
        console.log("Muscle groups:", response.data);
        setMuscleGroups(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <div>
      <h2>Muscle Groups</h2>
      <ul>
        {muscleGroups.map((group, index) => (
          <li key={index}>{group}</li>
        ))}
      </ul>
    </div>
  );
};

export default MuscleGroups;