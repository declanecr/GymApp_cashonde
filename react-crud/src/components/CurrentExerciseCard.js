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
    <Card elevation={4}  sx={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f5f5f5', mt: 2, maxWidth: 750 }}>
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
        {exercise.instructions && (
          <Grid item xs={12}>
            <Box sx={{borderRadius: '8px'}}>
              <Typography variant="subtitle1">
                <strong>Instructions:</strong>
              </Typography>
              <Typography variant="body1">{exercise.instructions}</Typography>
            </Box>
          </Grid>
        )}

        {exercise.muscle_diagram_url && (
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle1">
                <strong>Muscle Diagram:</strong>
              </Typography>
              <Box sx={{ mt: 1 }}>
                <img 
                  src={exercise.muscle_diagram_url} 
                  alt="Muscle diagram" 
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                />
              </Box>
            </Box>
          </Grid>
        )}

        {exercise.images_url && exercise.images_url.length > 0 && (
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle1">
                <strong>Exercise Images:</strong>
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {(() => {
                try {
                  const images = Array.isArray(exercise.images_url) 
                    ? exercise.images_url 
                    : JSON.parse(exercise.images_url || '[]');
                  
                  return images.map((url, index) => (
                    <img 
                      key={index}
                      src={url} 
                      alt={`Exercise ${index + 1}`} 
                      style={{ 
                        maxWidth: '200px', 
                        height: 'auto', 
                        borderRadius: '8px'
                      }}
                    />
                  ));
                } catch (error) {
                  console.error('Error parsing images_url:', error);
                  return null;
                }
              })()}
              </Box>
            </Box>
          </Grid>
        )}
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
    rating: PropTypes.string,
    instructions: PropTypes.string,
    images_url: PropTypes.arrayOf(PropTypes.string),
    muscle_diagram_url: PropTypes.string,
  }),
};

export default CurrentExerciseCard;
