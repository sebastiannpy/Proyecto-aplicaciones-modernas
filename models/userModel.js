import db from "../database/connection.js";


// obtener todos los usuarios
export async function getAllUsers() {

  return new Promise((resolve, reject) => {

    const query = "SELECT * FROM users";

    db.query(query, (err, results) => {

      if (err) reject(err);
      else resolve(results);

    });

  });

}


// buscar usuario por email
export async function findUserByEmail(email) {

  return new Promise((resolve, reject) => {

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], (err, results) => {

      if (err) reject(err);
      else resolve(results[0] || null);

    });

  });

}


// crear usuario
export async function createUser({ name, email, passwordHash }) {

  return new Promise((resolve, reject) => {

    const query = `
      INSERT INTO users (name, email, passwordHash)
      VALUES (?, ?, ?)
    `;

    db.query(query, [name, email, passwordHash], (err, result) => {

      if (err) reject(err);
      else {

        resolve({
          id: result.insertId,
          name,
          email,
          passwordHash
        });

      }

    });

  });

}