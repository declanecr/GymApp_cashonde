import express from 'express';
import * as workouts from '../controllers/workout.controller.js';

const router = express.Router();


export default function (app) {
    // Create a new Workout
    router.post('/', workouts.create);

    // Retrieve all Workouts
    router.get('/', workouts.findAll);

    // Generate workouts then returns exercises
    router.get('/generate/:numDays', (req, res) => {
        console.log('Number of days:', req.params.numDays);
        workouts.generateWorkout(req, res);
    });

    // Retrieve a single Workout with workoutId
    router.get('/:id', workouts.findOne);

    // Update a Workout with workoutId
    router.put('/:id', workouts.update);

    // Delete a Workout with workoutId
    router.delete('/:id', workouts.remove);

    // Gets Sets from a workout
    router.get('/:id/sets', workouts.getWorkoutSets);

    // Start a workout
    router.put('/:id/start', workouts.startWorkout);

    // End a workout
    router.put('/:id/end', workouts.endWorkout);

    app.use('/api/workouts', router);
}

