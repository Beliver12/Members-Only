require('dotenv').config()
const { Pool } = require("pg");
const connectionString = "postgresql://postgres:jqRAlVaZRssGUpxYuMNztXDiMmQecreN@autorack.proxy.rlwy.net:21963/railway";
const pool = new Pool({
    connectionString,
});

module.exports = pool;