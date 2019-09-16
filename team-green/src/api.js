import * as mysql from 'mysql';
import * as util from 'util';

export default async function recoApi(req, res) {
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.TEAM_GREEN_DB_HOST,
    user: process.env.TEAM_GREEN_DB_USER,
    password: process.env.TEAM_GREEN_DB_PASSWORD,
    database: 'web',
  });
  pool.query = util.promisify(pool.query);
  let results = [];
  try {
    const rowData = await pool.query(`SELECT * FROM relatedProducts WHERE name = "${req.query.sku}"`);
    results = rowData.map(record => record['related_sku']);
    pool.end();
  } catch (err) {
    console.log(err);
    const data = {
      t_porsche: ['3', '5', '6'],
      t_fendt: ['3', '6', '4'],
      t_eicher: ['1', '8', '7'],
    };
    results = data[req.query.sku];
  }
  res.send(results);
}