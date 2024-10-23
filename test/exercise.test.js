import { expect } from 'chai';
import express, { Router } from 'express';
import sinon from 'sinon';
import request from 'supertest';
import * as exercises from '../app/controllers/exercise.controller.js';
import sql from '../app/models/db.js';
import Exercise from '../app/models/exercise.model.js';

describe('Exercise Module Tests', () => {
  // Exercise Model Tests
  describe('Exercise Model', () => {
    let sqlStub;

    beforeEach(() => {
      sqlStub = sinon.stub(sql, 'query');
    });

    afterEach(() => {
      sqlStub.restore();
    });

    it('should create a new exercise', (done) => {
      const newExercise = {
        name: 'Push-ups',
        description: 'Bodyweight exercise for chest and arms',
        type: 'Strength',
        main_muscle: 'Chest',
        equipment: 'None',
        level: 'Beginner',
        rating: '4'
      };

      const expectedResult = { id: 1, ...newExercise };

      sqlStub.yields(null, { insertId: 1 });

      Exercise.create(newExercise, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(expectedResult);
        done();
      });
    });

    it('should find an exercise by id', (done) => {
      const expectedExercise = {
        id: 1,
        name: 'Push-ups',
        description: 'Bodyweight exercise for chest and arms',
        type: 'Strength',
        main_muscle: 'Chest',
        equipment: 'None',
        level: 'Beginner',
        rating: '4'
      };

      sqlStub.yields(null, [expectedExercise]);

      Exercise.findById(1, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(expectedExercise);
        done();
      });
    });

    it('should get all exercises', (done) => {
      const expectedExercises = [
        { id: 1, name: 'Push-ups', type: 'Strength', main_muscle: 'Chest' },
        { id: 2, name: 'Squats', type: 'Strength', main_muscle: 'Legs' }
      ];

      sqlStub.yields(null, expectedExercises);

      Exercise.getAll(null, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(expectedExercises);
        done();
      });
    });

    it('should update an exercise', (done) => {
      const updatedExercise = {
        id: 1,
        name: 'Modified Push-ups',
        description: 'Updated description',
        type: 'Strength',
        main_muscle: 'Chest',
        equipment: 'None',
        level: 'Intermediate',
        rating: '5'
      };

      sqlStub.yields(null, { affectedRows: 1 });

      Exercise.updateById(1, new Exercise(updatedExercise), (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal({ ...updatedExercise, id: 1 });
        done();
      });
    });

    it('should remove an exercise', (done) => {
      const expectedResult = { affectedRows: 1 };
      
      sqlStub.yields(null, expectedResult);

      Exercise.remove(1, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(expectedResult);
        done();
      });
    });

    it('should remove all exercises', (done) => {
      const expectedResult = { affectedRows: 2};
      
      sqlStub.yields(null, expectedResult);

      Exercise.removeAll((err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(expectedResult);
        done();
      });
    });
  });

  // Exercise Controller Tests
  describe('Exercise Controller', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        params: {},
        body: {}
      };
      res = {
        status: sinon.stub().returns({ send: sinon.spy(), json: sinon.spy() }),
        send: sinon.spy(),
        json: sinon.spy()
      };
      next = sinon.spy();
    });

    it('should create a new exercise', (done) => {
      req.body = {
        name: 'Push-ups',
        description: 'Bodyweight exercise for chest and arms',
        type: 'Strength',
        main_muscle: 'Chest',
        equipment: 'None',
        level: 'Beginner',
        rating: '4'
      };

      const expectedExercise = {
        id: 1,
        ...req.body
      };

      const createStub = sinon.stub(Exercise, 'create').callsFake((exercise, callback) => {
        callback(null, expectedExercise);
      });

      exercises.create(req, res);

      sinon.assert.calledOnce(createStub);
      sinon.assert.calledWith(res.send, expectedExercise);

      createStub.restore();
      done();
    });

    it('should return all exercises', (done) => {
      const expectedExercises = [
        { id: 1, name: 'Push-ups', type: 'Strength', main_muscle: 'Chest' },
        { id: 2, name: 'Squats', type: 'Strength', main_muscle: 'Legs' }
      ];
    
      req.query = {}; // Simulate an empty query
    
      const getAllStub = sinon.stub(Exercise, 'getAll').callsFake((name, callback) => {
        callback(null, expectedExercises);
      });
    
      exercises.findAll(req, res);
    
      sinon.assert.calledOnce(getAllStub);
      sinon.assert.calledWith(getAllStub, undefined);
      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, expectedExercises);
    
      getAllStub.restore();
      done();
    });
    
    it('should return exercises with name filter', (done) => {
      const expectedExercises = [
        { id: 1, name: 'Push-ups', type: 'Strength', main_muscle: 'Chest' }
      ];
    
      req.query = { name: 'Push-ups' };
    
      const getAllStub = sinon.stub(Exercise, 'getAll').callsFake((name, callback) => {
        callback(null, expectedExercises);
      });
    
      exercises.findAll(req, res);
    
      sinon.assert.calledOnce(getAllStub);
      sinon.assert.calledWith(getAllStub, 'Push-ups');
      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, expectedExercises);
    
      getAllStub.restore();
      done();
    });

    it('should find one exercise', (done) => {
      const expectedExercise = { id: 1, name: 'Push-ups', type: 'Strength', main_muscle: 'Chest' };
      req.params.id = '1';

      const findByIdStub = sinon.stub(Exercise, 'findById').callsFake((id, callback) => {
        callback(null, expectedExercise);
      });

      exercises.findOne(req, res);

      sinon.assert.calledOnce(findByIdStub);
      sinon.assert.calledWith(res.send, expectedExercise);

      findByIdStub.restore();
      done();
    });

    it('should update an exercise', (done) => {
      req.params.id = '1';
      req.body = {
        name: 'Modified Push-ups',
        description: 'Updated description',
        type: 'Strength',
        main_muscle: 'Chest',
        equipment: 'None',
        level: 'Intermediate',
        rating: '5'
      };

      const updatedExercise = { id: 1, ...req.body };

      const updateByIdStub = sinon.stub(Exercise, 'updateById').callsFake((id, exercise, callback) => {
        callback(null, updatedExercise);
      });

      exercises.update(req, res);

      sinon.assert.calledOnce(updateByIdStub);
      sinon.assert.calledWith(res.send, updatedExercise);

      updateByIdStub.restore();
      done();
    });

    it('should delete an exercise', (done) => {
      req.params.id = '1';

      const removeStub = sinon.stub(Exercise, 'remove').callsFake((id, callback) => {
        callback(null, { message: "Exercise was deleted successfully!" });
      });

      exercises.deleteExercise(req, res);

      sinon.assert.calledOnce(removeStub);
      sinon.assert.calledWith(res.send, { message: "Exercise was deleted successfully!" });

      removeStub.restore();
      done();
    });

    // Add more controller tests here...
  });

  // Exercise Routes Tests
  describe('Exercise Routes', () => {
    let app;
    let mockExerciseController;

    beforeEach(() => {
      app = express();
      mockExerciseController = {
        create: sinon.stub(),
        findAll: sinon.stub(),
        findOne: sinon.stub(),
        update: sinon.stub(),
        deleteExercise: sinon.stub(),
        deleteAll: sinon.stub(),
        getMuscleGroups: sinon.stub(),
        getEquipment: sinon.stub(),
        getLevels: sinon.stub(),
        addSet: sinon.stub(),
        getSets: sinon.stub(),
        getWorkouts: sinon.stub()
      };

      const router = Router();
      router.post('/', mockExerciseController.create);
      router.get('/', mockExerciseController.findAll);
      router.get('/main_muscle', mockExerciseController.getMuscleGroups);
      router.get('/equipment', mockExerciseController.getEquipment);
      router.get('/level', mockExerciseController.getLevels);
      router.get('/:id', mockExerciseController.findOne);
      router.put('/:id', mockExerciseController.update);
      router.delete('/:id', mockExerciseController.deleteExercise);
      router.delete('/', mockExerciseController.deleteAll);
      router.post('/:id/sets', mockExerciseController.addSet);
      router.get('/:id/sets', mockExerciseController.getSets);
      router.get('/:id/workouts', mockExerciseController.getWorkouts);

      app.use('/api/exercises', router);
    });

    it('should create a new exercise', async () => {
      const newExercise = {
        name: 'Push-ups',
        description: 'Bodyweight exercise for chest and arms',
        type: 'Strength',
        main_muscle: 'Chest',
        equipment: 'None',
        level: 'Beginner',
        rating: '4'
      };
    
      mockExerciseController.create.callsFake((req, res) => {
        res.status(201).json({ id: 1, ...newExercise });
      });
    
      const response = await request(app)
        .post('/api/exercises')
        .send(newExercise)
        .expect(201);
    
      expect(response.body).to.deep.equal({ id: 1, ...newExercise });
      expect(mockExerciseController.create.calledOnce).to.be.true;
    });

    it('should get all exercises', async () => {
      const expectedExercises = [
        { id: 1, name: 'Push-ups', type: 'Strength', main_muscle: 'Chest' },
        { id: 2, name: 'Squats', type: 'Strength', main_muscle: 'Legs' }
      ];
    
      mockExerciseController.findAll.callsFake((req, res) => {
        res.json(expectedExercises);
      });
    
      const response = await request(app)
        .get('/api/exercises')
        .expect(200);

      expect(response.body).to.deep.equal(expectedExercises);
      expect(mockExerciseController.findAll.calledOnce).to.be.true;
    });

    it('should get muscle groups', async () => {
      const expectedMuscleGroups = ['Chest', 'Legs', 'Back'];
    
      mockExerciseController.getMuscleGroups.callsFake((req, res) => {
        res.json(expectedMuscleGroups);
      });
    
      const response = await request(app)
        .get('/api/exercises/main_muscle')
        .expect(200);

      expect(response.body).to.deep.equal(expectedMuscleGroups);
      expect(mockExerciseController.getMuscleGroups.calledOnce).to.be.true;
    });

    it('should get equipment', async () => {
      const expectedEquipment = ['None', 'Dumbbells', 'Barbell'];
    
      mockExerciseController.getEquipment.callsFake((req, res) => {
        res.json(expectedEquipment);
      });
    
      const response = await request(app)
        .get('/api/exercises/equipment')
        .expect(200);

      expect(response.body).to.deep.equal(expectedEquipment);
      expect(mockExerciseController.getEquipment.calledOnce).to.be.true;
    });

    it('should get exercise levels', async () => {
      const expectedLevels = ['Beginner', 'Intermediate', 'Advanced'];
    
      mockExerciseController.getLevels.callsFake((req, res) => {
        res.json(expectedLevels);
      });
    
      const response = await request(app)
        .get('/api/exercises/level')
        .expect(200);
    
      expect(response.body).to.deep.equal(expectedLevels);
      expect(mockExerciseController.getLevels.calledOnce).to.be.true;
    });

    it('should add a set to an exercise', async () => {
      const exerciseId = 1;
      const newSet = {
        reps: 10,
        weight: 50,
        date: '2024-10-23'
      };
    
      mockExerciseController.addSet.callsFake((req, res) => {
        res.status(201).json({ id: 1, exercise_id: exerciseId, ...newSet });
      });
    
      const response = await request(app)
        .post(`/api/exercises/${exerciseId}/sets`)
        .send(newSet)
        .expect(201);
    
      expect(response.body).to.deep.equal({ id: 1, exercise_id: exerciseId, ...newSet });
      expect(mockExerciseController.addSet.calledOnce).to.be.true;
    });

    it('should get sets for an exercise', async () => {
      const exerciseId = 1;
      const expectedSets = [
        { id: 1, exercise_id: exerciseId, reps: 10, weight: 50, date: '2024-10-23' },
        { id: 2, exercise_id: exerciseId, reps: 12, weight: 45, date: '2024-10-24' }
      ];
    
      mockExerciseController.getSets.callsFake((req, res) => {
        res.json(expectedSets);
      });
    
      const response = await request(app)
        .get(`/api/exercises/${exerciseId}/sets`)
        .expect(200);
    
      expect(response.body).to.deep.equal(expectedSets);
      expect(mockExerciseController.getSets.calledOnce).to.be.true;
    });

    it('should get workouts for an exercise', async () => {
      const exerciseId = 1;
      const expectedWorkouts = [
        { id: 1, name: 'Chest Day', date: '2024-10-23' },
        { id: 2, name: 'Full Body', date: '2024-10-25' }
      ];
    
      mockExerciseController.getWorkouts.callsFake((req, res) => {
        res.json(expectedWorkouts);
      });
    
      const response = await request(app)
        .get(`/api/exercises/${exerciseId}/workouts`)
        .expect(200);
    
      expect(response.body).to.deep.equal(expectedWorkouts);
      expect(mockExerciseController.getWorkouts.calledOnce).to.be.true;
    });
    // Add more route tests for other endpoints...
  });
});