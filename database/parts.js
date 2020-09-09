// Insert 동작을 위한 Parts - START
async function getColumns(connection, table) {
  const sql = `SHOW FULL COLUMNS FROM ${table}`;
  const column = [];
  try {
    const queryRet = (await connection.query(sql))[0];
    for (let i = 0; i < queryRet.length; i += 1) {
        column.push(queryRet[i].Field);
    }
    return column;
  } catch (err) {
    return `(Query Fail) (Get Column) ${err.sqlMessage}`;
  }
}

async function resetAutoIncrement(connection, table) {
  const sql0 = `ALTER TABLE ${table} AUTO_INCREMENT=1`;
  const sql1 = `SET @COUNT = 0`;
  const sql2 = `UPDATE ${table} SET id = @COUNT:=@COUNT+1`;
  try {
    await connection.query(sql0);
    await connection.query(sql1);
    await connection.query(sql2);
    return `Reset Auto Increment SUCCESS`;
  } catch (err) {
    return `(Query Fail) (Reset AutoIncrement) ${err.sqlMessage}`;
  }
}
// Insert 동작을 위한 Parts - END

module.exports = {
  getColumns,
  resetAutoIncrement,
};
