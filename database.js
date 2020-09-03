const core = require("./database/core");
const parts = require("./database/parts");

const query = {
  open() {
    const pool = core.open({
      host: "10.253.70.45",
      user: "warms",
      password: "wificore1%",
      database: "react_prac",
    });
    this.pool = pool;
  },

  close(pool) {
    return core.close(pool);
  },

  async insert(...args) {
    const connRet = await core.getConnection(this.pool);
    if (connRet.err) {
      const err = `SQL Insert Fail: ${connRet.out}`;
      console.log(err);
      return { err: true, out: err };
    }
    const connection = connRet.out;

    const [table, value] = args;
    const column = await parts.getColumns(connection, table);
    const resetAI = await parts.resetAutoIncrement(connection, table);
    // console.log(`column: ${logger.stringify(column)}`);
    console.log(`resetAI: ${resetAI}`);

    const queryRet = await core.insertSQL(
      connection,
      table,
      column,
      `${value}`
    );
    const result = queryRet.err
      ? `SQL Insert Fail: ${queryRet.out}`
      : queryRet.out;
    connection.release();
    // console.log(`Insert Result = ${logger.stringify(result)}`);
    return { err: false, out: result };
  },

  async select(...args) {
    const connRet = await core.getConnection(this.pool);
    if (connRet.err) {
      const err = `SQL Select Fail: ${connRet.out}`;
      console.log(err);
      return { err: true, out: err };
    }
    const connection = connRet.out;
    const queryRet = await core.selectSQL(connection, ...args);
    const result = queryRet.err
      ? `SQL Select Fail: ${queryRet.out}`
      : queryRet.out;
    connection.release();
    // console.log(`Select Result = ${logger.stringify(result)}`);
    return { err: false, out: result };
  },

  async update(...args) {
    const connRet = await core.getConnection(this.pool);
    if (connRet.err) {
      const err = `SQL Update Fail: ${connRet.out}`;
      console.log(err);
      return { err: true, out: err };
    }
    const connection = connRet.out;
    const queryRet = await core.updateSQL(connection, ...args);
    const result = queryRet.err
      ? `SQL Update Fail: ${queryRet.out}`
      : queryRet.out;
    connection.release();
    // console.log(`Update Result = ${logger.stringify(result)}`);
    return { err: false, out: result };
  },

  async delete(...args) {
    const connRet = await core.getConnection(this.pool);
    if (connRet.err) {
      const err = `SQL Delete Fail: ${connRet.out}`;
      console.log(err);
      return { err: true, out: err };
    }
    const connection = connRet.out;
    const queryRet = await core.deleteSQL(connection, ...args);
    const result = queryRet.err
      ? `SQL Delete Fail: ${queryRet.out}`
      : queryRet.out;
    connection.release();
    // console.log(`Delete Result = ${logger.stringify(result)}`);
    return { err: false, out: result };
  },
};

module.exports = query;
