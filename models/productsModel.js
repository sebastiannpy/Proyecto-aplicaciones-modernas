import db from "../database/connection.js";

/*
FILTRAR PRODUCTOS
- por category
- por price
- por nombre (busqueda parcial)
ORDENAR
- por price
- por nombre
*/

export async function getAllProducts({ category, minPrice, maxPrice, name, sortBy, order } = {}) {

  return new Promise((resolve, reject) => {

    let query = "SELECT * FROM productos WHERE 1=1";
    const params = [];

    // filtro por categoria
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    // precio minimo
    if (minPrice) {
      query += " AND price >= ?";
      params.push(minPrice);
    }

    // precio maximo
    if (maxPrice) {
      query += " AND price <= ?";
      params.push(maxPrice);
    }

    // busqueda parcial por nombre
    if (name) {
      query += " AND nombre LIKE ?";
      params.push(`%${name}%`);
    }

    // ordenar
    if (sortBy) {

      const validSort = ["price", "nombre"];
      const validOrder = ["ASC", "DESC"];

      if (validSort.includes(sortBy)) {

        const direction = validOrder.includes(order?.toUpperCase())
          ? order.toUpperCase()
          : "ASC";

        query += ` ORDER BY ${sortBy} ${direction}`;
      }
    }

    db.query(query, params, (err, results) => {

      if (err) {
        reject(err);
      } else {
        resolve(results);
      }

    });

  });

}


// CREAR PRODUCTO
export async function createProduct({ name, price, category }) {

  return new Promise((resolve, reject) => {

    const query = `
      INSERT INTO productos (nombre, price, category)
      VALUES (?, ?, ?)
    `;

    db.query(query, [name, price, category], (err, result) => {

      if (err) {
        reject(err);
      } else {

        resolve({
          id: result.insertId,
          name,
          price,
          category
        });

      }

    });

  });

}


// BUSCAR PRODUCTO POR ID
export async function findProductById(id) {

  return new Promise((resolve, reject) => {

    const query = "SELECT * FROM productos WHERE id = ?";

    db.query(query, [id], (err, results) => {

      if (err) {
        reject(err);
      } else {
        resolve(results[0] || null);
      }

    });

  });

}


// ACTUALIZAR PRODUCTO
export async function updateProduct(id, { name, price, category }) {

  return new Promise((resolve, reject) => {

    const query = `
      UPDATE productos
      SET nombre = ?, price = ?, category = ?
      WHERE id = ?
    `;

    db.query(query, [name, price, category, id], (err, result) => {

      if (err) {
        reject(err);
      } else {
        resolve(result);
      }

    });

  });

}


// ELIMINAR PRODUCTO
export async function deleteProduct(id) {

  return new Promise((resolve, reject) => {

    const query = "DELETE FROM productos WHERE id = ?";

    db.query(query, [id], (err, result) => {

      if (err) {
        reject(err);
      } else {
        resolve(result);
      }

    });

  });

}