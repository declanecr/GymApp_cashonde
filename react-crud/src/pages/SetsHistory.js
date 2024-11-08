/*  SetsHistory.js
    The page for displaying the set data of a 
    specific exercise found from 
    /api/exercises/:id/sets

*/
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SetsGrid from '../components/SetsGrid';
import ExerciseDataService from "../services/ExerciseDataService";
import SetDataService from '../services/SetDataService';
import authService from '../services/auth.service';

function SetsHistory () {
  const [sets, setSets] = useState([]);
  const [exercise, setExercise] = useState(null);
  const { id } = useParams();

  const user = authService.getCurrentUser();
  console.log('user_id:',user.id);

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
    const exerciseData ={
      id: id,
      user_id: user.id,
    }
    SetDataService.getSetsForExercise(exerciseData.id, exerciseData.user_id)
      .then(response => {
        console.log('response:',response);
        setSets(response.data);
      })
      .catch(error => console.error('Error fetching sets:', error));
  };

  return (
    <div>
      <h2>{exercise ? exercise.name : 'Loading...'} Sets History</h2>
      <SetsGrid sets={sets} />
    </div>
  );
}



export default SetsHistory;