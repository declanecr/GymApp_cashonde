/**
 * NavBar Component
 * 
 * This component provides navigation for the main pages of the Gym App.
 * It includes links to Home, Exercises, Add Exercise, and Current Workout pages.
 * It also wraps the main content in Routes for proper routing.
 */

import React from 'react';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}> {/* Dispersing items over the space */}
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/exercises" color="inherit">
            Exercises
          </Button>
          <Button component={Link} to="/add" color="inherit">
            Add Exercise
          </Button>
          <Button component={Link} to="/current-workout" color="inherit">
            Current Workout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;