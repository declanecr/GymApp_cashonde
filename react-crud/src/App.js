/**
 * App.js
 * 
 * This is the main component of the Gym App. It sets up the routing structure
 * and manages the global state for the current workout.
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';

import Profile from './components/profile.component';
import authService from './services/auth.service';
import {
  STORAGE_KEYS,
  getFromLocalStorage,
  updateWorkoutState
} from './services/localStorageService';

import Login from './components/login/Login';
//import Login from './components/login.component';
import { CssBaseline } from '@mui/material';
import CurrentWorkoutDrawer from './components/CurrentWorkoutDrawer';
import SignUp from './components/login/SignUp';
import NavBar from './components/NavBar';
import AddExercise from './pages/AddExercisePage';
import ExercisesList from './pages/ExercisesPage';
import Home from './pages/Home';
import IndividualExercisePage from './pages/IndividualExercisePage';
import SetsHistory from './pages/SetsHistory';
import UserPage from './pages/UserPage';
import WorkoutGenPage from './pages/WorkoutGenPage';

//class App extends Component 
class App extends Component {
  constructor(props) {
    super(props);
    this.logOut=this.logOut.bind(this)
    this.state = {
      token: null,
      currentUser: undefined,
      workoutState: null
    };
  }



  componentDidMount() {
    const user = authService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        token: user.accessToken,
      });
    }

    // Load workout state from localStorage
    const workoutState = getFromLocalStorage(STORAGE_KEYS.WORKOUT_STATE);
    if (workoutState) {
      this.setState({ workoutState });
    }
  }

  logOut() {
    authService.logout();
    this.setState({
      showModeratorBoard: false,
      token: null,
      currentUser: undefined,
      workoutState: null
    });
  }

  // Methods to update state
  setToken = (newToken) => {
    this.setState({ token: newToken });
  };

  addToWorkout = (exercise) => {
    const { workoutState } = this.state;
    const currentWorkout = workoutState?.workout || [];
    const updatedWorkout = [...currentWorkout, exercise];
    
    const newWorkoutState = {
      workout: updatedWorkout,
      sets: workoutState?.sets || {},
      startTime: workoutState?.startTime || null,
      isStarted: workoutState?.isStarted || false
    };

    updateWorkoutState(
      newWorkoutState.workout,
      newWorkoutState.sets,
      newWorkoutState.startTime,
      newWorkoutState.isStarted
    );
    
    this.setState({ workoutState: newWorkoutState });
  };

  removeFromWorkout = (exerciseToRemove) => {
    const { workoutState } = this.state;
    if (!workoutState) return;

    const updatedWorkout = workoutState.workout.filter(
      (exercise) => exercise.id !== exerciseToRemove.id
    );

    // Remove sets for the removed exercise
    const updatedSets = { ...workoutState.sets };
    delete updatedSets[exerciseToRemove.id];

    const newWorkoutState = {
      ...workoutState,
      workout: updatedWorkout,
      sets: updatedSets
    };

    updateWorkoutState(
      newWorkoutState.workout,
      newWorkoutState.sets,
      newWorkoutState.startTime,
      newWorkoutState.isStarted
    );

    this.setState({ workoutState: newWorkoutState });
  };

  deleteWorkout = () => {
    updateWorkoutState([], {}, null, false);
    this.setState({ workoutState: null });
  };
  
  render() {
    // eslint-disable-next-line
    const { currentUser, token, workoutState } = this.state;
    const currentWorkout = workoutState?.workout || [];

  
    return (
      <>
      <CssBaseline />
        {/* Conditionally render NavBar only if the user is logged in */}
        {token && (
          <>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <NavBar logOut={this.logOut}/>
            </nav>
            {/* Add WorkoutDrawer here, it will be present on all authenticated pages */}
            {currentWorkout.length > 0 && (
              <CurrentWorkoutDrawer 
                removeFromWorkout={this.removeFromWorkout}
                deleteWorkout={this.deleteWorkout}
                addToWorkout={this.addToWorkout}
              />
            )}
          </>
        )}
        
          <Routes>
            <Route path="/" element={<Login setToken={this.setToken} />} />
            {/* Make Login and Signup available regardless of token */}
            <Route path="/login" element={<Login setToken={this.setToken} />} />
            <Route path="/signup" element={<SignUp setToken={this.setToken} />} />
            {/* Only allow profile and protected routes if logged in */}
            {token && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route 
                path="/exercises" 
                element={<ExercisesList addToWorkout={this.addToWorkout} />} 
              />
              <Route path="/add" element={<AddExercise />} />
              <Route 
                path="/current-workout" 
                element={
                  <WorkoutGenPage 
                    currentWorkout={currentWorkout} 
                    removeFromWorkout={this.removeFromWorkout}
                    deleteWorkout={this.deleteWorkout}
                    addToWorkout={this.addToWorkout}
                  />
                } 
              />
              <Route 
                path="/exercises/:id" 
                element={<IndividualExercisePage addToWorkout={this.addToWorkout} />} 
              />
              <Route path="/exercises/:id/sets" element={<SetsHistory />} />
              <Route path="/users" element={<UserPage />} />
            </>
          )}
          </Routes>
      </>
    );
  }
}


export default App;