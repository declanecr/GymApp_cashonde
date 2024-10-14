/**
 * Exercise Model Test Suite
 * 
 * This file contains unit tests for the Exercise model, specifically testing
 * methods that retrieve unique values from the database.
 * 
 * The tests use Mocha as the test framework, Chai for assertions, and Sinon
 * for stubbing the database queries.
 */

import { expect } from 'chai';
import sinon from 'sinon';
import sql from "../app/models/db.js";
import Exercise from "../app/models/exercise.model.js";

describe('Exercise Model', () => {
  describe('getUniqueMuscleGroups', () => {
    it('should return unique muscle groups', (done) => {
      // Mock the database result
      const mockResult = [{ main_muscle: 'Chest' }, { main_muscle: 'Biceps' }];
      
      // Stub the sql.query method to avoid actual database calls
      sinon.stub(sql, 'query').callsFake((query, callback) => {
        callback(null, mockResult);
      });

      // Test the getUniqueMuscleGroups method
      Exercise.getUniqueMuscleGroups((err, result) => {
        // Assert that there's no error
        expect(err).to.be.null;
        // Assert that the result matches the expected output
        expect(result).to.deep.equal(['Chest', 'Biceps']);
        done();
      });

      // Restore the stubbed method to its original state
      sql.query.restore();
    });
  });

  describe('getUniqueEquipment', () => {
    it('should return unique equipment', (done) => {
      // Mock the database result
      const mockResult = [{ equipment: 'Barbell' }, { equipment: 'Dumbbell' }];
      
      // Stub the sql.query method
      sinon.stub(sql, 'query').callsFake((query, callback) => {
        callback(null, mockResult);
      });

      // Test the getUniqueEquipment method
      Exercise.getUniqueEquipment((err, result) => {
        // Assert no error and correct result
        expect(err).to.be.null;
        expect(result).to.deep.equal(['Barbell', 'Dumbbell']);
        done();
      });

      // Restore the stub
      sql.query.restore();
    });
  });

  describe('getUniqueLevels', () => {
    it('should return unique levels', (done) => {
      // Mock the database result
      const mockResult = [{ level: 'Beginner' }, { level: 'Intermediate' }];
      
      // Stub the sql.query method
      sinon.stub(sql, 'query').callsFake((query, callback) => {
        callback(null, mockResult);
      });

      // Test the getUniqueLevels method
      Exercise.getUniqueLevels((err, result) => {
        // Assert no error and correct result
        expect(err).to.be.null;
        expect(result).to.deep.equal(['Beginner', 'Intermediate']);
        done();
      });

      // Restore the stub
      sql.query.restore();
    });
  });
});