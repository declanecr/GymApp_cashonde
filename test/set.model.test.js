import { expect } from 'chai';
import sinon from 'sinon';
import sql from "../app/models/db.js";
import Set from '../app/models/set.model.js';

describe('Set Model', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('create', () => {
    it('should create a new set', (done) => {
      const newSet = {
        exercise_id: 1,
        date: '2024-10-14',
        reps: 10,
        weight: 50
      };

      const queryStub = sinon.stub(sql, 'query').callsFake((query, values, callback) => {
        callback(null, { insertId: 1 });
      });

      Set.create(newSet, (err, data) => {
        expect(err).to.be.null;
        expect(data).to.deep.equal({ id: 1, ...newSet });
        expect(queryStub.calledOnce).to.be.true;
        done();
      });
    });

    it('should return error on database failure', (done) => {
      const newSet = {
        exercise_id: 1,
        date: '2024-10-14',
        reps: 10,
        weight: 50
      };

      sinon.stub(sql, 'query').callsFake((query, values, callback) => {
        callback(new Error('Database error'), null);
      });

      Set.create(newSet, (err, data) => {
        expect(err).to.be.an('error');
        expect(data).to.be.null;
        done();
      });
    });
  });

  describe('findById', () => {
    it('should find a set by id', (done) => {
      const setId = 1;
      const expectedSet = {
        id: 1,
        exercise_id: 1,
        date: '2024-10-14',
        reps: 10,
        weight: 50
      };

      sinon.stub(sql, 'query').callsFake((query, callback) => {
        callback(null, [expectedSet]);
      });

      Set.findById(setId, (err, data) => {
        expect(err).to.be.null;
        expect(data).to.deep.equal(expectedSet);
        done();
      });
    });

    it('should return not found error when set does not exist', (done) => {
      const setId = 999;

      sinon.stub(sql, 'query').callsFake((query, callback) => {
        callback(null, []);
      });

      Set.findById(setId, (err, data) => {
        expect(err).to.deep.equal({ kind: "not_found" });
        expect(data).to.be.null;
        done();
      });
    });
  });

  describe('getAll', () => {
    it('should get all sets', (done) => {
      const expectedSets = [
        { id: 1, exercise_id: 1, date: '2024-10-14', reps: 10, weight: 50 },
        { id: 2, exercise_id: 2, date: '2024-10-14', reps: 8, weight: 60 }
      ];

      sinon.stub(sql, 'query').callsFake((query, callback) => {
        callback(null, expectedSets);
      });

      Set.getAll((err, data) => {
        expect(err).to.be.null;
        expect(data).to.deep.equal(expectedSets);
        done();
      });
    });

    it('should return error on database failure', (done) => {
        const dbError = new Error('Database error');
        sinon.stub(sql, 'query').callsFake((query, callback) => {
          callback(dbError, null);
        });
      
        Set.getAll((err, result) => {
          expect(err).to.be.an('error');
          expect(err.message).to.equal('Database error');
          expect(result).to.be.null;
          done();
        });
      
        sinon.restore();
      });
  });

  describe('updateById', () => {
    it('should update a set by id', (done) => {
      const setId = 1;
      const updatedSet = {
        exercise_id: 1,
        date: '2024-10-15',
        reps: 12,
        weight: 55
      };

      sinon.stub(sql, 'query').callsFake((query, values, callback) => {
        callback(null, { affectedRows: 1 });
      });

      Set.updateById(setId, new Set(updatedSet), (err, data) => {
        expect(err).to.be.null;
        expect(data).to.deep.equal({ id: setId, ...updatedSet });
        done();
      });
    });

    it('should return not found error when set does not exist', (done) => {
      const setId = 999;
      const updatedSet = {
        exercise_id: 1,
        date: '2024-10-15',
        reps: 12,
        weight: 55
      };

      sinon.stub(sql, 'query').callsFake((query, values, callback) => {
        callback(null, { affectedRows: 0 });
      });

      Set.updateById(setId, new Set(updatedSet), (err, data) => {
        expect(err).to.deep.equal({ kind: "not_found" });
        expect(data).to.be.null;
        done();
      });
    });
  });

  describe('remove', () => {
    it('should remove a set by id', (done) => {
        const setId = 1;
        sinon.stub(sql, 'query').callsFake((query, params, callback) => {
          callback(null, { affectedRows: 1 });
        });
      
        Set.remove(setId, (err, result) => {
          expect(err).to.be.null;
          expect(result).to.deep.equal({ message: "Set was deleted successfully!" });
          done();
        });
      
        sinon.restore();
      });

      it('should return not found error when set does not exist', (done) => {
        const setId = 999; // Non-existent ID
        sinon.stub(sql, 'query').callsFake((query, params, callback) => {
          // Ensure the callback is called with the correct arguments
          callback(null, { affectedRows: 0 });
        });
      
        Set.remove(setId, (err, result) => {
          expect(err).to.deep.equal({ kind: "not_found" });
          expect(result).to.be.null;
          sinon.restore(); // Restore the stub
          done();
        });
      });
  });

  describe('removeAll', () => {
    it('should remove all sets', (done) => {
        const affectedRows = 5;
        sinon.stub(sql, 'query').callsFake((query, callback) => {
          callback(null, { affectedRows: affectedRows });
        });
      
        Set.removeAll((err, result) => {
          expect(err).to.be.null;
          expect(result).to.deep.equal({ message: `${affectedRows} Sets were deleted successfully!` });
          sinon.restore();
          done();
        });
      });

    it('should return error on database failure', (done) => {
      sinon.stub(sql, 'query').callsFake((query, callback) => {
        callback(new Error('Database error'), null);
      });

      Set.removeAll((err, data) => {
        expect(err).to.be.an('error');
        expect(data).to.be.null;
        done();
      });
    });
  });
});