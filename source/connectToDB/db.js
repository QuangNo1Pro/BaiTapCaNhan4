const pgp = require('pg-promise')();
require('dotenv').config();

// Kết nối cơ sở dữ liệu
const connection = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Hàm kiểm tra kết nối
const testConnection = async () => {
  try {
    const result = await connection.connect(); 
    console.log('Kết nối cơ sở dữ liệu thành công');
    result.done(); 
  } catch (error) {
    console.error('Lỗi kết nối cơ sở dữ liệu:', error.message || error);
    process.exit(1);
  }
};
testConnection();

module.exports = { connection };
