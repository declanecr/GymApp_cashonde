/*  SetsHistory.js
    The page for displaying the set data of a 
    specific exercise found from 
    /api/exercises/:id/sets

*/
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExerciseDataService from "../services/ExerciseDataService";
import SetDataService from '../services/SetDataService';
import authService from '../services/auth.service';

function SetsHistory() {
  const [workouts, setWorkouts] = useState({});
  const [exercise, setExercise] = useState(null);
  const { id } = useParams();

  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchExercise();
    fetchSets();
  }, [id]);

  const fetchExercise = () => {
    ExerciseDataService.get(id)
      .then(response => {
        setExercise(response.data);
      })
      .catch(error => console.error('Error fetching exercise:', error));
  };

  const fetchSets = () => {
    SetDataService.getSetsForExercise(id, user.id)
      .then(response => {
        const groupedSets = response.data.reduce((acc, set) => {
          if (!acc[set.workout_id]) {
            acc[set.workout_id] = [];
          }
          acc[set.workout_id].push(set);
          return acc;
        }, {});
        setWorkouts(groupedSets);
      })
      .catch(error => console.error('Error fetching sets:', error));
  };

  return (
    <div>
      <h2>{exercise ? exercise.name : 'Loading...'} Sets History</h2>
      {Object.entries(workouts).map(([workoutId, sets]) => (
        <div key={workoutId}>
          <h3>Workout {workoutId}</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>Reps</th>
              </tr>
            </thead>
            <tbody>
              {sets.map(set => (
                <tr key={set.id}>
                  <td>{new Date(set.date).toLocaleDateString()}</td>
                  <td>{set.weight}</td>
                  <td>{set.reps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}



export default SetsHistory;