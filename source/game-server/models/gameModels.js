const { connection } = require('../../connectToDB/db.js')
const getAllUsers = async (id) => {
  try {
    const result = await connection.query(`
      SELECT *
      FROM s22296.users
      WHERE id != $1  
      ORDER BY "status" = 'online' DESC;
    `, [id]);
      //console.log(result);

    return result; 
  } catch (err) {
    console.error('Lỗi khi lấy danh sách người dùng:', err.message);
    throw new Error('Không thể lấy danh sách người dùng');
  }
};




module.exports = {
  getAllUsers
};