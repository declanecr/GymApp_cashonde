import { expect } from 'chai';
import express from 'express';
import sinon from 'sinon';
import request from 'supertest';
import * as SetController from '../app/controllers/set.controller.js';
import sql from '../app/models/db.js';
import Set from '../app/models/set.model.js';

describe('Set Module Tests', () => {
  // Set Model Tests
    describe('Set Model', () => {
        let sqlStub;

        beforeEach(() => {
        sqlStub = sinon.stub(sql, 'query');
        });

        afterEach(() => {
        sqlStub.restore();
        });

        it('should create a new set', (done) => {
        const newSet = {
            exercise_id: 1,
            workout_id: 1,
            date: '2023-10-22',
            reps: 10,
            weight: 50
        };

        const expectedResult = { id: 1, ...newSet };

        sqlStub.yields(null, { insertId: 1 });

        Set.create(newSet, (err, result) => {
            expect(err).to.be.null;
            expect(result).to.deep.equal(expectedResult);
            done();
        });
        });

        it('should find a set by id', (done) => {
        const expectedSet = {
            id: 1,
            exercise_id: 1,
            workout_id: 1,
            date: '2023-10-22',
            reps: 10,
            weight: 50
        };

        sqlStub.yields(null, [expectedSet]);

        Set.findById(1, 1, (err, result) => {
            expect(err).to.be.null;
            expect(result).to.deep.equal(expectedSet);
            done();
        });
        });

        it('should find sets by workout id', (done) => {
            const expectedSets = [
                { id: 1, exercise_id: 1, workout_id: 1, reps: 10, weight: 50 },
                { id: 2, exercise_id: 2, workout_id: 1, reps: 12, weight: 45 }
                ];
            
                sqlStub.yields(null, expectedSets);
            
                Set.findByWorkoutId(1, (err, result) => {
                expect(err).to.be.null;
                expect(result).to.deep.equal(expectedSets);
                done();
                });
            });
            
            it('should get all sets', (done) => {
                const expectedSets = [
                { id: 1, exercise_id: 1, workout_id: 1, reps: 10, weight: 50 },
                { id: 2, exercise_id: 2, workout_id: 2, reps: 12, weight: 45 }
                ];
            
                sqlStub.yields(null, expectedSets);
            
                Set.getAll((err, result) => {
                expect(err).to.be.null;
                expect(result).to.deep.equal(expectedSets);
                done();
                });
            });
            
            it('should remove all sets', (done) => {
                sqlStub.yields(null, { affectedRows: 2 });
            
                Set.removeAll((err, result) => {
                expect(err).to.be.null;
                expect(result.message).to.equal('2 Sets were deleted successfully!');
                done();
                });
            });

        // Add more model tests here...
    });

    // Set Controller Tests
    describe('Set Controller', () => {
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

        it('should create a new set', (done) => {
        req.params.id = '1';
        req.body = {
            workout_id: 1,
            date: '2023-10-22',
            reps: 10,
            weight: 50
        };

        const expectedSet = {
            id: 1,
            exercise_id: 1,
            ...req.body
        };

        const createStub = sinon.stub(Set, 'create').callsFake((set, callback) => {
            callback(null, { id: 1, ...set});
        });

        SetController.create(req, res);

        sinon.assert.calledOnce(createStub);
        sinon.assert.calledWith(res.status, 201);
        sinon.assert.calledWith(res.status().send, { id: 1, exercise_id: 1, ...req.body });

        createStub.restore();
        done();
        });

        it('should return all sets for an exercise', (done) => {
        req.params.id = '1';
        const expectedSets = [
            { id: 1, exercise_id: 1, workout_id: 1, reps: 10, weight: 50 },
            { id: 2, exercise_id: 1, workout_id: 1, reps: 12, weight: 45 }
        ];

        const findByExerciseIdStub = sinon.stub(Set, 'findByExerciseId').callsFake((id, callback) => {
            callback(null, expectedSets);
        });

        SetController.findAll(req, res);

        sinon.assert.calledOnce(findByExerciseIdStub);
        sinon.assert.calledWith(res.send, expectedSets);

        findByExerciseIdStub.restore();
        done();
        });

        // Add more controller tests here...
    });

     // Set Routes Tests
    describe('Set Routes', () => {
        let app;
        let mockSetController;

        beforeEach(() => {
        app = express();
        mockSetController = {
            create: sinon.stub(),
            findAll: sinon.stub(),
            findOne: sinon.stub(),
            update: sinon.stub(),
            deleteSet: sinon.stub(),
            deleteAll: sinon.stub()
        };

        const router = express.Router();
        router.post('/:id/sets', mockSetController.create);
        router.get('/:id/sets', mockSetController.findAll);
        router.get('/:id/sets/:setId', mockSetController.findOne);
        router.put('/:id/sets/:setId', mockSetController.update);
        router.delete('/:id/sets/:setId', mockSetController.deleteSet);
        router.delete('/:id/sets', mockSetController.deleteAll);

        app.use('/api/exercises', router);
        });

        it('should create a new set', async () => {
        const newSet = {
            workout_id: 1,
            date: '2023-10-22',
            reps: 10,
            weight: 50
        };
        
        mockSetController.create.callsFake((req, res) => {
            res.status(201).json({ id: 1, exercise_id: req.params.id, ...newSet });
        });
        
        const response = await request(app)
            .post('/api/exercises/1/sets')
            .send(newSet)
            .expect(201);
        
        expect(response.body).to.deep.equal({ id: 1, exercise_id: '1', ...newSet });
        expect(mockSetController.create.calledOnce).to.be.true;
        });

        it('should get all sets for an exercise', async () => {
        const expectedSets = [
            { id: 1, exercise_id: '1', workout_id: 1, date: '2023-10-22', reps: 10, weight: 50 },
            { id: 2, exercise_id: '1', workout_id: 1, date: '2023-10-23', reps: 12, weight: 55 }
        ];
        
        mockSetController.findAll.callsFake((req, res) => {
            res.json(expectedSets);
        });
        
        const response = await request(app)
            .get('/api/exercises/1/sets')
            .expect(200);

        expect(response.body).to.deep.equal(expectedSets);
        expect(mockSetController.findAll.calledOnce).to.be.true;
        });

        it('should update an existing set', async () => {
        const updatedSet = {
            reps: 15,
            weight: 60
        };

        mockSetController.update.callsFake((req, res) => {
            res.json({ id: req.params.setId, exercise_id: req.params.id, ...updatedSet });
        });

        const response = await request(app)
            .put('/api/exercises/1/sets/1')
            .send(updatedSet)
            .expect(200);

        expect(response.body).to.deep.equal({ id: '1', exercise_id: '1', ...updatedSet });
        expect(mockSetController.update.calledOnce).to.be.true;
        });

        it('should delete a set', async () => {
        mockSetController.deleteSet.callsFake((req, res) => {
            res.status(204).send();
        });

        await request(app)
            .delete('/api/exercises/1/sets/1')
            .expect(204);

        expect(mockSetController.deleteSet.calledOnce).to.be.true;
        });

        it('should delete all sets for an exercise', async () => {
        mockSetController.deleteAll.callsFake((req, res) => {
            res.status(204).send();
        });

        await request(app)
            .delete('/api/exercises/1/sets')
            .expect(204);

        expect(mockSetController.deleteAll.calledOnce).to.be.true;
        });
    });
});