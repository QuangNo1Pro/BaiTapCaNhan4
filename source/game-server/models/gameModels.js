const { connection } = require('../../connectToDB/db.js')
const getAllUsers = async (id) => {
  try {
    const result = await connection.query(`
     SELECT u.*, p.nickname, p.fullname, p.avatar
      FROM s22296.users u
      LEFT JOIN s22296.profiles p ON u.id = p.user_id
      WHERE u.id != $1  
      ORDER BY u."status" = 'online' DESC;
    `, [id]);
      //console.log(result);

    return result; 
  } catch (err) {
    console.error('Lỗi khi lấy danh sách người dùng:', err.message);
    throw new Error('Không thể lấy danh sách người dùng');
  }
};
const getRanking = async () => {
  try {
    const result = await connection.query(`
      SELECT u.*, p.nickname, p.fullname, p.avatar
      FROM s22296.users u
      LEFT JOIN s22296.profiles p ON u.id = p.user_id 
      ORDER BY u."status" = 'online' DESC;
    `);
      //console.log(result);

    return result; 
  } catch (err) {
    console.error('Lỗi khi lấy danh sách xếp hạng:', err.message);
    throw new Error('Không thể lấy danh sách xếp hạng');
  }
};




module.exports = {
  getAllUsers,getRanking
};