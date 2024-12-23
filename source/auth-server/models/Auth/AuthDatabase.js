const { connection } = require('../../../connectToDB/db');
const checkAccountExists = async (username) => { 
    try {
        const result = await connection.oneOrNone('SELECT * FROM s22296.users WHERE "username" = $1', [username])
        return result? true : false;
    } catch (e) {
        throw e;
    }
}
async function getUserByUsername(username) {
    const res = await connection.query('SELECT * FROM s22296.users WHERE "username" = $1', [username]);
    return res[0]
}

async function getUserById(id) {
    const res = await connection.query('SELECT * FROM s22296.users WHERE "id" = $1', [id]);
    return res[0];
}
const addUser = async (username, hashedPassword) => { 
    try {
        await connection.none('INSERT INTO s22296.users ("username","password") VALUES ($1, $2)',
            [username, hashedPassword])
        console.log('Thêm tài khoản thành công!');
    } catch (e) {
        throw e;
    }
}
const getProfileByUserId = async (userId) => {
  try {
    const profile = await connection.oneOrNone(
      'SELECT * FROM s22296.profiles WHERE "user_id" = $1',
      [userId]
    );
    return profile || null;
  } catch (err) {
    throw err;
  }
};

const updateProfile = async (userId, nickname, fullname, avatar) => {
  try {
    // Sử dụng INSERT với ON CONFLICT để chèn mới hoặc cập nhật nếu user_id đã tồn tại
    await connection.none(
      `
      INSERT INTO s22296.profiles ("user_id", "nickname", "fullname", "avatar")
      VALUES ($1, $2, $3, $4)
      `,
      [userId, nickname, fullname, avatar]
    );
    console.log('Cập nhật profile thành công!');
  } catch (err) {
    console.error('Lỗi khi cập nhật profile:', err.message || err);
    throw err;
  }
};
const updateUserStatus = async (userId, status) => {
  try {
    await connection.query('UPDATE s22296.users SET "status" = $1 WHERE "id" = $2', [status, userId]);
  } catch (err) {
    throw new Error('Lỗi khi cập nhật trạng thái người dùng: ' + err.message);
  }
};






module.exports = {getUserByUsername,getUserById,checkAccountExists,addUser,getProfileByUserId,updateProfile,updateUserStatus };
