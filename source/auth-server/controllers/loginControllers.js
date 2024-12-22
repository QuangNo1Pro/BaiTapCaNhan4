const passport = require('passport');
require('dotenv').config();  
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
// Render trang đăng nhập
const renderLogin = async (req, res) => {
    // Lấy thông báo từ query parameters
    const message = req.query.message;
    res.render('login', { message });
}

// Xử lý đăng nhập
const login = async (req, res, next) => {
  passport.authenticate('custom', (err, user, info) => {
    if (err) return next(err); // Xử lý lỗi hệ thống
    if (!user) {
      return res.status(401).json({ message: info ? info.message : 'Xác thực thất bại.' }); // Xử lý khi không tìm thấy user
    }

    req.logIn(user, (err) => {
        if (err) return next(err); 
         // Tạo JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.redirect(`/auth/profiles?token=${token}`)
    });
  })(req, res, next); 
}

module.exports = {
  renderLogin,
  login
};
