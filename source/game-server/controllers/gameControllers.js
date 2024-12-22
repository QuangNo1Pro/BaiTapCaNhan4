require('dotenv').config()
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
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

// Route game yêu cầu người dùng phải xác thực
const getGamePage = (req, res) => {
  // Dữ liệu của trò chơi, chỉ có thể truy cập khi đã đăng nhập
  res.render('homeGame', { username: req.user.username })
}

module.exports = {
  authenticateToken,
getGamePage}
