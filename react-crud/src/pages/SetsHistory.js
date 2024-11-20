import {
  Card,
  CardContent,
  Divider,
  Grid2,
  List, ListItem, ListItemText,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExerciseDataService from "../services/ExerciseDataService";
import SetDataService from '../services/SetDataService';
import authService from '../services/auth.service';

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '250px',
  margin: '0 auto'
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(1),
  backgroundColor: '#f5f5f5'
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1), // Reduces default padding
  '&:last-child': {
    paddingBottom: theme.spacing(1) // Reduces bottom padding
  }
}));

// Add these styled components at the top with your other styled components
const StyledList = styled(List)  ({
  padding: 0, // Removes padding from List
  margin: 0
});

const StyledListItemText = styled(ListItemText)({
  margin: 0, // Removes margin from ListItemText
  '& .MuiListItemText-primary': {
    fontSize: '0.9rem' // Optional: adjust text size if needed
  }
});


const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2)
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
        {Object.entries(workouts).map(([workoutId, sets], index) => (
          <Grid2 item xs={12} key={workoutId} >
            <StyledCard>
              <StyledCardContent>
                <Grid2 container justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" gutterBottom sx={{mb:0.5}}>
                    Workout {index + 1}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom sx={{mb:0.5}}>
                    {new Date(sets[0].date).toLocaleDateString()}
                  </Typography>
                </Grid2>

                <Divider sx={{ my: 1 }} />
                
                <Grid2 container spacing={1} alignContent={'center'} justifyContent={'center'}>
                  <Grid2 item xs={6}>
                    <Typography variant="subtitle2" fontWeight="bold" >
                      Weight
                    </Typography>
                    <StyledList>
                      {sets.map(set => (
                        <ListItem key={set.id}  dense disablePadding>
                          <StyledListItemText primary={set.weight} />
                        </ListItem>
                      ))}
                    </StyledList>
                  </Grid2>
                  <Grid2 item xs={6}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Reps
                    </Typography>
                    <StyledList>
                      {sets.map(set => (
                        <ListItem key={set.id} dense disablePadding>
                          <StyledListItemText primary={set.reps} />
                        </ListItem>
                      ))}
                    </StyledList>
                  </Grid2>
                </Grid2>
              </StyledCardContent>
            </StyledCard>
          </Grid2>
        ))}
    </Root>
  );
}

export default SetsHistory;
