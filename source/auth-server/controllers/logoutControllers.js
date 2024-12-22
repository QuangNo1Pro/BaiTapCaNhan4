// controllers/authController.js
const passport = require('passport')
const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Đã xảy ra lỗi khi đăng xuất')
    }
    res.clearCookie('token');
    // Chuyển hướng về trang login
    res.redirect('/auth/login')
  })
}
module.exports = { logout}
