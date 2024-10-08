import sql from "./db.js";

// constructor
const Exercise = function(exercise) {
  this.name = exercise.name;
  this.description = exercise.description;
  this.type = exercise.type;
  this.main_muscle = exercise.main_muscle;
  this.equipment = exercise.equipment;
  this.level = exercise.level;
  this.rating = exercise.rating;
};

Exercise.create = (newExercise, result) => {
  sql.query("INSERT INTO exercises SET ?", newExercise, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created exercise: ", { id: res.insertId, ...newExercise });
    result(null, { id: res.insertId, ...newExercise });
  });
};

Exercise.findById = (id, result) => {
  sql.query(`SELECT * FROM exercises WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found exercise: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Exercise with the id
    result({ kind: "not_found" }, null);
  });
};

Exercise.getAll = (name, result) => {
  let query = "SELECT * FROM exercises";

  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    //prints all the exercises that it obtains
    //console.log("exercises: ", res);
    result(null, res);
  });
};

Exercise.updateById = (id, exercise, result) => {
  sql.query(
    "UPDATE exercises SET name = ?, description = ?, type = ?, main_muscle = ?, equipment = ?, level = ?, rating = ? WHERE id = ?",
    [exercise.name, exercise.description, exercise.type, exercise.main_muscle, exercise.equipment, exercise.level, exercise.rating, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Exercise with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated exercise: ", { id: id, ...exercise });
      result(null, { id: id, ...exercise });
    }
  );
};

Exercise.remove = (id, result) => {
  sql.query("DELETE FROM exercises WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Exercise with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted exercise with id: ", id);
    result(null, res);
  });
};

Exercise.removeAll = result => {
  sql.query("DELETE FROM exercises", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} exercises`);
    result(null, res);
  });
};

//THESE ARE THE PROBLEMS
Exercise.getUniqueMuscleGroups = result => {
  sql.query("SELECT DISTINCT main_muscle FROM exercises", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("muscle groups: ", res);
    result(null, res.map(row => row.main_muscle));
  });
};

Exercise.getUniqueEquipment = result => {
  sql.query("SELECT DISTINCT equipment FROM exercises", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("equipment found: ", res.map(row => row.equipment));
    result(null, res.map(row => row.equipment));
  });
};

Exercise.getUniqueLevels = result => {
  sql.query("SELECT DISTINCT level FROM exercises", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("levels found: ", res.map(row => row.level));
    result(null, res.map(row => row.level));
  });
};


export default Exercise