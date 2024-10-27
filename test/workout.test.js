import { expect } from 'chai';
import sinon from 'sinon';
import * as WorkoutController from '../app/controllers/workout.controller.js';
import sql from '../app/models/db.js';
import Workout from '../app/models/workout.model.js';

describe('Workout Module Tests', () => {
  describe('Workout Model', () => {
    let sqlStub;

    beforeEach(() => {
      sqlStub = sinon.stub(sql, 'query');
    });

    afterEach(() => {
      sqlStub.restore();
    });

    it('should create a new workout', (done) => {
      const newWorkout = {
        id: 1,
        name: 'Test Workout',
        date: '2023-10-23'
      };

      const expectedResult = { id: 1, ...newWorkout };

      sqlStub.yields(null, [expectedResult]);

      Workout.create(newWorkout, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(expectedResult);
        done();
      });
    });

    it('should find a workout by id', (done) => {
      const expectedWorkout = {
        id: 1,
        name: 'Test Workout',
        date: '2023-10-23'
      };

      sqlStub.yields(null, [expectedWorkout]);

      Workout.findById(1, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(expectedWorkout);
        done();
      });
    });

    it('should get all workouts', (done) => {
      const expectedWorkouts = [
        { id: 1, name: 'Workout 1', date: '2023-10-23' },
        { id: 2, name: 'Workout 2', date: '2023-10-24' }
      ];

      sqlStub.yields(null, expectedWorkouts);

      Workout.getAll((err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(expectedWorkouts);
        done();
      });
    });

    it('should update a workout', (done) => {
      const updatedWorkout = {
        name: 'Updated Workout',
        date: '2023-10-25'
      };

      sqlStub.yields(null, { affectedRows: 1 });

      Workout.updateById(1, updatedWorkout, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal({ id: 1, ...updatedWorkout });
        done();
      });
    });

    it('should remove a workout', (done) => {
      sqlStub.yields(null, { affectedRows: 1 });

      Workout.remove(1, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal({ affectedRows: 1 });
        done();
      });
    });

    it('should get sets for a workout', (done) => {
      const expectedSets = [
        { id: 41, exercise_id: 1, workout_id: 1, reps: 15, weight: 0.00 },
        { id: 137, exercise_id: 1, workout_id: 679, reps: 5, weight: 1.00 }
      ];

      sqlStub.yields(null, expectedSets);
      
      Workout.getSets(1, (err, result) => {
        expect(err).to.be.null;
        //console.log('result: ', result);
        //console.log('expectedSets: ',expectedSets);
        expect(result).to.deep.equal(expectedSets);
        done();
      });
    });
  });

  describe('Workout Controller', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        params: {},
        body: {}
      };
      res = {
        status: sinon.stub().returns({ send: sinon.spy() }),
        send: sinon.spy(),
        json: sinon.spy()
      };
      next = sinon.spy();
    });

    it('should create a new workout', (done) => {
      req.body = {
        name: 'Test Workout',
        date: '2023-10-23'
      };

      const expectedWorkout = {
        id: 1,
        ...req.body
      };

      const createStub = sinon.stub(Workout, 'create').yields(null, expectedWorkout);

      WorkoutController.create(req, res);

      sinon.assert.calledOnce(createStub);
      sinon.assert.calledWith(res.send, expectedWorkout);

      createStub.restore();
      done();
    });

    it('should return all workouts', (done) => {
      const expectedWorkouts = [
        { id: 1, name: 'Workout 1', date: '2023-10-23' },
        { id: 2, name: 'Workout 2', date: '2023-10-24' }
      ];

      const getAllStub = sinon.stub(Workout, 'getAll').yields(null, expectedWorkouts);

      WorkoutController.findAll(req, res);

      sinon.assert.calledOnce(getAllStub);
      sinon.assert.calledWith(res.send, expectedWorkouts);

      getAllStub.restore();
      done();
    });

    it('should find one workout', (done) => {
      req.params.id = '1';
      const expectedWorkout = { id: 1, name: 'Test Workout', date: '2023-10-23' };

      const findByIdStub = sinon.stub(Workout, 'findById').yields(null, expectedWorkout);

      WorkoutController.findOne(req, res);

      sinon.assert.calledOnce(findByIdStub);
      sinon.assert.calledWith(res.send, expectedWorkout);

      findByIdStub.restore();
      done();
    });

    it('should update a workout', (done) => {
      req.params.id = '1';
      req.body = {
        name: 'Updated Workout',
        date: '2023-10-25'
      };

      const updatedWorkout = { id: 1, ...req.body };

      const updateByIdStub = sinon.stub(Workout, 'updateById').yields(null, updatedWorkout);

      WorkoutController.update(req, res);

      sinon.assert.calledOnce(updateByIdStub);
      sinon.assert.calledWith(res.send, updatedWorkout);

      updateByIdStub.restore();
      done();
    });

    it('should delete a workout', (done) => {
      req.params.id = '1';

      const removeStub = sinon.stub(Workout, 'remove').yields(null, { message: 'Workout was deleted successfully!' });

      WorkoutController.remove(req, res);

      sinon.assert.calledOnce(removeStub);
      sinon.assert.calledWith(res.send, { message: 'Workout was deleted successfully!' });

      removeStub.restore();
      done();
    });

    it('should get sets for a workout', (done) => {
      req.params.id = '1';
      const expectedSets = [
        { id: 41, exercise_id: 1, workout_id: 1, reps: 15, weight: 0.00 },
        { id: 137, exercise_id: 1, workout_id: 679, reps: 5, weight: 1.00 }
      ];

      const getSetsStub = sinon.stub(Workout, 'getSets').yields(null, expectedSets);

      WorkoutController.getWorkoutSets(req, res);

      sinon.assert.calledOnce(getSetsStub);
      sinon.assert.calledWith(res.send, sinon.match.array);
      expect(res.send.firstCall.args[0]).to.deep.equal

      getSetsStub.restore();
      done();
    });

    
  });
});