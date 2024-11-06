/**
 * App.js
 * 
 * This is the main component of the Gym App. It sets up the routing structure
 * and manages the global state for the current workout.
 */

import 'bootstrap/dist/css/bootsrap.min.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
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
    this.state = {
      currentWorkout: [],
      token: null
    };
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

  render(){
    const { currentWorkout, token } =this.state;
    
    // If there's no token, redirect to the login page
    if (!token) {
      return <Login setToken={this.setToken} />;
    }
    
    return (
      <>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercises" element={<ExercisesList addToWorkout={addToWorkout} />} />
          <Route path="/add" element={<AddExercise />} />
          <Route path="/current-workout" element={<CurrentWorkout currentWorkout={currentWorkout} removeFromWorkout={removeFromWorkout} deleteWorkout={deleteWorkout} addToWorkout={addToWorkout}/>} />
          <Route path="/exercises/:id/sets" element={<SetsHistory/>} />
          <Route path="/users" element ={<UserPage/>}/>
        </Routes>
      </>
    );
  }
};


export default App;