import {
  Card,
  CardContent,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExerciseDataService from "../services/ExerciseDataService";
import SetDataService from '../services/SetDataService';
import authService from '../services/auth.service';

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '500px',
  margin: '0 auto'
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(2)
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2)
}));

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
    <Root>
      <Title variant="h4">
        {exercise ? exercise.name : 'Loading...'} Sets History
      </Title>
      <Grid2 container spacing={3}>
        {Object.entries(workouts).map(([workoutId, sets]) => (
          <Grid2 item xs={12} key={workoutId}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Workout {workoutId}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {new Date(sets[0].date).toLocaleDateString()}
                </Typography>                
                <StyledTableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Weight</TableCell>
                        <TableCell>Reps</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sets.map(set => (
                        <TableRow key={set.id}>
                          <TableCell>{set.weight}</TableCell>
                          <TableCell>{set.reps}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
              </CardContent>
            </StyledCard>
          </Grid2>
        ))}
      </Grid2>
    </Root>
  );
}

export default SetsHistory;
