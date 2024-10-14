/**
 * Workout Model Test Suite
 * 
 * This file contains unit tests for the Workout model, testing
 * CRUD operations and any other specific methods.
 * 
 * The tests use Mocha as the test framework, Chai for assertions, and Sinon
 * for stubbing the database queries.
 */

import { expect } from 'chai';
import sinon from 'sinon';
import sql from "../app/models/db.js";
import Workout from "../app/models/workout.model.js";


describe('Workout Model', () => {
    afterEach(()=>{
        sinon.restore();
    });
  describe('create', () => {
    it('should create a new workout', (done) => {
      const newWorkout = {
        name: "Monday Strength",
        date: "2024-10-14",
        duration: 60,
        user_id: 1
      };
      
      const mockResult = { id: 1, ...newWorkout };
      
      sinon.stub(sql, 'query').callsFake((query, workout, callback) => {
        callback(null, { insertId: 1 });
      });

      Workout.create(newWorkout, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(mockResult);
        done();
      });

      sql.query.restore();
    });
  });

  describe('findById', () => {
    it('should find a workout by id', (done) => {
      const mockWorkout = {
        id: 1,
        name: "Monday Strength",
        date: "2024-10-14",
        duration: 60,
        user_id: 1
      };
      
      sinon.stub(sql, 'query').callsFake((query, callback) => {
        callback(null, [mockWorkout]);
      });

      Workout.findById(1, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(mockWorkout);
        done();
      });

      sql.query.restore();
    });
  });

  describe('getAll', () => {
    it('should return all workouts for a user', (done) => {
      const mockWorkouts = [
        { id: 1, name: "Monday Strength", date: "2024-10-14", duration: 60, user_id: 1 },
        { id: 2, name: "Wednesday Cardio", date: "2024-10-16", duration: 45, user_id: 1 }
      ];
      
      sinon.stub(sql, 'query').callsFake((query, userId, callback) => {
        // Ensure callback is always the last argument
        if (typeof userId === 'function') {
            callback = userId;
        }
        callback(null, mockWorkouts);
      });

      Workout.getAll((err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal(mockWorkouts);
        done();
      });

      sinon.restore();
    });
  });

  describe('updateById', () => {
    it('should update a workout', (done) => {
      const updatedWorkout = {
        name: "Updated Monday Strength",
        date: "2024-10-14",
        duration: 75
      };
      
      sinon.stub(sql, 'query').callsFake((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      Workout.updateById(1, updatedWorkout, (err, result) => {
        expect(err).to.be.null;
        expect(result).to.deep.equal({ id: 1, ...updatedWorkout });
        done();
      });

      sql.query.restore();
    });
  });

  describe('remove', () => {
    it('should remove a workout', (done) => {
      sinon.stub(sql, 'query').callsFake((query, id, callback) => {
        callback(null, { affectedRows: 1 });
      });

      Workout.remove(1, (err, result) => {
        expect(err).to.be.null;
        expect(result.affectedRows).to.equal(1);
        done();
      });

      sql.query.restore();
    });
  });
});