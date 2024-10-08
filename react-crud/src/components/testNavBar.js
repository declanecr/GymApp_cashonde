import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/exercises">Exercises</Link></li>
        <li><Link to="/add">Add an Exercise</Link></li>
        <li><Link to="/current-workout">Current Workout</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;