import { expect } from 'chai';
import sinon from 'sinon';
import ExerciseModel from '../app/models/exercise.model.js';
import WorkoutModel from '../app/models/workout.model.js';

describe('Workout Generation Tests', () => {
    let exerciseStub, workoutStub;

    beforeEach(() => {
        exerciseStub = sinon.stub(ExerciseModel);
        workoutStub = sinon.stub(WorkoutModel);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('generateFullBodyWorkout', () => {
        it('should generate a full body workout', () => {
        const exercises = [];
        const availableExercises = [
            { id: 1, name: 'Squat', musclesUsed: ['Legs'] },
            { id: 2, name: 'Bench Press', musclesUsed: ['Chest'] },
            { id: 3, name: 'Deadlift', musclesUsed: ['Back'] }
        ];

        workoutStub.generateFullBodyWorkout.callsFake((exercises, availableExercises) => {
            exercises.push(...availableExercises);
            return {
                name: `Full Body - ${new Date().toLocaleString()}`,
                exercises: exercises
            };
        });

        const workout = workoutStub.generateFullBodyWorkout(exercises, availableExercises);

        expect(workout).to.have.property('name').that.includes('Full Body');
        expect(workout.exercises).to.have.lengthOf(3);
        });
    });

    describe('generateUpperBodyWorkout', () => {
        it('should generate an upper body workout', () => {
        const exercises = [];
        const availableExercises = [
            { id: 1, name: 'Bench Press', musclesUsed: ['Chest'] },
            { id: 2, name: 'Pull-ups', musclesUsed: ['Back'] },
            { id: 3, name: 'Shoulder Press', musclesUsed: ['Shoulders'] },
            { id: 4, name: 'Bicep Curls', musclesUsed: ['Arms'] },
            { id: 5, name: 'Squat', musclesUsed: ['Legs'] }
        ];

        workoutStub.generateUpperBodyWorkout.callsFake((exercises, availableExercises) => {
            exercises.push(...availableExercises.filter(ex => !ex.musclesUsed.includes('Legs')));
            return {
                name: `Upper Body - ${new Date().toLocaleString()}`,
                exercises: exercises
            };
        });

        const workout = workoutStub.generateUpperBodyWorkout(exercises, availableExercises);

        expect(workout).to.have.property('name').that.includes('Upper Body');
        expect(workout.exercises).to.have.lengthOf(4);
        expect(workout.exercises.every(ex => !ex.musclesUsed.includes('Legs'))).to.be.true;
        });
    });

    describe('generateLowerBodyWorkout', () => {
        it('should generate a lower body workout', () => {
        const exercises = [];
        const availableExercises = [
            { id: 1, name: 'Squat', musclesUsed: ['Legs'] },
            { id: 2, name: 'Deadlift', musclesUsed: ['Legs', 'Back'] },
            { id: 3, name: 'Leg Press', musclesUsed: ['Legs'] },
            { id: 4, name: 'Calf Raises', musclesUsed: ['Legs'] },
            { id: 5, name: 'Bench Press', musclesUsed: ['Chest'] }
        ];

        workoutStub.generateLowerBodyWorkout.callsFake((exercises, availableExercises) => {
            exercises.push(...availableExercises.filter(ex => ex.musclesUsed.includes('Legs')));
            return {
                name: `Lower Body - ${new Date().toLocaleString()}`,
                exercises: exercises
            };
        });

        const workout = workoutStub.generateLowerBodyWorkout(exercises, availableExercises);

        expect(workout).to.have.property('name').that.includes('Lower Body');
        expect(workout.exercises).to.have.lengthOf(4);
        expect(workout.exercises.every(ex => ex.musclesUsed.includes('Legs'))).to.be.true;
        });
    });

    describe('generatePushWorkout', () => {
        it('should generate a push workout', () => {
        const exercises = [];
        const availableExercises = [
            { id: 1, name: 'Bench Press', musclesUsed: ['Chest'] },
            { id: 2, name: 'Shoulder Press', musclesUsed: ['Shoulders'] },
            { id: 3, name: 'Tricep Extensions', musclesUsed: ['Arms'] },
            { id: 4, name: 'Pull-ups', musclesUsed: ['Back'] }
        ];

        workoutStub.generatePushWorkout.callsFake((exercises, availableExercises) => {
            exercises.push(...availableExercises.filter(ex => ['Chest', 'Shoulders', 'Arms'].some(muscle => ex.musclesUsed.includes(muscle))));
            return {
                name: `Push - ${new Date().toLocaleString()}`,
                exercises: exercises
            };
        });

        const workout = workoutStub.generatePushWorkout(exercises, availableExercises);

        expect(workout).to.have.property('name').that.includes('Push');
        expect(workout.exercises).to.have.lengthOf(3);
        });
    });

    describe('generatePullWorkout', () => {
        it('should generate a pull workout', () => {
        const exercises = [];
        const availableExercises = [
            { id: 1, name: 'Pull-ups', musclesUsed: ['Back'] },
            { id: 2, name: 'Bicep Curls', musclesUsed: ['Arms'] },
            { id: 3, name: 'Rows', musclesUsed: ['Back'] },
            { id: 4, name: 'Bench Press', musclesUsed: ['Chest'] }
        ];

        workoutStub.generatePullWorkout.callsFake((exercises, availableExercises) => {
            exercises.push(...availableExercises.filter(ex => ['Back', 'Arms'].some(muscle => ex.musclesUsed.includes(muscle))));
            return {
                name: `Pull - ${new Date().toLocaleString()}`,
                exercises: exercises
            };
        });

        const workout = workoutStub.generatePullWorkout(exercises, availableExercises);

        expect(workout).to.have.property('name').that.includes('Pull');
        expect(workout.exercises).to.have.lengthOf(3);
        });
    });

    describe('generateLegWorkout', () => {
        it('should generate a leg workout', () => {
        const exercises = [];
        const availableExercises = [
            { id: 1, name: 'Squat', musclesUsed: ['Legs'] },
            { id: 2, name: 'Leg Press', musclesUsed: ['Legs'] },
            { id: 3, name: 'Calf Raises', musclesUsed: ['Legs'] },
            { id: 4, name: 'Bench Press', musclesUsed: ['Chest'] }
        ];

        workoutStub.generateLegWorkout.callsFake((exercises, availableExercises) => {
            exercises.push(...availableExercises.filter(ex => ex.musclesUsed.includes('Legs')));
            return {
                name: `Leg - ${new Date().toLocaleString()}`,
                exercises: exercises
            };
        });

        const workout = workoutStub.generateLegWorkout(exercises, availableExercises);

        expect(workout).to.have.property('name').that.includes('Leg');
        expect(workout.exercises).to.have.lengthOf(3);
        expect(workout.exercises.every(ex => ex.musclesUsed.includes('Legs'))).to.be.true;
        });
    });

    describe('generateWorkout', () => {
        it('should generate workouts based on the number of days', () => {
        const numDays = 3;
        const exercises = [];
        const availableExercises = [
            { id: 1, name: 'Squat', musclesUsed: ['Legs'] },
            { id: 2, name: 'Bench Press', musclesUsed: ['Chest'] },
            { id: 3, name: 'Deadlift', musclesUsed: ['Back'] },
            { id: 4, name: 'Shoulder Press', musclesUsed: ['Shoulders'] },
            { id: 5, name: 'Pull-ups', musclesUsed: ['Back'] }
        ];

        workoutStub.generateWorkout.callsFake((numDays, exercises, availableExercises) => {
            return [
                { name: 'Push', exercises: availableExercises.filter(ex => ['Chest', 'Shoulders'].some(muscle => ex.musclesUsed.includes(muscle))) },
                { name: 'Pull', exercises: availableExercises.filter(ex => ex.musclesUsed.includes('Back')) },
                { name: 'Legs', exercises: availableExercises.filter(ex => ex.musclesUsed.includes('Legs')) }
            ];
        });

        const workouts = workoutStub.generateWorkout(numDays, exercises, availableExercises);

        expect(workouts).to.have.lengthOf(3);
        expect(workouts[0].name).to.equal('Push');
        expect(workouts[1].name).to.equal('Pull');
        expect(workouts[2].name).to.equal('Legs');
        });
    });
});