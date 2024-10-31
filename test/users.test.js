import { expect } from 'chai';
import express from 'express';
import sinon from 'sinon';
import request from 'supertest';
import * as UserController from '../app/controllers/users.controller.js';
import sql from '../app/models/db.js';
import User from '../app/models/users.model.js';

describe('User Module Tests', () => {
    // User Model Tests
    describe('User Model', () => {
        let sqlStub;

        beforeEach(() => {
        sqlStub = sinon.stub(sql, 'query');
        });

        afterEach(() => {
        sqlStub.restore();
        });

        it('should create a new user', (done) => {
        const newUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        const expectedResult = { id: 1, ...newUser };

        sqlStub.yields(null, { insertId: 1 });

        User.create(newUser, (err, result) => {
            expect(err).to.be.null;
            expect(result).to.deep.equal(expectedResult);
            done();
        });
        });

        it('should find a user by id', (done) => {
        const expectedUser = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        sqlStub.yields(null, [expectedUser]);

        User.findById(1, (err, result) => {
            expect(err).to.be.null;
            expect(result).to.deep.equal(expectedUser);
            done();
        });
        });

        // Add more model tests here...
    });

    // User Controller Tests
    describe('User Controller', () => {
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

        it('should create a new user', (done) => {
        req.body = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        const expectedUser = {
            id: 1,
            ...req.body
        };

        const createStub = sinon.stub(User, 'create').callsFake((user, callback) => {
            callback(null, expectedUser);
        });

        UserController.create(req, res);

        sinon.assert.calledOnce(createStub);
        sinon.assert.calledWith(res.send, expectedUser);

        createStub.restore();
        done();
        });

        // Add more controller tests here...
    });

    // User Routes Tests
    describe('User Routes', () => {
        let app;
        let mockUserController;

        beforeEach(() => {
        app = express();
        mockUserController = {
            create: sinon.stub(),
            findAll: sinon.stub(),
            findOne: sinon.stub(),
            update: sinon.stub(),
            delete: sinon.stub()
        };

        const router = express.Router();
        router.post('/', mockUserController.create);
        router.get('/', mockUserController.findAll);
        router.get('/:id', mockUserController.findOne);
        router.put('/:id', mockUserController.update);
        router.delete('/:id', mockUserController.delete);

        app.use('/api/users', router);
        });

        it('should create a new user', async () => {
        const newUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };
        
        mockUserController.create.callsFake((req, res) => {
            res.status(201).json({ id: 1, ...newUser });
        });
        
        const response = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201);
        
        expect(response.body).to.deep.equal({ id: 1, ...newUser });
        expect(mockUserController.create.calledOnce).to.be.true;
        });

        // Add more route tests here...
    });
});