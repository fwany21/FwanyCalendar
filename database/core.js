const mysql = require('mysql2/promise');

// Basic Query Funtions - START
function open(cfg) {
  return mysql.createPool(cfg);
}

function close(pool) {
  pool.end();
  return 0;
}

async function getConnection(pool) {
  try {
    /* istanbul ignore next */
    const connection = await pool.getConnection(async (conn) => conn);
    return { err: false, out: connection };
  } catch (err) {
    return { err: true, out: `(Connection Fail) ${err}` };
  }
}

async function insertSQL(connection, table, column, value) {
  const valueQ = value.split(',');
  for (let i = 0; i < valueQ.length; i += 1) {
    valueQ[i] = `'${valueQ[i].trim()}'`;
  }
  const sql = `INSERT INTO ${table} (${column}) VALUES (${valueQ})`;
  console.log(sql);

  try {
    const queryRet = await connection.query(sql);
    return { err: false, out: queryRet };
  } catch (err) {
    return { err: true, out: `(Query Fail) ${err.sqlMessage}` };
  }
}

async function selectSQL(connection, table, column, where, groupBy, orderBy, limit) {
  const columnQ = column ? `${column}` : '*';
  const whereQ = where ? `${where}` : '1';
  const groupByQ = groupBy ? ` GROUP BY ${groupBy}` : '';
  const orderByQ = orderBy ? ` ORDER BY ${orderBy}` : '';
  const limitQ = limit ? ` LIMIT ${limit}` : '';
  const sql = `SELECT ${columnQ} FROM ${table} WHERE ${whereQ + groupByQ + orderByQ + limitQ}`;
  console.log(sql);

  try {
    const queryRet = await connection.query(sql);
    const result = queryRet[0].length ? [...queryRet[0]] : 'Nothing';
    return { err: false, out: result };
  } catch (err) {
    return { err: true, out: `(Query Fail) ${err.sqlMessage}` };
  }
}

async function updateSQL(connection, table, column, value, where) {
  const columnQ = column.split(',');
  const valueQ = value.split(',');
  const whereQ = where ? `${where}` : '1';
  const columnLen = columnQ.length;
  const valueLen = valueQ.length;
  if (columnLen !== valueLen) {
    return { err: true, out: `(Query Fail) Column length(${columnLen}) != Value length(${valueLen})` };
  }
  const replace = [];
  for (let i = 0; i < columnLen; i += 1) {
    replace.push(`${columnQ[i].trim()} = '${valueQ[i].trim()}'`);
  }
  const sql = `UPDATE ${table} SET ${replace.join(',')} WHERE ${whereQ}`;
  console.log(sql);

  try {
    const queryRet = await connection.query(sql);
    return { err: false, out: queryRet };
  } catch (err) {
    return { err: true, out: `(Query Fail) ${err.sqlMessage}` };
  }
}

async function deleteSQL(connection, table, where) {
  const whereQ = where ? `${where}` : '1';
  const sql = `DELETE FROM ${table} WHERE ${whereQ}`;
  console.log(sql);

  try {
    const queryRet = await connection.query(sql);
    return { err: false, out: queryRet };
  } catch (err) {
    return { err: true, out: `(Query Fail) ${err.sqlMessage}` };
  }
}
// Basic Query Funtions - END

module.exports = {
  open,
  close,
  getConnection,
  insertSQL,
  selectSQL,
  updateSQL,
  deleteSQL,
};
