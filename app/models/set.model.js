import sql from "./db.js";

// constructor
class Set {
  constructor(set) {
    this.exercise_id = set.exercise_id;
    this.workout_id=set.workout_id;
    this.date = set.date; 
    this.reps = set.reps;
    this.weight = set.weight;
  }

  static create(newSet, result) {
    console.log("Creating new set with exercise_id:", newSet.exercise_id);
    sql.query("INSERT INTO sets SET ?", newSet, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      const createdSet={id:res.insertId, ...newSet };
      console.log("created set: ", createdSet);
      result(null, createdSet);
    });
  }

  static findById(exerciseId, setId, result) {
    sql.query(`SELECT * FROM sets WHERE exercise_id = ? AND id = ?`, [exerciseId, setId], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("found set: ", res[0]);
        result(null, res[0]);
        return;
      }
      // not found Set with the id
      result({ kind: "not_found" }, null);
    });
  }

  static findByWorkoutId(workoutId, result) {
    sql.query(`SELECT * FROM sets WHERE workout_id = ?`, [workoutId], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("found sets: ", res);
        result(null, res);
        return;
      }
      result({ kind: "not_found" }, null);
    });
  }

  static getAll(result) {
    sql.query("SELECT * FROM sets", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("sets: ", res);
      result(null, res);
    });
  }

  static updateById(id, set, result) {
    sql.query(
      "UPDATE sets SET exercise_id = ?, date = ?, reps = ?, weight = ? WHERE id = ?",
      [set.exercise_id, set.date, set.reps, set.weight, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found Set with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated set: ", { id: id, ...set });
        result(null, { id: id, ...set });
      }
    );
  }

  static remove(id, result) {
    sql.query("DELETE FROM sets WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.affectedRows == 0) {
        // Set with the id not found
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted set with id: ", id);
      result(null, { message: "Set was deleted successfully!" });
    });
  }

  static removeAll(result) {
    sql.query("DELETE FROM sets", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log(`${res.affectedRows} Sets were deleted successfully!`);
      result(null, { message: `${res.affectedRows} Sets were deleted successfully!` });
    });
  }

  static findByExerciseId(exerciseId, result) {
  sql.query(`SELECT * FROM sets WHERE exercise_id = ?`, [exerciseId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found sets: ", res);
      result(null, res);
      return;
    }

    // not found Sets with the exercise id
    result({ kind: "not_found" }, null);
  });
}
}

export default Set;