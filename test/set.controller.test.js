import { expect } from 'chai';
import sinon from 'sinon';
import * as setController from '../app/controllers/set.controller.js';
import Set from '../app/models/set.model.js';

describe('Set Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: sinon.stub().returns({ send: sinon.spy() }),
      send: sinon.spy(),
      json: sinon.spy()
    };
    next = sinon.spy();
  });

  describe('create', () => {
    it('should create a new set', () => {
      req.body = {
        workout_id: 1,
        date: '2023-10-22',
        reps: 10,
        weight: 50
      };
      req.params.id = '1';

      const expectedSet = { id: 1, ...req.body, exercise_id: 1 }; 

      const createStub = sinon.stub(Set, 'create').yields(null, expectedSet);

      setController.create(req, res);

      console.log("res.status called with:", res.status.args);
      console.log("res.send called with:", res.status().send.args);

      expect(createStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.status().send.calledWith(expectedSet)).to.be.true;

      createStub.restore();
    });

    it('should return 400 if request body is empty', () => {
      setController.create(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.status().send.calledWith({ message: "Content can not be empty!" })).to.be.true;
    });
  });

  describe('findAll', () => {
    it('should return all sets for an exercise', () => {
      req.params.id = '1';
      const expectedSets = [
        { id: 1, exercise_id: '1', workout_id: 1, date: '2023-10-22', reps: 10, weight: 50 },
        { id: 2, exercise_id: '1', workout_id: 1, date: '2023-10-23', reps: 12, weight: 55 }
      ];

      const findByExerciseIdStub = sinon.stub(Set, 'findByExerciseId').yields(null, expectedSets);
      setController.findAll(req, res);

      expect(findByExerciseIdStub.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith(expectedSets)).to.be.true;

      findByExerciseIdStub.restore();
    });
  });

  // Add more tests for other controller methods...
});