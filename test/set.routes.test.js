import { expect } from 'chai';
import express from 'express';
import sinon from 'sinon';
import request from 'supertest';

describe('Set Routes', () => {
    let app;
    let mockSetController;

    beforeEach(async () => {
        app = express();
        mockSetController = {
            create: sinon.stub(),
            findAll: sinon.stub(),
            findOne: sinon.stub(),
            update: sinon.stub(),
            deleteSet: sinon.stub(),
            deleteAll: sinon.stub()
        };

        const setRoutes = (await import('../app/routes/set.routes.js')).default;
        setRoutes(app, mockSetController);
    });

    describe('POST /api/exercises/:id/sets', () => {
        it('should create a new set', async () => {
            const newSet = {
                workout_id: 1,
                date: '2023-10-22',
                reps: 10,
                weight: 50
            };
        
            mockSetController.create.callsFake((req, res) => {
                res.status(201).json({ id: 1, ...newSet, exercise_id: req.params.id });
            });
        
            const response = await request(app)
                .post('/api/exercises/1/sets')
                .send(newSet)
                .expect(201);
        
            console.log('Response body:', response.body);
            console.log('Response headers:', response.headers);
        
            expect(response.body).to.deep.equal({ id: 1, ...newSet, exercise_id: '1' });
            expect(mockSetController.create.calledOnce).to.be.true;
            });
        });

    describe('GET /api/exercises/:id/sets', () => {
        it('should get all sets for an exercise', async () => {
            const expectedSets = [
                { id: 1, exercise_id: '1', workout_id: 1, date: '2023-10-22', reps: 10, weight: 50 },
                { id: 2, exercise_id: '1', workout_id: 1, date: '2023-10-23', reps: 12, weight: 55 }
            ];
        
            mockSetController.findAll.callsFake((req, res) => {
                res.json(expectedSets);
            });
        
            request(app)
                .get('/api/exercises/1/sets')
                .expect(200)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.deep.equal(expectedSets);
                expect(mockSetController.findAll.calledOnce).to.be.true;
                });
            });
        });

  // Add more tests for other routes...
});