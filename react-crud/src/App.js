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

import Login from './components/login/Login';
//import Login from './components/login.component';
import SignUp from './components/login/SignUp';
import NavBar from './components/NavBar';
import AddExercise from './pages/AddExercisePage';
import CurrentWorkout from './pages/CurrentWorkout';
import ExercisesList from './pages/ExercisesPage';
import Home from './pages/Home';
import SetsHistory from './pages/SetsHistory';
import UserPage from './pages/UserPage';

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
    console.log('componentDidMount user: ', user);
    if (user) {
      this.setState({
        currentUser: user,

      });
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
    this.setState((prevState) => ({
      currentWorkout: [...prevState.currentWorkout, exercise]
    }));
  };

  removeFromWorkout = (exerciseToRemove) => {
    this.setState((prevState) => ({
      currentWorkout: prevState.currentWorkout.filter(
        exercise => exercise.id !== exerciseToRemove.id
      )
    }));
  };

  deleteWorkout = () => {
    this.setState({ currentWorkout: [] });
  };
  render() {
    // eslint-disable-next-line
    const { currentUser,  currentWorkout, token } = this.state;
  
    return (
      <>
        {/* Conditionally render NavBar only if the user is logged in */}
        {token && (
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <NavBar logOut={this.logOut}/>
          </nav>
        )}
        
        <div className="container mt-3">
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
                <Route path="/exercises" element={<ExercisesList addToWorkout={this.addToWorkout} />} />
                <Route path="/add" element={<AddExercise />} />
                <Route path="/current-workout" element={<CurrentWorkout currentWorkout={currentWorkout} removeFromWorkout={this.removeFromWorkout} deleteWorkout={this.deleteWorkout} addToWorkout={this.addToWorkout} />} />
                <Route path="/exercises/:id/sets" element={<SetsHistory />} />
                <Route path="/users" element={<UserPage />} />
              </>
            )}
          </Routes>
        </div>
      </>
    );
  }
}


export default App;