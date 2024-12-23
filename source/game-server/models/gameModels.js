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

const creat_room = async (req, res) => {
    const { size } = req.body;
    try {
        const result= await connection.query(`
            INSERT INTO s22296.game_boards (size)
            VALUES ($1)`, [size]);

        res.redirect('game-room'); 
    } catch (err) {
        console.error('Error creating game room:', err.message);
        res.status(500).send('Không thể tạo phòng game');
    }
}


module.exports = {
  getAllUsers,getRanking,creat_room
};