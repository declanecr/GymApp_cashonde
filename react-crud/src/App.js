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
  clearFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage
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
      currentWorkout: [],
      token: null,
      currentUser: undefined,
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

    // Load current workout from localStorage using the service
    const savedWorkout = getFromLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT);
    if (savedWorkout) {
      this.setState({ currentWorkout: savedWorkout });
    }
  }

  logOut() {
    authService.logout();
    this.setState({
      showModeratorBoard: false,
      token: null,
      currentUser: undefined
    });
  }

  // Methods to update state
  setToken = (newToken) => {
    this.setState({ token: newToken });
  };

  addToWorkout = (exercise) => {
    this.setState(
      (prevState) => ({
        currentWorkout: [...prevState.currentWorkout, exercise],
      }),
      () => {
        saveToLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT, this.state.currentWorkout);
      }
    );
  };

  removeFromWorkout = (exerciseToRemove) => {
    this.setState(
      (prevState) => ({
        currentWorkout: prevState.currentWorkout.filter(
          (exercise) => exercise.id !== exerciseToRemove.id
        ),
      }),
      () => {
        saveToLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT, this.state.currentWorkout);
      }
    );
  };

  deleteWorkout = () => {
    this.setState({ currentWorkout: [] }, () => {
      clearFromLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT);
    });
  };
  render() {
    // eslint-disable-next-line
    const { currentUser,  currentWorkout, token } = this.state;
  
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
                currentWorkout={getFromLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT)}
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