require('dotenv').config()
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const { getAllUsers,getRanking  } = require('../models/gameModels')
// Middleware để xác thực JWT token
const authenticateToken = (req, res, next) => {
  const token = req.query.token; // Lấy token từ query parameter

  if (!token) {
    return res.status(403).json({ message: 'Không có token, truy cập bị từ chối.' })
  }

  // Xác thực token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token không hợp lệ.' })
    }

    // Lưu thông tin người dùng vào request để các route sau có thể sử dụng
    req.user = user
    next(); // Tiếp tục với các xử lý tiếp theo
  })
}
const showOnlineUsers = async (req, res) => {
  try {
   
    //console.log(onlineUsers);
    const username = req.user;
    const id = req.user.id;
    const token = req.session.token;
    //console.log(token);
  
    const onlineUsers = await getAllUsers(id);
    const users = await getRanking();
   // console.log(users);

    // Truyền dữ liệu vào view
    res.render('layouts/main',{ onlineUsers, username,users,token});
  } catch (err) {
    console.error('Lỗi khi lấy danh sách người dùng online:', err.message);
    res.status(500).send('Không thể lấy danh sách người dùng online');
  }
};

module.exports = {authenticateToken,showOnlineUsers}
