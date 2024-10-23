import { expect } from 'chai';
import express from 'express';
import sinon from 'sinon';
import request from 'supertest';
import * as WorkoutController from '../app/controllers/workout.controller.js';
import sql from '../app/models/db.js';
import Workout from '../app/models/workout.model.js';

describe('Workout Module Tests', () => {
  // Workout Model Tests
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
        name: 'Test Workout',
        date: '2023-10-23'
      };

      const expectedResult = { id: 1, ...newWorkout };

      sqlStub.yields(null, { insertId: 1 });

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
        { id: 1, exercise_id: 1, workout_id: 1, reps: 10, weight: 50 },
        { id: 2, exercise_id: 2, workout_id: 1, reps: 12, weight: 45 }
      ];

      sqlStub.yields(null, expectedSets);

      Workout.getSets(1, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(expectedSets);
        done();
      });
    });
  });

  // Workout Controller Tests
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

      const createStub = sinon.stub(Workout, 'create').callsFake((workout, callback) => {
        callback(null, { id: 1, ...workout });
      });

      WorkoutController.create(req, res);

      sinon.assert.calledOnce(createStub);
      sinon.assert.calledWith(res.send, { id: 1, ...req.body });

      createStub.restore();
      done();
    });

    it('should return all workouts', (done) => {
      const expectedWorkouts = [
        { id: 1, name: 'Workout 1', date: '2023-10-23' },
        { id: 2, name: 'Workout 2', date: '2023-10-24' }
      ];

      const getAllStub = sinon.stub(Workout, 'getAll').callsFake((callback) => {
        callback(null, expectedWorkouts);
      });

      WorkoutController.findAll(req, res);

      sinon.assert.calledOnce(getAllStub);
      sinon.assert.calledWith(res.send, expectedWorkouts);

      getAllStub.restore();
      done();
    });

    it('should find one workout', (done) => {
      req.params.id = '1';
      const expectedWorkout = { id: 1, name: 'Test Workout', date: '2023-10-23' };

      const findByIdStub = sinon.stub(Workout, 'findById').callsFake((id, callback) => {
        callback(null, expectedWorkout);
      });

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

      const updateByIdStub = sinon.stub(Workout, 'updateById').callsFake((id, workout, callback) => {
        callback(null, updatedWorkout);
      });

      WorkoutController.update(req, res);

      sinon.assert.calledOnce(updateByIdStub);
      sinon.assert.calledWith(res.send, updatedWorkout);

      updateByIdStub.restore();
      done();
    });

    it('should delete a workout', (done) => {
      req.params.id = '1';

      const removeStub = sinon.stub(Workout, 'remove').callsFake((id, callback) => {
        callback(null, { message: 'Workout was deleted successfully!' });
      });

      WorkoutController.remove(req, res);

      sinon.assert.calledOnce(removeStub);
      sinon.assert.calledWith(res.send, { message: 'Workout was deleted successfully!' });

      removeStub.restore();
      done();
    });

    it('should get workout sets', (done) => {
      req.params.id = '1';
      const expectedSets = [
        { id: 1, exercise_id: 1, workout_id: 1, reps: 10, weight: 50 },
        { id: 2, exercise_id: 2, workout_id: 1, reps: 12, weight: 45 }
      ];

      const getSetsStub = sinon.stub(Workout, 'getSets').callsFake((id, callback) => {
        callback(null, expectedSets);
      });

      WorkoutController.getWorkoutSets(req, res);

      sinon.assert.calledOnce(getSetsStub);
      sinon.assert.calledWith(res.send, expectedSets);

      getSetsStub.restore();
      done();
    });
  });

  // Workout Routes Tests
  describe('Workout Routes', () => {
    let app;
    let mockWorkoutController;

    beforeEach(() => {
      app = express();
      mockWorkoutController = {
        create: sinon.stub(),
        findAll: sinon.stub(),
        findOne: sinon.stub(),
        update: sinon.stub(),
        remove: sinon.stub(),
        getWorkoutSets: sinon.stub()
      };

      const router = express.Router();
      router.post('/', mockWorkoutController.create);
      router.get('/', mockWorkoutController.findAll);
      router.get('/:id', mockWorkoutController.findOne);
      router.put('/:id', mockWorkoutController.update);
      router.delete('/:id', mockWorkoutController.remove);
      router.get('/:id/sets', mockWorkoutController.getWorkoutSets);

      app.use('/api/workouts', router);
    });

    it('should create a new workout', async () => {
      const newWorkout = {
        name: 'Test Workout',
        date: '2023-10-23'
      };

      mockWorkoutController.create.callsFake((req, res) => {
        res.status(201).json({ id: 1, ...newWorkout });
      });

      const response = await request(app)
        .post('/api/workouts')
        .send(newWorkout)
        .expect(201);

      expect(response.body).to.deep.equal({ id: 1, ...newWorkout });
      expect(mockWorkoutController.create.calledOnce).to.be.true;
    });

    it('should get all workouts', async () => {
      const expectedWorkouts = [
        { id: 1, name: 'Workout 1', date: '2023-10-23' },
        { id: 2, name: 'Workout 2', date: '2023-10-24' }
      ];

      mockWorkoutController.findAll.callsFake((req, res) => {
        res.json(expectedWorkouts);
      });

      const response = await request(app)
        .get('/api/workouts')
        .expect(200);

      expect(response.body).to.deep.equal(expectedWorkouts);
      expect(mockWorkoutController.findAll.calledOnce).to.be.true;
    });

    it('should get a single workout', async () => {
      const expectedWorkout = { id: 1, name: 'Test Workout', date: '2023-10-23' };

      mockWorkoutController.findOne.callsFake((req, res) => {
        res.json(expectedWorkout);
      });

      const response = await request(app)
        .get('/api/workouts/1')
        .expect(200);

      expect(response.body).to.deep.equal(expectedWorkout);
      expect(mockWorkoutController.findOne.calledOnce).to.be.true;
    });

    it('should update a workout', async () => {
      const updatedWorkout = {
        name: 'Updated Workout',
        date: '2023-10-25'
      };

      mockWorkoutController.update.callsFake((req, res) => {
        res.json({ id: 1, ...updatedWorkout });
      });

      const response = await request(app)
        .put('/api/workouts/1')
        .send(updatedWorkout)
        .expect(200);

      expect(response.body).to.deep.equal({ id: 1, ...updatedWorkout });
      expect(mockWorkoutController.update.calledOnce).to.be.true;
    });

    it('should delete a workout', async () => {
      mockWorkoutController.remove.callsFake((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete('/api/workouts/1')
        .expect(204);

      expect(mockWorkoutController.remove.calledOnce).to.be.true;
    });

    it('should get workout sets', async () => {
      const expectedSets = [
        { id: 1, exercise_id: 1, workout_id: 1, reps: 10, weight: 50 },
        { id: 2, exercise_id: 2, workout_id: 1, reps: 12, weight: 45 }
      ];

      mockWorkoutController.getWorkoutSets.callsFake((req, res) => {
        res.json(expectedSets);
      });

      const response = await request(app)
        .get('/api/workouts/1/sets')
        .expect(200);

      expect(response.body).to.deep.equal(expectedSets);
      expect(mockWorkoutController.getWorkoutSets.calledOnce).to.be.true;
    });
  });
});