import { expect } from 'chai';
import sinon from 'sinon';
import sql from '../app/models/db.js';
import Set from '../app/models/set.model.js';

describe('Set Model', () => {
  let sqlStub;

  beforeEach(() => {
    sqlStub = sinon.stub(sql, 'query');
  });

  afterEach(() => {
    sqlStub.restore();
  });

  describe('create', () => {
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

    it('should return error if query fails', (done) => {
      const newSet = {
        exercise_id: 1,
        workout_id: 1,
        date: '2023-10-22',
        reps: 10,
        weight: 50
      };

      sqlStub.yields(new Error('Database error'), null);

      Set.create(newSet, (err, result) => {
        expect(err).to.be.an('error');
        expect(result).to.be.null;
        done();
      });
    });
  });

  describe('findById', () => {
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

    it('should return not found error if set does not exist', (done) => {
      sqlStub.yields(null, []);

      Set.findById(1, 1, (err, result) => {
        expect(err).to.deep.equal({ kind: "not_found" });
        expect(result).to.be.null;
        done();
      });
    });
  });

  // Add more tests for other methods...
});