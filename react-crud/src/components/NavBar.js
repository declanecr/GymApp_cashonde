/**
 * NavBar Component
 * 
 * This component provides navigation for the main pages of the Gym App.
 * It includes links to Home, Exercises, Add Exercise, and Current Workout pages.
 * It also includes an autocomplete search bar for exercises.
 */

import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Autocomplete, Button, Container, IconButton, InputAdornment, Menu, MenuItem, TextField, Toolbar, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ExerciseDataService from '../services/ExerciseDataService';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const NavBar = ({logOut}) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ExerciseDataService.getAll()
      .then(response => {
        console.log('API Response:', response);
        setExercises(response.data.map(exercise => ({ id: exercise.id, name: exercise.name })));
      })
      .catch(error => console.error('Error fetching exercises:', error));
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExerciseSelect = (event, newValue) => {
    if (newValue) {
      navigate(`/exercises/${newValue.id}`);
    }
  };

  const [searchValue, setSearchValue] = useState(null);

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Gym App
            </Typography>
            <Search>
              <Autocomplete
                freeSolo
                options={exercises}
                value={searchValue}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search exercises..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                onChange={(event, newValue) => {
                  setSearchValue(null);
                  handleExerciseSelect(event, newValue);
                }}
                sx={{ width: 300 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionKey={(option)=>option.id}
              />
            </Search>
            {currentUser ? (
              <>
                <Button color="inherit" component={Link} to="/exercises">Exercises</Button>
                <Button color="inherit" component={Link} to="/current-workout">Workouts</Button>
                <div>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => {
                      handleClose();
                      navigate(`/users`);
                    }}>Account</MenuItem>
                    <MenuItem onClick={handleClose}>Settings</MenuItem>
                    <MenuItem onClick={handleClose}>My Metrics</MenuItem>
                    <MenuItem onClick={() => { handleClose(); 
                      logOut();
                      navigate('/'); }}>Logout</MenuItem>
                  </Menu>
                </div>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">Login</Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

NavBar.propTypes={
  logOut: PropTypes.func.isRequired
}

export default NavBar;