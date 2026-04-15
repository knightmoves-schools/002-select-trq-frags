const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const assert = require('assert');

function runScript(db, script) {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

describe('the SQL in the `exercise.sql` file', () => {
  let db;
  let scriptPath;

  beforeAll(() => {
    const dbPath = path.resolve(__dirname, '..', 'lesson2.db');
    db = new sqlite3.Database(dbPath);

    scriptPath = path.resolve(__dirname, '..', 'exercise.sql');
  });

  afterAll(() => {
    db.close();
  });

  it('should return only "price" and "product_name" columns from Grocery table', async () => {
      const results = await runScript(db, scriptPath);

      expect(results[0]).toHaveProperty('PRODUCT_NAME');
      expect(results[0]).toHaveProperty('PRICE');
      expect(Object.getOwnPropertyNames(results[0]).length).toBe(2);
  });
});
