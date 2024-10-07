import { expect } from 'chai';
import sinon from 'sinon';
import sql from "../app/models/db.js";
import Exercise from "../app/models/exercise.model.js";


describe('Exercise Model', () => {
  describe('getUniqueMuscleGroups', () => {
    it('should return unique muscle groups', (done) => {
      const mockResult = [{ main_muscle: 'Chest' }, { main_muscle: 'Biceps' }];
      sinon.stub(sql, 'query').callsFake((query, callback) => {
        callback(null, mockResult);
      });

      Exercise.getUniqueMuscleGroups((err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(['Chest', 'Biceps']);
        done();
      });

      sql.query.restore();
    });
  });

  describe('getUniqueEquipment', () => {
    it('should return unique equipment', (done) => {
      const mockResult = [{ equipment: 'Barbell' }, { equipment: 'Dumbbell' }];
      sinon.stub(sql, 'query').callsFake((query, callback) => {
        callback(null, mockResult);
      });

      Exercise.getUniqueEquipment((err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(['Barbell', 'Dumbbell']);
        done();
      });

      sql.query.restore();
    });
  });

  describe('getUniqueLevels', () => {
    it('should return unique levels', (done) => {
      const mockResult = [{ level: 'Beginner' }, { level: 'Intermediate' }];
      sinon.stub(sql, 'query').callsFake((query, callback) => {
        callback(null, mockResult);
      });

      Exercise.getUniqueLevels((err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(['Beginner', 'Intermediate']);
        done();
      });

      sql.query.restore();
    });
  });
});