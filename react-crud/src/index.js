/**
 * index.js
 * 
 * This is the entry point for the React application. It sets up the root component,
 * wraps it in a BrowserRouter for routing, and renders it to the DOM.
 * It also includes setup for performance measurement using reportWebVitals.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.js';
import './index.css';
import reportWebVitals from './reportWebVitals.js';

const container=document.getElementById("root");
const root =createRoot(container);


root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();