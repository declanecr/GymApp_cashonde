import express from 'express';
import * as workouts from '../controllers/workout.controller.js';

const router = express.Router();


export default function (app) {
    // Create a new Workout
    router.post('/', workouts.create);

    // Retrieve all Workouts
    router.get('/', workouts.findAll);

    // Retrieve a single Workout with workoutId
    router.get('/:id', workouts.findOne);

    // Update a Workout with workoutId
    router.put('/:id', workouts.update);

    // Delete a Workout with workoutId
    router.delete('/:id', workouts.remove);

    // Gets Sets from a workout
    router.get('/:id/sets', workouts.getWorkoutSets);

    app.use('/api/workouts', router);
}

