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
        const rowData = await pool.query(`SELECT * FROM teamGreenRelatedProducts WHERE sku = "${req.query.sku}"`);
        results = rowData.map(record => record['related_sku_id']);
        pool.end();
    } catch (err) {
        throw new Error(err)
    }
    res.send(results);
}