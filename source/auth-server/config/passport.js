const passport = require('passport');
const bcrypt = require('bcrypt');
const { getUserByUsername, getUserById } = require('../models/Auth/AuthDatabase'); 

class CustomStrategy extends passport.Strategy {
  constructor(options = {}, verify) {
    super();
    this.name = options.name || 'custom';
    this.verify = verify;
  }

  authenticate(req, options) {
    const { username, password } = req.body;

    // Kiểm tra đầu vào hợp lệ
    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      return this.fail({ message: 'Dữ liệu đầu vào không hợp lệ.' });
    }

    this.verify(username, password, (err, user, info) => {
      if (err) {
        return this.error(err); // Trả về lỗi hệ thống
      }

      if (!user) {
        return this.fail(info || { message: 'Xác thực thất bại.' }); // Trả về thông báo lỗi người dùng
      }

      return this.success(user); // Đăng nhập thành công
    });
  }
}

// Hàm xác thực
const verify = async (username, password, done) => {
  try {
      const user = await getUserByUsername(username); // Lấy người dùng từ DB theo email
    if (!user) {
      return done(null, false, { message: 'Email không tồn tại.' });
      }
      if (!password || !user.password) {
      return done(null, false, { message: 'Dữ liệu không hợp lệ.' });
    }

    // Kiểm tra mật khẩu
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: 'Mật khẩu không đúng.' });
    }

    return done(null, user); // Xác thực thành công
  } catch (err) {
    return done(err); // Xử lý lỗi hệ thống
  }
};

// Sử dụng chiến lược tùy chỉnh cho Passport
passport.use(new CustomStrategy({}, verify));

// Lưu trữ ID người dùng vào session khi đăng nhập
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Lấy thông tin người dùng từ session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Khởi tạo passport với chiến lược tùy chỉnh
function initializePassport(passport) {
  passport.use(new CustomStrategy({}, verify));
}

module.exports = { initializePassport };
