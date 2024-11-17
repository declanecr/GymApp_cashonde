import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Box, Card, CardContent, Container, Divider, List, ListItem, ListItemText, Modal, Typography } from '@mui/material';

const CurrentExerciseCard = ({ exercise }) => {
  // State to control the Modal visibility and store selected image
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  if (!exercise) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        Please select an Exercise...
      </Typography>
    );
  }

  // Function to open the modal with the selected image
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  return (
    <Container maxWidth={false}>
    <Card elevation={4} 
    sx={{ 
      borderRadius: '10px', 
      overflow: 'hidden',
      backgroundColor: '#f5f5f5', 
      mt: 2,
      maxWidth: '100%', // Changed from fixed width to be fully responsive
      mx: 'auto' // Center the card
    }}>
      <CardContent sx={{ 
        fontFamily: 'Consolas, monospace',
        p: { xs: 2, sm: 3 } // Responsive padding
      }}>
        <Typography 
          variant="h3" 
          align="center" 
          color="primary" 
          gutterBottom 
          sx={{ 
            fontFamily: 'Consolas, monospace',
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }, // Responsive font size
            whiteSpace: 'normal',
            wordBreak: 'break-word'
          }}
        >
          {exercise.name}
        </Typography>
        {/* Images and Content Section */}
        <Grid container spacing={2}>
          {/* Images Section - Take up 5 columns on medium+ screen */}
          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
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
                                    maxWidth: '100%',                         
                                    height: 'auto', 
                                    borderRadius: '8px'
                                  }}
                                  onClick={() => handleImageClick(url)} // Open modal on click
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
                            style={{ 
                              maxWidth: '100%', 
                              height: 'auto', 
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                            
                            />
                          <Typography variant="h6" align="center" sx={{display: 'block', mt: 1}}>
                            {exercise.main_muscle}
                          </Typography>
                        </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
            <Divider sx={{ 
              my: 3,
              width: '100%',
              border: '1px solid',
              borderColor: 'divider',
            }} />
            <Grid item xs={12} md ={7}>
            {/* Description Section */}
              {exercise.description && exercise.description !== 'n/a' && (
                <Box
                  sx={{
                    borderRadius: '8px',
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    overflow: 'hidden', // Ensure no overflow
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <strong>Description:</strong>
                  </Typography>
                  <Typography variant="body1">{exercise.description}</Typography>
                </Box>
              )}

              {/* Exercise Details Section */}
              <Box sx={{
                borderRadius: '8px',
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{mb: 2}}>
                      <Typography variant="subtitle1" sx={{mb: 0.5}}>
                        <strong>Type:</strong>
                      </Typography>
                      <Typography variant="body1">{exercise.type}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{mb: 2}}>
                      <Typography variant="subtitle1" sx={{mb: 0.5}}>
                        <strong>Main Muscle:</strong>
                      </Typography>
                      <Typography variant="body1">{exercise.main_muscle}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{mb: 2}}>
                      <Typography variant="subtitle1" sx={{mb: 0.5}}>
                        <strong>Equipment:</strong>
                      </Typography>
                      <Typography variant="body1">{exercise.equipment}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{mb: 2}}>
                      <Typography variant="subtitle1" sx={{mb: 0.5}}>
                        <strong>Level:</strong>
                      </Typography>
                      <Typography variant="body1">{exercise.level}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle1" sx={{mb: 0.5}}>
                        <strong>Rating:</strong>
                      </Typography>
                      <Typography variant="body1">{exercise.rating}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              

              {/* Instructions Section */}
                {exercise.instructions && (
                  <Box
                    sx={{
                      borderRadius: '8px',
                      p: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      <strong>Instructions:</strong>
                    </Typography>
                    <List
                      sx={{
                        pl: 2,
                        overflowY: 'auto', // Scroll if content overflows
                        maxHeight: '200px',
                      }}
                    >
                      {exercise.instructions
                        .split(/\d+\.\s/)
                        .filter(Boolean)
                        .map((instruction, index) => (
                          <ListItem key={index} sx={{ pl: 0 }}>
                            <ListItemText>
                              {index + 1}. {instruction.trim()}
                            </ListItemText>
                          </ListItem>
                        ))}
                    </List>
                  </Box>
                )}
            </Grid>
        </Grid>        
      </CardContent>
      {/* Modal to display the full-screen image */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            height: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px'
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full-Screen Exercise"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                height: 'auto',
                width: 'auto',
                borderRadius: '8px'
              }}
            />
          )}
        </Box>
      </Modal>
    </Card>
    </Container>
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
