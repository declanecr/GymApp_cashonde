/**
 * App.js
 * 
 * This is the main component of the Gym App. It sets up the routing structure
 * and manages the global state for the current workout.
 */

import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SignIn from './components/login/loginPage';
import SignUp from './components/login/SignUp';
import NavBar from './components/NavBar';
import AddExercise from './pages/AddExercisePage';
import CurrentWorkout from './pages/CurrentWorkout';
import ExercisesList from './pages/ExercisesPage';
import Home from './pages/Home';
import LoginSignupPage from './pages/LoginSignupPage';
import SetsHistory from './pages/SetsHistory';
import UserProfilePage from './pages/UserProfilePage';


const App = () => {
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [currentUser, setCurrentUser] =useState(null);
  const navigate=useNavigate();


    useEffect(() => {
        // Check if user is logged in
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setCurrentUser(foundUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        navigate('/login');
    };

  

  const addToWorkout = (exercise) => {
    setCurrentWorkout(prevWorkout=>[...prevWorkout, exercise]);
  };

  const removeFromWorkout = (exerciseToRemove) => {
    console.log('App.removeFromWorkout: removing: ',exerciseToRemove.name);
    setCurrentWorkout(currentWorkout.filter(exercise => exercise.id !== exerciseToRemove.id));
  };

  const deleteWorkout =() => {
    setCurrentWorkout([]);
  };

  return (
    <div className='App'>
      <NavBar currentUser={currentUser} setCurrentUser= {setCurrentUser} handleLogout={handleLogout}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercises" element={<ExercisesList addToWorkout={addToWorkout} />} />
        <Route path="/add" element={<AddExercise />} />
        <Route path="/current-workout" element={<CurrentWorkout currentWorkout={currentWorkout} removeFromWorkout={removeFromWorkout} deleteWorkout={deleteWorkout} addToWorkout={addToWorkout}/>} />
        <Route path="/exercises/:id/sets" element={<SetsHistory/>} />
        <Route path="/users/:user_id" element ={<UserProfilePage currentUser={currentUser} handleLogout={handleLogout}/>}/>
        <Route path="/login" element={<SignIn setCurrentUser={setCurrentUser}/>}/>
        <Route path="/signup" element={<SignUp setCurrentUser={setCurrentUser}/>}/>
        <Route path="/users" element={<LoginSignupPage setCurrentUser={setCurrentUser}/>}/>
      </Routes>
    </div>
  );
};

export default App;