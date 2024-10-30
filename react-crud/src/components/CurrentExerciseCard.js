import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';

import { Box, Card, CardContent, Typography } from '@mui/material';

const CurrentExerciseCard = ({ exercise }) => {
  if (!exercise) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        Please select an Exercise...
      </Typography>
    );
  }

  return (
    <Card elevation={4} sx={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f5f5f5', mt: 2 }}>
      <CardContent sx={{ fontFamily: 'Consolas, monospace' }}>
        <Typography variant="h3" align="center" color="primary" gutterBottom sx={{ fontFamily: 'Consolas, monospace' }}>
          {exercise.name}
        </Typography>

        <Grid container spacing={2}>
          {exercise.description && exercise.description !== 'n/a' && (
            <Grid item xs={12}>
              <Box sx={{borderRadius: '8px'}}>
                <Typography variant="subtitle1">
                  <strong>Description:</strong>
                </Typography>
                <Typography variant="body1">{exercise.description}</Typography>
              </Box>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle1">
                <strong>Type:</strong>
              </Typography>
              <Typography variant="body1">{exercise.type}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle1">
                <strong>Main Muscle:</strong>
              </Typography>
              <Typography variant="body1">{exercise.main_muscle}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle1">
                <strong>Equipment:</strong>
              </Typography>
              <Typography variant="body1">{exercise.equipment}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle1">
                <strong>Level:</strong>
              </Typography>
              <Typography variant="body1">{exercise.level}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle1">
                <strong>Rating:</strong>
              </Typography>
              <Typography variant="body1">{exercise.rating}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};


CurrentExerciseCard.propTypes = {
  exercise: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    main_muscle: PropTypes.string,
    equipment: PropTypes.string,
    level: PropTypes.string,
    rating: PropTypes.number,
  }),
};

export default CurrentExerciseCard;
