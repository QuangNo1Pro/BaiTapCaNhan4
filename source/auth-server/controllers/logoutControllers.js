// controllers/authController.js
const {updateUserStatus} = require('../models/Auth/AuthDatabase')
const logout = (req, res) => {
  if (req.user) {
    updateUserStatus(req.user.id, 'offline')
      .then(() => {
        req.logout((err) => {
          if (err) {
            return res.status(500).send('Đã xảy ra lỗi khi đăng xuất')
          }

          res.clearCookie('token')
          // Chuyển hướng về trang login
          res.redirect('/auth/login')
        })
      })
      .catch((err) => {
        console.error('Lỗi khi cập nhật trạng thái người dùng:', err.message || err)
        res.status(500).send('Lỗi khi cập nhật trạng thái người dùng')
      })
  } else {
    // Nếu không có người dùng đăng nhập
    res.status(400).send('Không có người dùng đăng nhập.')
  }
}
module.exports = { logout}
